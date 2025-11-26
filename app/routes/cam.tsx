import { useEffect, useRef, useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import * as THREE from "three";
import { DeviceOrientationControls } from "three-stdlib";

// ★重要: ここに ngrok のURLを設定 (末尾のスラッシュなし)
// 例: "https://xxxx-xxxx.ngrok-free.app"
const NGROK_URL = "https://404a5da83454.ngrok-free.app";


export const meta: MetaFunction = () => {
  return [{ title: "Invasion Camera" }];
};

// スタイル定義
const styles = {
  container: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", background: "#000" } as React.CSSProperties,
  video: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 } as React.CSSProperties,
  uiLayer: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10, pointerEvents: "none" } as React.CSSProperties,
  startButton: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", padding: "15px 30px", fontSize: "18px", background: "rgba(0,0,0,0.7)", color: "#fff", border: "2px solid #fff", borderRadius: "30px", pointerEvents: "auto", cursor: "pointer" } as React.CSSProperties,
  shutterButton: { position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", width: "80px", height: "80px", background: "rgba(255,255,255,0.2)", border: "4px solid #fff", borderRadius: "50%", pointerEvents: "auto", cursor: "pointer" } as React.CSSProperties,
  debugButton: { position: "absolute", top: "20px", right: "20px", padding: "10px", fontSize: "14px", background: "rgba(0,0,0,0.5)", color: "#fff", border: "1px solid #fff", borderRadius: "5px", pointerEvents: "auto", cursor: "pointer" } as React.CSSProperties,
  overlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "black", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" } as React.CSSProperties,
};

export default function Index() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  // デバッグモード状態管理
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

  // 2. デバッグ用ループ: ONのとき1秒おきに送信
  useEffect(() => {
    let intervalId: any;

    if (isStarted && isDebugMode) {
      console.log("デバッグ送信開始");
      intervalId = setInterval(() => {
        sendDebugPose();
      }, 1000); // 1000ms = 1秒間隔
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isStarted, isDebugMode]);

  // アプリ起動・センサー許可
  const startApp = async () => {
    try {
      if (navigator.mediaDevices && videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        videoRef.current.srcObject = stream;
      }

      // @ts-ignore DeviceOrientationEventの型定義回避
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

  // ビデオから静止画を切り出す関数
  const captureVideoFrame = (): string | null => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return null;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // JPEG形式のBase64文字列として取得
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    return dataUrl.replace(/^data:image\/(png|jpeg);base64,/, "");
  };

  // デバッグ送信 (ポーズのみ、画像なし)
  const sendDebugPose = async () => {
    if (!threeRef.current.camera) return;
    const q = threeRef.current.camera.quaternion;
    const isPortrait = window.innerHeight > window.innerWidth;

    try {
      await fetch(`${NGROK_URL}/pose`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true" // ngrok警告回避
        },
        body: JSON.stringify({ x: q.x, y: q.y, z: q.z, w: q.w, isPortrait }),
      });
      console.log("Pose updated");
    } catch (e) {
      console.error("Debug send failed", e);
    }
  };

  // 本番撮影処理 (画像あり)
  const takePhoto = async () => {
    if (!threeRef.current.camera || !videoRef.current) return;
    setIsLoading(true);

    const q = threeRef.current.camera.quaternion;
    // ビデオのサイズで縦横を判定
    const isPortrait = videoRef.current.videoHeight > videoRef.current.videoWidth;

    // 画像キャプチャ
    const imageBase64 = captureVideoFrame();
    if (!imageBase64) {
      alert("画像のキャプチャに失敗しました");
      setIsLoading(false);
      return;
    }

    try {
      console.log("送信開始: " + NGROK_URL);

      const response = await fetch(`${NGROK_URL}/snap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({ x: q.x, y: q.y, z: q.z, w: q.w, isPortrait, imageBase64 }),
      });

      if (!response.ok) throw new Error("Server Error");

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setResultImage(imageUrl);

    } catch (e: any) {
      alert("エラー: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 印刷実行関数
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={styles.container}>
      {/* 印刷用スタイル: 不要なUIを消し、画像をフィットさせる */}
      <style>{`
        @media print {
          video, button, a { display: none !important; }
          body, html { background: white !important; margin: 0 !important; padding: 0 !important; height: 100%; }
          div[style*="fixed"] { 
            position: static !important; 
            background: white !important; 
            display: block !important;
          }
          img {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            object-fit: contain; border: none !important;
          }
        }
      `}</style>

      {/* カメラ映像 */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video ref={videoRef} style={styles.video} autoPlay playsInline muted />

      {/* UIレイヤー */}
      <div style={styles.uiLayer}>
        {!isStarted ? (
          <button style={styles.startButton} onClick={startApp}>カメラ起動</button>
        ) : (
          <>
            {/* デバッグボタン */}
            <button
              style={{ ...styles.debugButton, background: isDebugMode ? "rgba(0,255,0,0.5)" : "rgba(0,0,0,0.5)" }}
              onClick={() => setIsDebugMode(!isDebugMode)}
            >
              {isDebugMode ? "Debug: ON" : "Debug: OFF"}
            </button>

            {/* シャッターボタン */}
            {!isLoading && !resultImage && (
              <button style={styles.shutterButton} onClick={takePhoto} />
            )}

            {/* ロード中表示 */}
            {isLoading && (
              <div style={{ ...styles.startButton, background: "rgba(0,0,0,0.8)" }}>
                現像中...
              </div>
            )}
          </>
        )}
      </div>

      {/* 結果表示オーバーレイ */}
      {resultImage && (
        <div style={styles.overlay}>
          <img src={resultImage} style={{ maxWidth: "100%", maxHeight: "80vh", border: "2px solid white" }} alt="Result" />

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>

            {/* 保存ボタン */}
            <a href={resultImage} download="invasion_photo.png"
              style={{ color: "white", fontSize: "18px", textAlign: "center", textDecoration: "none", border: "1px solid white", padding: "10px 20px", borderRadius: "30px" }}>
              画像を保存
            </a>

            {/* スマホからの直接印刷ボタン */}
            <button onClick={handlePrint}
              style={{ fontSize: "18px", padding: "10px 20px", borderRadius: "30px", background: "white", color: "black", border: "none", cursor: "pointer" }}>
              🖨 プリンターで印刷
            </button>

            {/* 閉じるボタン */}
            <button onClick={() => setResultImage(null)}
              style={{ fontSize: "16px", padding: "10px", background: "transparent", color: "#aaa", border: "none", cursor: "pointer" }}>
              閉じて戻る
            </button>

          </div>
        </div>
      )}
    </div>
  );
}