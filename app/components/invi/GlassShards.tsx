import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

// ガラス破片の不規則な形状を生成（頂点が多く、凹みや鋭角を持つ）
function createShardGeometry(type: number, seed: number) {
  // seedを使って決定論的なランダム性を作る
  const rng = (n: number) => {
    const x = Math.sin(seed * 9301 + n * 49297) * 0.5 + 0.5;
    return x;
  };

  const shape = new THREE.Shape();

  if (type === 0) {
    // 非常に鋭く、長い剣のような破片（ジャグド付き）
    shape.moveTo(0.05 * rng(1), 1.8);
    shape.lineTo(0.35 + rng(2) * 0.1, 0.9);
    shape.lineTo(0.55, 0.1 + rng(3) * 0.15);
    shape.lineTo(0.2 + rng(4) * 0.1, -0.4);
    shape.lineTo(0.05, -1.2 - rng(5) * 0.3);
    shape.lineTo(-0.15 - rng(6) * 0.1, -0.5);
    shape.lineTo(-0.4 - rng(7) * 0.1, 0.2);
    shape.lineTo(-0.25, 0.7 + rng(8) * 0.2);
    shape.lineTo(-0.1, 1.3);
  } else if (type === 1) {
    // 大きな多角形、斜めに割れた板ガラス（片側が鋭く、片側がなだらか）
    shape.moveTo(-0.8 - rng(1) * 0.15, 1.1);
    shape.lineTo(0.1, 1.3 + rng(2) * 0.1);
    shape.lineTo(0.6 + rng(3) * 0.1, 0.7);
    shape.lineTo(0.85, 0.0);
    shape.lineTo(0.7 + rng(4) * 0.1, -0.5);
    shape.lineTo(0.3, -1.0 - rng(5) * 0.2);
    shape.lineTo(-0.3 - rng(6) * 0.15, -1.1);
    shape.lineTo(-0.8, -0.4 - rng(7) * 0.1);
    shape.lineTo(-0.6 - rng(8) * 0.1, 0.3);
  } else if (type === 2) {
    // 細長い三角に近い破片（鋭角が2つ）
    shape.moveTo(0.0, 2.0 + rng(1) * 0.2);
    shape.lineTo(0.25 + rng(2) * 0.1, 0.5);
    shape.lineTo(0.5 + rng(3) * 0.1, -0.3);
    shape.lineTo(0.15, -1.0 - rng(4) * 0.2);
    shape.lineTo(-0.05 - rng(5) * 0.1, 0.1);
    shape.lineTo(-0.3 - rng(6) * 0.1, 0.6);
    shape.lineTo(-0.1, 1.3 + rng(7) * 0.2);
  } else if (type === 3) {
    // 薄く横長の破片（クラッシュした窓ガラス）
    shape.moveTo(-1.5 - rng(1) * 0.2, 0.35);
    shape.lineTo(-0.9 - rng(2) * 0.1, 0.6 + rng(3) * 0.1);
    shape.lineTo(-0.2, 0.55);
    shape.lineTo(0.4 + rng(4) * 0.15, 0.7);
    shape.lineTo(1.0 + rng(5) * 0.2, 0.4);
    shape.lineTo(1.6, 0.1 + rng(6) * 0.1);
    shape.lineTo(1.3 + rng(7) * 0.1, -0.35);
    shape.lineTo(0.5, -0.5 - rng(8) * 0.1);
    shape.lineTo(-0.1 - rng(9) * 0.1, -0.4);
    shape.lineTo(-0.7, -0.55 - rng(10) * 0.1);
    shape.lineTo(-1.2 - rng(11) * 0.1, -0.3);
    shape.lineTo(-1.6, -0.05);
  } else if (type === 4) {
    // Lの字に近い、角が欠けた形
    shape.moveTo(-0.3, 1.4 + rng(1) * 0.2);
    shape.lineTo(0.5 + rng(2) * 0.1, 1.2);
    shape.lineTo(0.4, 0.4 + rng(3) * 0.1);
    shape.lineTo(1.2 + rng(4) * 0.15, 0.3);
    shape.lineTo(1.1, -0.2 - rng(5) * 0.1);
    shape.lineTo(0.3 + rng(6) * 0.1, -0.3);
    shape.lineTo(0.2, -1.1 - rng(7) * 0.2);
    shape.lineTo(-0.5 - rng(8) * 0.1, -1.0);
    shape.lineTo(-0.6, -0.1 + rng(9) * 0.1);
    shape.lineTo(-0.4 - rng(10) * 0.1, 0.7);
  } else if (type === 5) {
    // Z字型の動的な破片
    shape.moveTo(-0.2, 1.6 + rng(1) * 0.15);
    shape.lineTo(0.6 + rng(2) * 0.1, 1.5);
    shape.lineTo(0.7, 0.8 + rng(3) * 0.1);
    shape.lineTo(0.1 + rng(4) * 0.1, 0.3);
    shape.lineTo(0.8, -0.1 - rng(5) * 0.1);
    shape.lineTo(0.9 + rng(6) * 0.1, -0.7);
    shape.lineTo(0.1, -0.9 - rng(7) * 0.2);
    shape.lineTo(-0.5 - rng(8) * 0.1, -0.8);
    shape.lineTo(-0.6, -0.2 + rng(9) * 0.1);
    shape.lineTo(-0.1 - rng(10) * 0.1, 0.2);
    shape.lineTo(-0.7, 0.6 + rng(11) * 0.1);
    shape.lineTo(-0.5, 1.2 + rng(12) * 0.1);
  } else {
    // 非常に不規則な多角形（8〜9頂点、ギザギザ）
    shape.moveTo(0.0, 1.5 + rng(1) * 0.3);
    shape.lineTo(0.5 + rng(2) * 0.2, 1.1);
    shape.lineTo(0.8 + rng(3) * 0.15, 0.4);
    shape.lineTo(0.6, -0.2 - rng(4) * 0.15);
    shape.lineTo(0.9 + rng(5) * 0.1, -0.6);
    shape.lineTo(0.4 + rng(6) * 0.2, -1.2 - rng(7) * 0.2);
    shape.lineTo(-0.3 - rng(8) * 0.15, -1.0);
    shape.lineTo(-0.7 - rng(9) * 0.1, -0.3);
    shape.lineTo(-0.5, 0.5 + rng(10) * 0.15);
    shape.lineTo(-0.2 - rng(11) * 0.1, 1.0);
  }

  const extrudeSettings = {
    depth: 0.09,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.035,
  };
  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geom.center();
  geom.computeVertexNormals();
  return geom;
}

