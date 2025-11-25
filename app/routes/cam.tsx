import { useEffect, useRef, useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import * as THREE from "three";
import { DeviceOrientationControls } from 'three-stdlib';

const styles = {
  container: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", background: "#000" } as React.CSSProperties,
  video: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 } as React.CSSProperties,
  uiLayer: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10, pointerEvents: "none" } as React.CSSProperties,
  startButton: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", padding: "15px 30px", fontSize: "18px", background: "rgba(0,0,0,0.7)", color: "#fff", border: "2px solid #fff", borderRadius: "30px", pointerEvents: "auto", cursor: "pointer" } as React.CSSProperties,
  shutterButton: { position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", width: "80px", height: "80px", background: "rgba(255,255,255,0.2)", border: "4px solid #fff", borderRadius: "50%", pointerEvents: "auto", cursor: "pointer" } as React.CSSProperties,
  overlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "black", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" } as React.CSSProperties,
};

export const meta: MetaFunction = () => {
  return [{ title: "Magic Camera on Remix" }];
};

// ★ここに ngrok のURLを設定
const NGROK_URL = "https://404a5da83454.ngrok-free.app";

export default function Index() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  
  // Three.js関連の変数を保持するためのRef
  const threeRef = useRef<{ camera: THREE.PerspectiveCamera; controls: DeviceOrientationControls | null }>({ camera: null!, controls: null });

  // 1. Three.jsの初期化（コンポーネントマウント時）
  useEffect(() => {
    // 画面には描画しないが、計算用にSceneを作る
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    threeRef.current.camera = camera;

    // アニメーションループ
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

  // 2. カメラ起動とセンサー許可
  const startApp = async () => {
    try {
      // カメラ映像取得
      if (navigator.mediaDevices && videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        videoRef.current.srcObject = stream;
      }

      // ジャイロセンサー許可 (iOS対応)
      // @ts-ignore DeviceOrientationEventの型定義回避
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        // @ts-ignore
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission !== 'granted') {
          alert("センサー許可が必要です");
          return;
        }
      }

      // センサーコントロール開始
      threeRef.current.controls = new DeviceOrientationControls(threeRef.current.camera);
      setIsStarted(true);

    } catch (err: any) {
      console.error(err);
      alert("起動エラー: " + err.message);
    }
  };

  // 3. 撮影処理
  const takePhoto = async () => {
    if (!threeRef.current.camera) return;
    setIsLoading(true);

    const q = threeRef.current.camera.quaternion;

    try {
      const response = await fetch(`${NGROK_URL}/snap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x: q.x, y: q.y, z: q.z, w: q.w }),
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

  return (
    <div style={styles.container}>
      {/* カメラ映像 */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video ref={videoRef} style={styles.video} autoPlay playsInline muted />

      {/* UIレイヤー */}
      <div style={styles.uiLayer}>
        {!isStarted ? (
          <button style={styles.startButton} onClick={startApp}>カメラ起動</button>
        ) : (
          !isLoading && !resultImage && (
            <button style={styles.shutterButton} onClick={takePhoto} />
          )
        )}
        
        {isLoading && (
            <div style={{ ...styles.startButton, background: "rgba(0,0,0,0.8)" }}>
                現像中...
            </div>
        )}
      </div>

      {/* 結果表示オーバーレイ */}
      {resultImage && (
        <div style={styles.overlay}>
          <img src={resultImage} style={{ maxWidth: "100%", maxHeight: "80vh", border: "2px solid white" }} alt="Result" />
          <a href={resultImage} download="magic_photo.png" style={{ color: "white", marginTop: "20px", fontSize: "18px" }}>
            画像を保存
          </a>
          <button 
            onClick={() => setResultImage(null)} 
            style={{ marginTop: "20px", padding: "10px", fontSize: "16px" }}>
            閉じて戻る
          </button>
        </div>
      )}
    </div>
  );
}