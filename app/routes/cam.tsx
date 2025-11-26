import { useEffect, useRef, useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import * as THREE from "three";
import { DeviceOrientationControls } from "three-stdlib";

// ★ ngrokのURL (末尾のスラッシュなし)
const NGROK_URL = "https://a63807827dd8.ngrok-free.app";

// ★ マーカーファイルのパス
const TARGETS_MIND_URL = "/targets.mind";

export const meta: MetaFunction = () => {
  return [
    { title: "Invasion Camera AR" },
    { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" } // ズーム禁止
  ];
};

const styles = {
  container: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", background: "#000" } as React.CSSProperties,
  uiLayer: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10, pointerEvents: "none" } as React.CSSProperties,
  startButton: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", padding: "15px 30px", fontSize: "18px", background: "rgba(0,0,0,0.7)", color: "#fff", border: "2px solid #fff", borderRadius: "30px", pointerEvents: "auto", cursor: "pointer" } as React.CSSProperties,
  shutterButton: { position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", width: "80px", height: "80px", background: "rgba(255,255,255,0.2)", border: "4px solid #fff", borderRadius: "50%", pointerEvents: "auto", cursor: "pointer" } as React.CSSProperties,
  overlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "black", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" } as React.CSSProperties,
  posLog: { position: "absolute", top: "10px", left: "10px", color: "#0f0", fontSize: "14px", fontFamily: "monospace", background: "rgba(0,0,0,0.5)", padding: "5px" } as React.CSSProperties,
};

export default function Index() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [hasPrinted, setHasPrinted] = useState(false);

  const [trackingMode, setTrackingMode] = useState<"AR" | "GYRO">("GYRO");
  const [cameraPos, setCameraPos] = useState({ x: 0, y: 0, z: 0 });

  // ライブラリ読み込み状態
  const [isLibLoaded, setIsLibLoaded] = useState(false);
  const [libError, setLibError] = useState(false);

  // デバッグモード（内部のみ保持）
  const [isDebugMode, setIsDebugMode] = useState(false);

  const mindARRef = useRef<any>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const gyroControlsRef = useRef<DeviceOrientationControls | null>(null);

  // 1. MindARライブラリの読み込み
  useEffect(() => {
    // 印刷履歴チェック
    const record = localStorage.getItem("hasInvasionPrinted");
    if (record === "true") setHasPrinted(true);

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js";
    script.async = true;

    script.onload = () => {
      console.log("MindAR Loaded Successfully");
      setIsLibLoaded(true);
    };

    script.onerror = () => {
      console.error("MindAR Load Failed");
      setLibError(true);
      alert("ARエンジンの読み込みに失敗しました。");
    };

    document.body.appendChild(script);

    return () => {
      if (mindARRef.current) mindARRef.current.stop();
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  // 2. デバッグループ
  useEffect(() => {
    let intervalId: any;
    if (isStarted && isDebugMode) {
      intervalId = setInterval(() => sendDebugPose(), 1000);
    }
    return () => clearInterval(intervalId);
  }, [isStarted, isDebugMode]);

  const startApp = async () => {
    if (!isLibLoaded || !containerRef.current || !(window as any).MINDAR) return;

    try {
      // @ts-ignore
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        // @ts-ignore
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission !== 'granted') { alert("センサー許可が必要です"); return; }
      }

      setIsStarted(true);

      const MindARThree = (window as any).MINDAR.IMAGE.MindARThree;
      const mindarThree = new MindARThree({
        container: containerRef.current,
        imageTargetSrc: TARGETS_MIND_URL,
        filterMinCF: 0.0001,
        filterBeta: 0.001,
      });

      mindARRef.current = mindarThree;
      const { renderer, scene, camera } = mindarThree;

      // ジャイロ初期化
      const gyroControls = new DeviceOrientationControls(camera);
      gyroControlsRef.current = gyroControls;

      // マーカー設定
      const anchor = mindarThree.addAnchor(0);
      // デバッグ用の箱（不要なら opacity: 0 にしてください）
      const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
      const box = new THREE.Mesh(geometry, material);
      anchor.group.add(box);

      await mindarThree.start();
      videoElementRef.current = mindarThree.video;

      // ハイブリッド・トラッキングループ
      renderer.setAnimationLoop(() => {
        if (anchor.group.visible) {
          // ARモード
          setTrackingMode("AR");
          const cameraWorldPos = new THREE.Vector3();
          camera.getWorldPosition(cameraWorldPos);
          const localCamPos = anchor.group.worldToLocal(cameraWorldPos.clone());
          setCameraPos({ x: localCamPos.x, y: localCamPos.y, z: localCamPos.z });
        } else {
          // ジャイロモード
          setTrackingMode("GYRO");
          gyroControls.update();
          camera.position.set(0, 0, 0);
          setCameraPos({ x: 0, y: 0, z: 0 });
        }
        renderer.render(scene, camera);
      });

    } catch (err: any) {
      console.error(err);
      alert("エラー: " + err.message);
      setIsStarted(false);
    }
  };

  const captureVideoFrame = (): string | null => {
    const video = videoElementRef.current;
    if (!video || video.videoWidth === 0) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // ★最高画質(1.0)で取得
    const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
    return dataUrl.replace(/^data:image\/(png|jpeg);base64,/, "");
  };

  const takePhoto = async () => {
    if (!videoElementRef.current) return;

    // 画面フリーズ
    videoElementRef.current.pause();
    setIsLoading(true);

    const camera = mindARRef.current.camera;
    const q = camera.quaternion;
    const p = cameraPos;
    const isPortrait = videoElementRef.current.videoHeight > videoElementRef.current.videoWidth;
    const imageBase64 = captureVideoFrame();

    if (!imageBase64) {
      alert("画像のキャプチャに失敗しました");
      setIsLoading(false);
      videoElementRef.current.play();
      return;
    }

    try {
      const response = await fetch(`${NGROK_URL}/snap`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
        body: JSON.stringify({
          x: q.x, y: q.y, z: q.z, w: q.w,
          posX: p.x, posY: p.y, posZ: p.z,
          isPortrait, imageBase64
        }),
      });

      if (!response.ok) {
        if (response.status === 503) throw new Error("サーバーが混み合っています。少し待って再試行してください。");
        throw new Error("Server Error");
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setResultImage(imageUrl);

    } catch (e: any) {
      alert("エラー: " + e.message);
      videoElementRef.current.play();
    } finally {
      setIsLoading(false);
    }
  };

  const sendDebugPose = async () => {
    if (!mindARRef.current) return;
    const q = mindARRef.current.camera.quaternion;
    const isPortrait = window.innerHeight > window.innerWidth;
    try {
      await fetch(`${NGROK_URL}/pose`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
        body: JSON.stringify({ x: q.x, y: q.y, z: q.z, w: q.w, isPortrait }),
      });
    } catch (e) { }
  };

  const handlePrintOnPC = async () => {
    if (!confirm("PCのプリンターで印刷しますか？\n※印刷できるのは1回のみです")) return;
    try {
      const response = await fetch(`${NGROK_URL}/print`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
        body: JSON.stringify({}),
      });
      if (response.ok) {
        alert("印刷指示を送りました！");
        setHasPrinted(true);
        localStorage.setItem("hasInvasionPrinted", "true");
      }
      else if (response.status === 403) {
        alert("エラー：この端末（ネットワーク）からは既に印刷済みです。");
        setHasPrinted(true);
      }
      else { alert("印刷指示に失敗しました。"); }
    } catch (e: any) { alert("通信エラー: " + e.message); }
  };

  const handleClose = () => {
    setResultImage(null);
    if (videoElementRef.current) videoElementRef.current.play();
  };

  return (
    <div ref={containerRef} style={styles.container}>

      {/* ★追加: アプリ化（スクロール禁止）のためのスタイル */}
      <style>{`
        /* アプリ全体の設定: スクロール・ズーム・選択を禁止 */
        html, body {
          margin: 0; padding: 0; width: 100%; height: 100%;
          overflow: hidden !important;
          overscroll-behavior: none;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
        }
        /* 印刷時の設定 */
        @media print {
          video, button, a, div[class*="posLog"] { display: none !important; }
          body, html { background: white !important; margin: 0 !important; padding: 0 !important; height: 100%; overflow: visible !important; }
          div[style*="fixed"] { position: static !important; background: white !important; display: block !important; }
          img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; border: none !important; }
        }
      `}</style>

      {/* デバッグUI */}
      <div style={styles.posLog}>
        MODE: <span style={{ color: trackingMode === "AR" ? "cyan" : "orange" }}>{trackingMode}</span><br />
        X: {cameraPos.x.toFixed(2)}<br />
        Y: {cameraPos.y.toFixed(2)}<br />
        Z: {cameraPos.z.toFixed(2)}
      </div>

      <div style={styles.uiLayer}>
        {!isStarted ? (
          <button
            style={{
              ...styles.startButton,
              opacity: isLibLoaded ? 1 : 0.5,
              background: libError ? "red" : styles.startButton.background
            }}
            onClick={startApp}
            disabled={!isLibLoaded || libError}
          >
            {libError ? "読込エラー" : isLibLoaded ? "ARカメラ起動" : "準備中..."}
          </button>
        ) : (
          <>
            {!isLoading && !resultImage && (
              <button style={styles.shutterButton} onClick={takePhoto} />
            )}
            {isLoading && (
              <div style={{ ...styles.startButton, background: "rgba(0,0,0,0.8)" }}>現像中...</div>
            )}
          </>
        )}
      </div>

      {resultImage && (
        <div style={styles.overlay}>
          <img src={resultImage} style={{ maxWidth: "100%", maxHeight: "80vh", border: "2px solid white" }} alt="Result" />
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
            <a href={resultImage} download="invasion_photo.png"
              style={{ color: "white", fontSize: "18px", textAlign: "center", textDecoration: "none", border: "1px solid white", padding: "10px 20px", borderRadius: "30px" }}>
              画像をスマホに保存
            </a>
            {!hasPrinted ? (
              <button onClick={handlePrintOnPC}
                style={{ fontSize: "18px", padding: "10px 20px", borderRadius: "30px", background: "white", color: "black", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                🖨 PCで印刷する (1回のみ)
              </button>
            ) : (
              <div style={{ color: "#aaa", fontSize: "16px", textAlign: "center", border: "1px dashed #aaa", padding: "10px", borderRadius: "10px" }}>
                印刷済みです
              </div>
            )}
            <button onClick={handleClose}
              style={{ fontSize: "16px", padding: "10px", background: "transparent", color: "#aaa", border: "none", cursor: "pointer" }}>
              閉じて戻る
            </button>
          </div>
        </div>
      )}
    </div>
  );
}