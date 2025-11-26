import { useEffect, useRef, useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import * as THREE from "three";
import { DeviceOrientationControls } from "three-stdlib";

// ★ ngrokのURL (末尾のスラッシュなし)
const NGROK_URL = "https://a63807827dd8.ngrok-free.app";

export const meta: MetaFunction = () => {
  return [
    { title: "Invasion Camera" },
    { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" }
  ];
};

const styles = {
  container: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", background: "#000" } as React.CSSProperties,
  video: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 } as React.CSSProperties,
  uiLayer: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10, pointerEvents: "none" } as React.CSSProperties,
  startButton: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", padding: "15px 30px", fontSize: "18px", background: "rgba(0,0,0,0.7)", color: "#fff", border: "2px solid #fff", borderRadius: "30px", pointerEvents: "auto", cursor: "pointer" } as React.CSSProperties,
  shutterButton: { position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", width: "80px", height: "80px", background: "rgba(255,255,255,0.2)", border: "4px solid #fff", borderRadius: "50%", pointerEvents: "auto", cursor: "pointer" } as React.CSSProperties,
  overlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "black", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" } as React.CSSProperties,
};

export default function Index() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [hasPrinted, setHasPrinted] = useState(false);

  // デバッグ機能（内部ロジックのみ保持）
  const [isDebugMode, setIsDebugMode] = useState(false);

  const threeRef = useRef<{ camera: THREE.PerspectiveCamera; controls: DeviceOrientationControls | null }>({ camera: null!, controls: null });

  // 1. Three.js 初期化 (計算用)
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    threeRef.current.camera = camera;

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (threeRef.current.controls) {
        threeRef.current.controls.update();
      }
    };
    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  // 2. デバッグループ
  useEffect(() => {
    let intervalId: any;
    if (isStarted && isDebugMode) {
      intervalId = setInterval(() => sendDebugPose(), 1000);
    }
    return () => clearInterval(intervalId);
  }, [isStarted, isDebugMode]);

  // 3. 印刷履歴チェック
  useEffect(() => {
    const record = localStorage.getItem("hasInvasionPrinted");
    if (record === "true") {
      setHasPrinted(true);
    }
  }, []);

  const startApp = async () => {
    try {
      if (navigator.mediaDevices && videoRef.current) {
        // 高画質(4K)を要求
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 4096 },
            height: { ideal: 2160 }
          }
        });
        videoRef.current.srcObject = stream;
      }

      // ジャイロセンサー許可 (iOS対応)
      // @ts-ignore
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        // @ts-ignore
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission !== 'granted') {
          alert("センサー許可が必要です");
          return;
        }
      }

      threeRef.current.controls = new DeviceOrientationControls(threeRef.current.camera);
      setIsStarted(true);

    } catch (err: any) {
      console.error(err);
      alert("起動エラー: " + err.message);
    }
  };

  const captureVideoFrame = (): string | null => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return null;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 最高画質(1.0)でJPEG変換
    const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
    return dataUrl.replace(/^data:image\/(png|jpeg);base64,/, "");
  };

  const sendDebugPose = async () => {
    if (!threeRef.current.camera) return;
    const q = threeRef.current.camera.quaternion;
    const isPortrait = window.innerHeight > window.innerWidth;

    try {
      await fetch(`${NGROK_URL}/pose`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
        // 位置情報(posX,Y,Z)は0固定で送る
        body: JSON.stringify({
          x: q.x, y: q.y, z: q.z, w: q.w,
          posX: 0, posY: 0, posZ: 0,
          isPortrait
        }),
      });
    } catch (e) { }
  };

  const takePhoto = async () => {
    if (!threeRef.current.camera || !videoRef.current) return;

    videoRef.current.pause();
    setIsLoading(true);

    const q = threeRef.current.camera.quaternion;
    const isPortrait = videoRef.current.videoHeight > videoRef.current.videoWidth;
    const imageBase64 = captureVideoFrame();

    if (!imageBase64) {
      alert("画像のキャプチャに失敗しました");
      setIsLoading(false);
      videoRef.current.play();
      return;
    }

    try {
      const response = await fetch(`${NGROK_URL}/snap`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
        body: JSON.stringify({
          x: q.x, y: q.y, z: q.z, w: q.w,
          posX: 0, posY: 0, posZ: 0, // 位置は0固定
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
      videoRef.current.play();
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
        alert("エラー：この端末（ネットワーク）からは既に印刷済みです。");
        setHasPrinted(true);
      }
      else {
        alert("印刷指示に失敗しました。");
      }
    } catch (e: any) {
      alert("通信エラー: " + e.message);
    }
  };

  const handleClose = () => {
    setResultImage(null);
    if (videoRef.current) videoRef.current.play();
  };

  return (
    <div style={styles.container}>

      {/* アプリ化スタイル（スクロール禁止） */}
      <style>{`
        html, body {
          margin: 0; padding: 0; width: 100%; height: 100%;
          overflow: hidden !important;
          overscroll-behavior: none;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
          -webkit-touch-callout: none;
        }
        @media print {
          video, button, a { display: none !important; }
          body, html { background: white !important; margin: 0 !important; padding: 0 !important; height: 100%; overflow: visible !important; }
          div[style*="fixed"] { position: static !important; background: white !important; display: block !important; }
          img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; border: none !important; }
        }
      `}</style>

      {/* カメラ映像 */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video ref={videoRef} style={styles.video} autoPlay playsInline muted />

      {/* UI */}
      <div style={styles.uiLayer}>
        {!isStarted ? (
          <button style={styles.startButton} onClick={startApp}>カメラ起動</button>
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

      {/* 結果表示 */}
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