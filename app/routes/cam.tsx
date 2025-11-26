import { useEffect, useRef, useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import * as THREE from "three";
import { DeviceOrientationControls } from "three-stdlib";

const NGROK_URL = "https://xxxx-xxxx.ngrok-free.app";
const TARGETS_MIND_URL = "/targets.mind";

export const meta: MetaFunction = () => {
  return [{ title: "Invasion Camera AR" }];
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

  // ★追加: ライブラリ読み込み状態管理
  const [isLibLoaded, setIsLibLoaded] = useState(false);
  const [libError, setLibError] = useState(false);

  const mindARRef = useRef<any>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const gyroControlsRef = useRef<DeviceOrientationControls | null>(null);

  useEffect(() => {
    const record = localStorage.getItem("hasInvasionPrinted");
    if (record === "true") setHasPrinted(true);

    // ★修正: 読み込み完了とエラーを検知する
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js";
    script.async = true;

    script.onload = () => {
      console.log("MindAR Loaded Successfully");
      setIsLibLoaded(true); // 読み込み完了！
    };

    script.onerror = () => {
      console.error("MindAR Load Failed");
      setLibError(true); // エラー発生
      alert("ARエンジンの読み込みに失敗しました。\nネット環境を確認するか、広告ブロッカーをOFFにしてください。");
    };

    document.body.appendChild(script);

    return () => {
      if (mindARRef.current) mindARRef.current.stop();
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const startApp = async () => {
    // ボタンが無効化されているはずだが、念の為チェック
    if (!isLibLoaded || !containerRef.current || !(window as any).MINDAR) {
      return;
    }

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

      const gyroControls = new DeviceOrientationControls(camera);
      gyroControlsRef.current = gyroControls;

      const anchor = mindarThree.addAnchor(0);

      const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
      const box = new THREE.Mesh(geometry, material);
      anchor.group.add(box);

      await mindarThree.start();
      videoElementRef.current = mindarThree.video;

      renderer.setAnimationLoop(() => {
        if (anchor.group.visible) {
          setTrackingMode("AR");
          const cameraWorldPos = new THREE.Vector3();
          camera.getWorldPosition(cameraWorldPos);
          const localCamPos = anchor.group.worldToLocal(cameraWorldPos.clone());
          setCameraPos({ x: localCamPos.x, y: localCamPos.y, z: localCamPos.z });
        } else {
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
    const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
    return dataUrl.replace(/^data:image\/(png|jpeg);base64,/, "");
  };

  const takePhoto = async () => {
    if (!videoElementRef.current) return;
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

      if (!response.ok) throw new Error("Server Error");
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
        alert("エラー：この端末からは既に印刷済みです。");
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
      <div style={styles.posLog}>
        MODE: <span style={{ color: trackingMode === "AR" ? "cyan" : "orange" }}>{trackingMode}</span><br />
        X: {cameraPos.x.toFixed(2)}<br />
        Y: {cameraPos.y.toFixed(2)}<br />
        Z: {cameraPos.z.toFixed(2)}
      </div>

      <div style={styles.uiLayer}>
        {!isStarted ? (
          // ★修正: 読み込み完了するまでボタンを押せなくし、表示を変える
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