function ShardGroup({ count = 50, type = 0, seed = 1 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const prismMesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geometry = useMemo(() => createShardGeometry(type, seed), [type, seed]);
  const prismGeometry = useMemo(() => new THREE.PlaneGeometry(1, 2.4), []);
  const prismTexture = useMemo(() => {
    const width = 8;
    const height = 96;
    const data = new Uint8Array(width * height * 4);
    const stops = [
      { at: 0.0, color: [34, 211, 238, 0] },
      { at: 0.18, color: [34, 211, 238, 140] },
      { at: 0.36, color: [96, 165, 250, 90] },
      { at: 0.52, color: [255, 255, 255, 38] },
      { at: 0.66, color: [244, 114, 182, 122] },
      { at: 0.84, color: [250, 204, 21, 102] },
      { at: 1.0, color: [250, 204, 21, 0] },
    ];

    for (let y = 0; y < height; y++) {
      const t = y / (height - 1);
      const nextIndex = stops.findIndex((stop) => stop.at >= t);
      const right = stops[Math.max(1, nextIndex)];
      const left = stops[Math.max(0, nextIndex - 1)];
      const localT = (t - left.at) / Math.max(0.001, right.at - left.at);

      for (let x = 0; x < width; x++) {
        const offset = (y * width + x) * 4;
        data[offset] = THREE.MathUtils.lerp(left.color[0], right.color[0], localT);
        data[offset + 1] = THREE.MathUtils.lerp(left.color[1], right.color[1], localT);
        data[offset + 2] = THREE.MathUtils.lerp(left.color[2], right.color[2], localT);
        data[offset + 3] = THREE.MathUtils.lerp(left.color[3], right.color[3], localT);
      }
    }

    const texture = new THREE.DataTexture(data, width, height);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // 破片の初期パラメータ生成
  const particles = useMemo(() => {
    const temp: Array<{
      x: number;
      y: number;
      z: number;
      scaleX: number;
      scaleY: number;
      scaleZ: number;
      speed: number;
      scrollY: number;
      scrollX: number;
      depthLayer: number;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      rotX: number;
      rotY: number;
      rotZ: number;
    }> = [];
    for (let i = 0; i < count; i++) {
      // 奥行きの差を強める。手前ほど大きく、スクロールにも強く反応する。
      const depthLayer = Math.pow(Math.random(), 0.75);
      const x = (Math.random() - 0.5) * THREE.MathUtils.lerp(30, 18, depthLayer);
      const y = (Math.random() - 0.5) * 36;
      const z = THREE.MathUtils.lerp(-18, 8, depthLayer);
      
      // 平板ガラスの破片なので、スケールは元の形状比率を維持しつつランダムに
      const baseScale = THREE.MathUtils.lerp(0.16, 0.72, depthLayer) * (Math.random() * 0.45 + 0.9);
      const scaleX = baseScale * THREE.MathUtils.lerp(0.8, 1.35, Math.random());
      const scaleY = baseScale * (Math.random() * 0.7 + 1.0);
      const scaleZ = baseScale;

      // 舞い上がるスピードをゆったりと
      const speed = Math.random() * 0.004 + 0.0008;
      const scrollY = THREE.MathUtils.lerp(0.001, 0.0085, depthLayer);
      const scrollX = (Math.random() - 0.5) * THREE.MathUtils.lerp(0.0005, 0.0035, depthLayer);
      const rotSpeedX = (Math.random() - 0.5) * THREE.MathUtils.lerp(0.004, 0.014, depthLayer);
      const rotSpeedY = (Math.random() - 0.5) * THREE.MathUtils.lerp(0.004, 0.014, depthLayer);
      const rotSpeedZ = (Math.random() - 0.5) * THREE.MathUtils.lerp(0.004, 0.014, depthLayer);
      temp.push({ 
        x, y, z,
        scaleX, scaleY, scaleZ, speed,
        scrollY, scrollX, depthLayer,
        rotSpeedX, rotSpeedY, rotSpeedZ, 
        rotX: Math.random() * Math.PI, 
        rotY: Math.random() * Math.PI, 
        rotZ: Math.random() * Math.PI 
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const scrollTop = typeof window === 'undefined' ? 0 : window.scrollY;
    const time = state.clock.elapsedTime;

    particles.forEach((p, i) => {
      // 下から上へゆっくり舞い上がる
      p.y += p.speed;
      if (p.y > 18) {
        p.y = -18;
        p.x = (Math.random() - 0.5) * THREE.MathUtils.lerp(30, 18, p.depthLayer);
      }
      p.rotX += p.rotSpeedX;
      p.rotY += p.rotSpeedY;
      p.rotZ += p.rotSpeedZ;

      const scrollShiftY = scrollTop * p.scrollY;
      const scrollShiftX = scrollTop * p.scrollX;
      const wrappedY = THREE.MathUtils.euclideanModulo(p.y + scrollShiftY + 18, 36) - 18;
      const floatX = Math.sin(time * 0.35 + i * 1.7) * THREE.MathUtils.lerp(0.04, 0.35, p.depthLayer);
      const floatZ = Math.cos(time * 0.22 + i) * THREE.MathUtils.lerp(0.05, 0.7, p.depthLayer);
      const scalePulse = 1 + Math.sin(time * 0.45 + i) * 0.035 * p.depthLayer;

      dummy.position.set(p.x + scrollShiftX + floatX, wrappedY, p.z + floatZ);
      dummy.rotation.set(
        p.rotX + scrollTop * 0.00018 * p.depthLayer,
        p.rotY - scrollTop * 0.00012 * p.depthLayer,
        p.rotZ + scrollTop * 0.00022 * p.depthLayer
      );
      dummy.scale.set(p.scaleX * scalePulse, p.scaleY * scalePulse, p.scaleZ);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);

      if (prismMesh.current) {
        dummy.position.set(p.x + scrollShiftX + floatX + 0.04, wrappedY - 0.04, p.z + floatZ - 0.08);
        dummy.rotation.set(p.rotX, p.rotY, p.rotZ + 0.2);
        dummy.scale.set(i % 2 === 0 ? p.scaleX * 0.7 * scalePulse : 0, i % 2 === 0 ? p.scaleY * 1.05 * scalePulse : 0, 1);
        dummy.updateMatrix();
        prismMesh.current.setMatrixAt(i, dummy.matrix);
      }
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (prismMesh.current) {
      prismMesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <instancedMesh ref={prismMesh} args={[prismGeometry, null as any, count]} renderOrder={-1}>
        <meshBasicMaterial
          map={prismTexture}
          transparent
          opacity={0.42}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
      <instancedMesh ref={mesh} args={[geometry, null as any, count]}>
        {/* リアルなガラスのマテリアル設定 */}
        <meshPhysicalMaterial
          transmission={1}
          transparent
          opacity={0.92}
          roughness={0.015}
          metalness={0}
          ior={1.78}
          thickness={1.25}
          envMapIntensity={4.5}
          clearcoat={1}
          clearcoatRoughness={0.03}
          reflectivity={1}
          iridescence={1}
          iridescenceIOR={2.1}
          iridescenceThicknessRange={[80, 900]}
          color="#ffffff"
          attenuationColor="#dff7ff"
          attenuationDistance={0.85}
        />
      </instancedMesh>
    </>
  );
}

export function GlassShards({ 
  count = 200, 
  className = "absolute inset-0 z-[1] pointer-events-none opacity-80" 
}: { 
  count?: number;
  className?: string;
}) {
  // 7種類の形状に均等に分配
  const countPerGroup = Math.floor(count / 7);
  const remainder = count % 7;

  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 16], fov: 50 }} gl={{ alpha: true, antialias: true }}>
        <fog attach="fog" args={['#ffffff', 18, 42]} />
        <ambientLight intensity={0.75} />
        {/* ガラスの反射・屈折にプリズム（シアン・マゼンタ・イエロー）を強く当てる */}
        <directionalLight position={[10, 10, 10]} intensity={5.5} color="#22d3ee" />
        <directionalLight position={[-10, -8, -8]} intensity={4.8} color="#f472b6" />
        <directionalLight position={[0, -10, 10]} intensity={4.2} color="#fde047" />
        <pointLight position={[-4, 3, 8]} intensity={35} distance={18} color="#60a5fa" />
        <pointLight position={[5, -3, 6]} intensity={28} distance={16} color="#fb7185" />
        <pointLight position={[0, 6, 4]} intensity={18} distance={14} color="#fef3c7" />
        
        {/* 環境マップ：ガラスの反射に必須 */}
        <Environment preset="sunset" />

        <Float speed={0.5} rotationIntensity={0.5} floatIntensity={1}>
          <ShardGroup count={countPerGroup + remainder} type={0} seed={1.0} />
          <ShardGroup count={countPerGroup} type={1} seed={2.3} />
          <ShardGroup count={countPerGroup} type={2} seed={3.7} />
          <ShardGroup count={countPerGroup} type={3} seed={5.1} />
          <ShardGroup count={countPerGroup} type={4} seed={7.9} />
          <ShardGroup count={countPerGroup} type={5} seed={11.3} />
          <ShardGroup count={countPerGroup} type={6} seed={13.6} />
        </Float>
      </Canvas>
    </div>
  );
}
