import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function createRng(seed: number) {
  return (offset: number) => {
    const value = Math.sin(seed * 92821 + offset * 68917) * 43758.5453;
    return value - Math.floor(value);
  };
}

function ArchiveGrid() {
  const geometry = useMemo(() => {
    const points: number[] = [];
    const depth = 26;
    const width = 18;
    const height = 12;

    for (let z = -depth; z <= 6; z += 2) {
      points.push(-width, -height, z, width, -height, z);
      points.push(-width, height, z, width, height, z);
      points.push(-width, -height, z, -width, height, z);
      points.push(width, -height, z, width, height, z);
    }

    for (let x = -width; x <= width; x += 2) {
      points.push(x, -height, -depth, x, -height, 6);
      points.push(x, height, -depth, x, height, 6);
    }

    for (let y = -height; y <= height; y += 2) {
      points.push(-width, y, -depth, -width, y, 6);
      points.push(width, y, -depth, width, y, 6);
    }

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return buffer;
  }, []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#38bdf8" transparent opacity={0.13} />
    </lineSegments>
  );
}

function ArchiveParticles() {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const rng = createRng(42.2);
    const positions: number[] = [];
    for (let i = 0; i < 900; i += 1) {
      positions.push(
        THREE.MathUtils.lerp(-15, 15, rng(i + 1)),
        THREE.MathUtils.lerp(-9, 9, rng(i + 2)),
        THREE.MathUtils.lerp(-30, 5, rng(i + 3))
      );
    }
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return buffer;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.045;
    ref.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.06) * 0.025;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial color="#bae6fd" size={0.028} transparent opacity={0.46} depthWrite={false} />
    </points>
  );
}

function HologramShaderField() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uAspect: { value: 1 },
    }),
    []
  );

  useFrame((state) => {
    if (!material.current) return;
    const scrollTop = typeof window === "undefined" ? 0 : window.scrollY;
    material.current.uniforms.uTime.value = state.clock.elapsedTime;
    material.current.uniforms.uScroll.value = scrollTop * 0.001;
    material.current.uniforms.uAspect.value = state.viewport.width / state.viewport.height;
  });

  return (
    <mesh position={[0, 0, -12]} scale={[28, 16, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          precision highp float;

          uniform float uTime;
          uniform float uScroll;
          uniform float uAspect;
          varying vec2 vUv;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
          }

          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
              mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
              u.y
            );
          }

          float fbm(vec2 p) {
            float v = 0.0;
            float a = 0.5;
            mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
            for (int i = 0; i < 5; i++) {
              v += noise(p) * a;
              p = r * p * 2.05 + 0.17;
              a *= 0.48;
            }
            return v;
          }

          float line(float value, float target, float width) {
            return 1.0 - smoothstep(0.0, width, abs(value - target));
          }

          void main() {
            vec2 uv = vUv;
            vec2 p = (uv - 0.5) * vec2(uAspect, 1.0);
            float t = uTime * 0.18 + uScroll;

            float radial = length(p);
            float angle = atan(p.y, p.x);
            float field = fbm(p * 4.2 + vec2(t * 0.9, -t * 0.45));
            float fine = fbm(p * 14.0 + vec2(-t * 1.6, t));

            float rings = 0.0;
            rings += line(fract(radial * 6.0 - t * 1.4), 0.08, 0.018);
            rings += line(fract(radial * 10.0 + sin(angle * 4.0) * 0.08 - t * 0.8), 0.04, 0.012);

            float columns = pow(line(fract((uv.x + field * 0.035) * 18.0), 0.03, 0.018), 1.4);
            float rows = pow(line(fract((uv.y - t * 0.34 + fine * 0.018) * 28.0), 0.02, 0.016), 1.2);
            float scan = pow(line(fract(uv.y * 3.2 - uTime * 0.22), 0.08, 0.045), 2.0);
            float caustic = sin((p.x + field * 0.28) * 18.0 + t * 5.2) * sin((p.y - fine * 0.18) * 14.0 - t * 4.0);
            caustic = smoothstep(0.82, 1.0, caustic);
            float ray = pow(max(0.0, sin(angle * 9.0 + t * 2.0)), 8.0) * smoothstep(0.05, 0.95, radial) * smoothstep(1.0, 0.25, radial);

            float gate = smoothstep(0.88, 0.18, radial);
            float archive = (rings * 1.15 + columns * rows * 0.65 + scan * 0.36 + caustic * 0.52 + ray * 0.34) * gate;
            float nebula = smoothstep(0.44, 0.98, field) * 0.24 * gate;

            vec3 cyan = vec3(0.20, 0.86, 1.0);
            vec3 blue = vec3(0.08, 0.28, 0.78);
            vec3 pink = vec3(1.0, 0.28, 0.72);
            vec3 color = mix(blue, cyan, field);
            color = mix(color, pink, smoothstep(0.55, 1.0, p.x + field * 0.45));
            color += cyan * archive;
            color += pink * rings * 0.22;
            color += vec3(0.55, 0.95, 1.0) * caustic * 0.35;

            float alpha = archive * 0.34 + nebula;
            alpha *= smoothstep(0.0, 0.16, uv.y) * smoothstep(1.0, 0.76, uv.y);
            alpha = clamp(alpha, 0.0, 0.58);

            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  );
}

