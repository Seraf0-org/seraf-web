import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

// 3種類の異なるガラス片形状（板ガラスが割れたような形）を生成
function createShardGeometry(type: number) {
  const shape = new THREE.Shape();
  
  if (type === 0) {
    // 鋭く尖ったナイフのような破片
    shape.moveTo(0, 1.5);
    shape.lineTo(0.4, -1.0);
    shape.lineTo(-0.3, -0.8);
    shape.lineTo(-0.1, 0.2);
  } else if (type === 1) {
    // 台形・多角形の破片
    shape.moveTo(-0.6, 1.0);
    shape.lineTo(0.5, 1.2);
    shape.lineTo(0.8, -0.2);
    shape.lineTo(0.2, -1.2);
    shape.lineTo(-0.7, -0.5);
  } else {
    // 長方形に近いが斜めに割れた破片
    shape.moveTo(-0.4, 1.8);
    shape.lineTo(0.3, 1.5);
    shape.lineTo(0.5, -1.5);
    shape.lineTo(-0.5, -1.2);
  }

  const extrudeSettings = {
    depth: 0.08,           // 板ガラスの厚み
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.03,       // 割れ目のエッジ（光を鋭く反射させる）
    bevelThickness: 0.03,
  };
  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geom.center();
  geom.computeVertexNormals();
  return geom;
}

function ShardGroup({ count = 50, type = 0 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geometry = useMemo(() => createShardGeometry(type), [type]);

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
  const countPerGroup = Math.floor(count / 3);

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
          <ShardGroup count={countPerGroup} type={0} />
          <ShardGroup count={countPerGroup} type={1} />
          <ShardGroup count={countPerGroup + (count % 3)} type={2} />
        </Float>
      </Canvas>
    </div>
  );
}
