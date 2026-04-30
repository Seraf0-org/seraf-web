import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // 画面全体を覆うようにクリップ空間の座標を直接指定
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  // 疑似ランダムノイズ
  float random(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  // スムースノイズ
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // フラクタルノイズ（雲の表現）
  float fbm(vec2 p) {
    float f = 0.0;
    float amp = 0.5;
    for(int i = 0; i < 5; i++) {
      f += amp * noise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return f;
  }

  void main() {
    vec2 uv = vUv;
    
    // 時間でゆっくり流れる雲の座標
    vec2 cloudUv = uv * 2.5 + vec2(uTime * 0.015, -uTime * 0.005);
    float n = fbm(cloudUv);
    
    // モノトーン基調の中に、ごくわずかに空の色（青・ピンク）を匂わせる洗練されたパレット
    vec3 topColor = vec3(0.92, 0.94, 0.97);    // 非常に淡いブルーグレー
    vec3 midColor = vec3(0.98, 0.98, 0.99);    // ほぼ純白
    vec3 pinkColor = vec3(0.97, 0.93, 0.95);   // ごく薄いダスティピンク
    vec3 bottomColor = vec3(1.0, 0.99, 0.99);  // ピュアホワイトに近い色
    
    // Y軸ベースのシームレスなグラデーション
    vec3 color = mix(bottomColor, pinkColor, smoothstep(0.0, 0.35, uv.y));
    color = mix(color, midColor, smoothstep(0.25, 0.65, uv.y));
    color = mix(color, topColor, smoothstep(0.55, 1.0, uv.y));
    
    // 雲（ノイズ）のブレンド
    // 白〜ごく薄いグレーの雲をブレンドし、モノトーン感を強調
    float cloudMask = n * smoothstep(1.0, 0.0, uv.y - 0.2);
    vec3 cloudColor = mix(vec3(1.0, 1.0, 1.0), vec3(0.95, 0.95, 0.96), uv.y);
    color = mix(color, cloudColor, cloudMask * 0.6);

    // コントラストを抑えて上品に
    color = pow(color, vec3(0.95)); 

    gl_FragColor = vec4(color, 1.0);
  }
`;

function SkyPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh>
      {/* 画面全体を覆うため、サイズ2のPlaneを使用（クリップ空間全体） */}
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 }
        }}
        depthWrite={false}
      />
    </mesh>
  );
}

export function SkyBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas>
        <SkyPlane />
      </Canvas>
    </div>
  );
}