function ArchiveShelves() {
  const group = useRef<THREE.Group>(null);
  const geometry = useMemo(() => {
    const points: number[] = [];
    const widths = [12, 10.5, 9.2, 7.8, 6.4];
    const levels = [-4.8, -2.4, 0, 2.4, 4.8];

    levels.forEach((y, row) => {
      for (let i = 0; i < 9; i += 1) {
        const z = -4 - i * 2.8;
        const w = widths[(row + i) % widths.length];
        points.push(-w, y, z, w, y, z);
        points.push(-w, y - 0.42, z - 0.45, w, y - 0.42, z - 0.45);
        points.push(-w, y, z, -w, y - 0.42, z - 0.45);
        points.push(w, y, z, w, y - 0.42, z - 0.45);
      }
    });

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return buffer;
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const scrollTop = typeof window === "undefined" ? 0 : window.scrollY;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.08 + scrollTop * 0.0007;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color="#7dd3fc" transparent opacity={0.22} />
      </lineSegments>
    </group>
  );
}

function IndexNetwork() {
  const ref = useRef<THREE.LineSegments>(null);
  const geometry = useMemo(() => {
    const rng = createRng(77.4);
    const nodes = Array.from({ length: 54 }, (_, index) => ({
      x: THREE.MathUtils.lerp(-10, 10, rng(index + 1)),
      y: THREE.MathUtils.lerp(-5.8, 6.2, rng(index + 2)),
      z: THREE.MathUtils.lerp(-24, -2, rng(index + 3)),
    }));
    const points: number[] = [];

    nodes.forEach((node, index) => {
      const next = nodes[(index + 7) % nodes.length];
      const near = nodes[(index + 13) % nodes.length];
      if (index % 2 === 0) points.push(node.x, node.y, node.z, next.x, next.y, next.z);
      if (index % 5 === 0) points.push(node.x, node.y, node.z, near.x, near.y, near.z);
    });

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return buffer;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.07) * 0.06;
    (ref.current.material as THREE.LineBasicMaterial).opacity = 0.08 + Math.sin(state.clock.elapsedTime * 0.9) * 0.025;
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#f0abfc" transparent opacity={0.1} />
    </lineSegments>
  );
}

function DataRain() {
  const ref = useRef<THREE.LineSegments>(null);
  const geometry = useMemo(() => {
    const rng = createRng(19.9);
    const points: number[] = [];
    for (let i = 0; i < 92; i += 1) {
      const x = THREE.MathUtils.lerp(-13, 13, rng(i + 1));
      const y = THREE.MathUtils.lerp(-7, 8, rng(i + 2));
      const z = THREE.MathUtils.lerp(-26, 3, rng(i + 3));
      const length = THREE.MathUtils.lerp(0.18, 0.85, rng(i + 4));
      points.push(x, y, z, x, y - length, z - length * 0.35);
    }
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return buffer;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const scrollTop = typeof window === "undefined" ? 0 : window.scrollY;
    ref.current.position.y = THREE.MathUtils.euclideanModulo(-state.clock.elapsedTime * 0.75 - scrollTop * 0.001, 3) - 1.5;
    (ref.current.material as THREE.LineBasicMaterial).opacity = 0.14 + Math.sin(state.clock.elapsedTime * 1.6) * 0.03;
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#bae6fd" transparent opacity={0.15} />
    </lineSegments>
  );
}

function ScanBeam() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const y = THREE.MathUtils.euclideanModulo(state.clock.elapsedTime * 1.4 + 6.5, 13) - 6.5;
    ref.current.position.y = y;
    (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.07 + Math.sin(state.clock.elapsedTime * 2.2) * 0.025;
  });

  return (
    <mesh ref={ref} position={[0, 0, -2]}>
      <planeGeometry args={[24, 0.34]} />
      <meshBasicMaterial color="#67e8f9" transparent opacity={0.08} depthWrite={false} />
    </mesh>
  );
}

function ArchiveScene() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.04;
    group.current.position.z = Math.sin(state.clock.elapsedTime * 0.11) * 0.35;
  });

  return (
    <group ref={group} rotation={[0.08, 0, 0]}>
      <HologramShaderField />
      <ArchiveGrid />
      <ArchiveShelves />
      <IndexNetwork />
      <DataRain />
      <ArchiveParticles />
      <ScanBeam />
    </group>
  );
}

export function ArchiveBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-95">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 9], fov: 56, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#071018"]} />
        <fog attach="fog" args={["#071018", 8, 34]} />
        <ArchiveScene />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent,rgba(2,6,23,0.28)_44%,rgba(2,6,23,0.88)_100%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:100%_4px]" />
    </div>
  );
}
