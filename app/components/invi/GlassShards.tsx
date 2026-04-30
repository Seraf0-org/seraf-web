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
    depth: 0.06,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.025,
    bevelThickness: 0.02,
  };
  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geom.center();
  geom.computeVertexNormals();
  return geom;
}

function ShardGroup({ count = 50, type = 0, seed = 1 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geometry = useMemo(() => createShardGeometry(type, seed), [type, seed]);

  // 破片の初期パラメータ生成
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // 画面内に収まるように範囲を調整
      const x = (Math.random() - 0.5) * 24;
      const y = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 10;
      
      // 平板ガラスの破片なので、スケールは元の形状比率を維持しつつランダムに
      const baseScale = Math.random() * 0.3 + 0.1;
      const scaleX = baseScale;
      const scaleY = baseScale * (Math.random() * 0.5 + 0.8);
      const scaleZ = baseScale;

      // 舞い上がるスピードをゆったりと
      const speed = Math.random() * 0.005 + 0.001;
      const rotSpeedX = (Math.random() - 0.5) * 0.01;
      const rotSpeedY = (Math.random() - 0.5) * 0.01;
      const rotSpeedZ = (Math.random() - 0.5) * 0.01;
      temp.push({ 
        x, y, z, 
        scaleX, scaleY, scaleZ, speed, 
        rotSpeedX, rotSpeedY, rotSpeedZ, 
        rotX: Math.random() * Math.PI, 
        rotY: Math.random() * Math.PI, 
        rotZ: Math.random() * Math.PI 
      });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!mesh.current) return;
    particles.forEach((p, i) => {
      // 下から上へゆっくり舞い上がる
      p.y += p.speed;
      if (p.y > 15) {
        p.y = -15;
        p.x = (Math.random() - 0.5) * 24;
      }
      p.rotX += p.rotSpeedX;
      p.rotY += p.rotSpeedY;
      p.rotZ += p.rotSpeedZ;

      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rotX, p.rotY, p.rotZ);
      dummy.scale.set(p.scaleX, p.scaleY, p.scaleZ);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[geometry, null as any, count]}>
      {/* リアルなガラスのマテリアル設定 */}
      <meshPhysicalMaterial 
        transmission={1}      // ガラスの透過
        transparent={true}
        opacity={1}
        roughness={0.05}      // ほぼツルツル（微小な曇り）
        metalness={0.1}
        ior={1.52}            // 実際のガラスの屈折率
        thickness={0.5}       // 屈折の深さ
        envMapIntensity={2.5} // 環境マップの映り込み
        clearcoat={1}         // 表面のクリアな反射
        clearcoatRoughness={0.1}
        iridescence={0.8}     // プリズム効果
        iridescenceIOR={1.5}
        iridescenceThicknessRange={[100, 400]}
        color="#ffffff"
        attenuationColor="#eef4ff" // 奥に行くほどほんのり青白く
        attenuationDistance={2}
      />
    </instancedMesh>
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
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1.5} />
        {/* ガラスの反射・屈折にプリズム（シアン・マゼンタ・イエロー）を強く当てる */}
        <directionalLight position={[10, 10, 10]} intensity={4} color="#00ffff" />
        <directionalLight position={[-10, -10, -10]} intensity={3} color="#ff00ff" />
        <directionalLight position={[0, -10, 10]} intensity={3} color="#ffff00" />
        
        {/* 環境マップ：ガラスの反射に必須 */}
        <Environment preset="city" />

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
