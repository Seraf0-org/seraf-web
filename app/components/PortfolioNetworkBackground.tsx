import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer, RenderPass, UnrealBloomPass, ShaderPass, FXAAShader } from "three-stdlib";

type Props = {
  isDark: boolean;
};

export function PortfolioNetworkBackground({ isDark }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0, 0, 180);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 1.18 : 1.1;
    container.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.material.uniforms["resolution"].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      isDark ? 1.25 : 1.0,
      1.1,
      0.0
    );
    composer.addPass(renderPass);
    composer.addPass(fxaaPass);
    composer.addPass(bloomPass);

    const group = new THREE.Group();
    scene.add(group);

    const NODE_COUNT = 140;
    const RADIUS = 170;
    const positions = new Float32Array(NODE_COUNT * 3);
    const velocities = new Float32Array(NODE_COUNT * 3);
    const phases = new Float32Array(NODE_COUNT);

    for (let i = 0; i < NODE_COUNT; i++) {
      const i3 = i * 3;
      const radius = Math.cbrt(Math.random()) * RADIUS;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      velocities[i3] = (Math.random() - 0.5) * 0.08;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.08;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.08;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const nodesGeometry = new THREE.BufferGeometry();
    nodesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const nodesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        // プロジェクトで使っているシアン寄りの水色に統一（やや薄め）
        uColor: { value: new THREE.Color(isDark ? 0x7deeff : 0x94f0ff) },
        uSize: { value: 9 },
      },
      vertexShader: `
        uniform float uSize;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = uSize * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          float mask = smoothstep(0.5, 0.1, d);
          float alpha = clamp(mask * 0.85, 0.0, 1.0);
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const nodes = new THREE.Points(nodesGeometry, nodesMaterial);
    group.add(nodes);

    const MAX_SEGMENTS = NODE_COUNT * 7;
    const linePositions = new Float32Array(MAX_SEGMENTS * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: isDark ? 0x7deeff : 0x94f0ff,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(lines);

    // triangles（3点以上の結びつき用）
    const MAX_TRIS = NODE_COUNT * 10;
    const triPositions = new Float32Array(MAX_TRIS * 9);
    const triGeometry = new THREE.BufferGeometry();
    triGeometry.setAttribute("position", new THREE.BufferAttribute(triPositions, 3).setUsage(THREE.DynamicDrawUsage));
    const triMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0x67e8f9 : 0x7ae8ff,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const tris = new THREE.Mesh(triGeometry, triMaterial);
    group.add(tris);

    let frameId = 0;
    const clock = new THREE.Clock();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
      fxaaPass.material.uniforms["resolution"].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    const tmpPos = new THREE.Vector3();
    const tmpPosB = new THREE.Vector3();
    const tmpPosC = new THREE.Vector3();

    const animate = () => {
      const t = clock.getElapsedTime();
      // update nodes
      for (let i = 0; i < NODE_COUNT; i++) {
        const i3 = i * 3;
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];

        // radial push to avoid center clumping
        const px = positions[i3];
        const py = positions[i3 + 1];
        const pz = positions[i3 + 2];
        const r = Math.sqrt(px * px + py * py + pz * pz) + 0.0001;
        const outward = Math.max(0, 1 - r / (RADIUS * 0.85));
        const inward = 0.0008; // 常時わずかに中心へ
        const edgeClamp = r > RADIUS * 1.05 ? 0.0025 : 0; // 外周で強めに戻す
        const pulse = Math.pow(Math.max(0, Math.sin(t * 0.35 + phases[i])), 3); // たまに強く寄る
        const factor = outward * 0.0015 - inward - edgeClamp - pulse * 0.014;
        positions[i3] += (px / r) * factor;
        positions[i3 + 1] += (py / r) * factor;
        positions[i3 + 2] += (pz / r) * factor;

        // subtle breathing
        positions[i3 + 1] += Math.sin(t * 0.8 + phases[i]) * 0.05;

        // bounds (soft bounce)
        for (let k = 0; k < 3; k++) {
          const idx = i3 + k;
          if (positions[idx] > RADIUS || positions[idx] < -RADIUS) {
            velocities[idx] *= -0.9;
            positions[idx] = THREE.MathUtils.clamp(positions[idx], -RADIUS, RADIUS);
          }
        }
      }
      nodesGeometry.attributes.position.needsUpdate = true;

      // rebuild line segments
      let segCount = 0;
      const threshold = 44;
      const triThreshold = 36;
      const neighbors: number[][] = Array.from({ length: NODE_COUNT }, () => []);

      for (let i = 0; i < NODE_COUNT; i++) {
        tmpPos.fromArray(positions, i * 3);
        for (let j = i + 1; j < NODE_COUNT; j++) {
          tmpPosB.fromArray(positions, j * 3);
          const dist = tmpPos.distanceTo(tmpPosB);
          if (dist < threshold && segCount < MAX_SEGMENTS) {
            const base = segCount * 6;
            linePositions[base] = tmpPos.x;
            linePositions[base + 1] = tmpPos.y;
            linePositions[base + 2] = tmpPos.z;
            linePositions[base + 3] = tmpPosB.x;
            linePositions[base + 4] = tmpPosB.y;
            linePositions[base + 5] = tmpPosB.z;
            segCount++;
          }
          if (dist < triThreshold) {
            neighbors[i].push(j);
            neighbors[j].push(i);
          }
        }
      }
      lineGeometry.setDrawRange(0, segCount * 2);
      lineGeometry.attributes.position.needsUpdate = true;

      // smooth opacity transitions to avoid sudden pop-in/out
      const targetLineOpacity = isDark
        ? 0.75 + Math.min(segCount / MAX_SEGMENTS, 0.6) * 0.25
        : 0.65 + Math.min(segCount / MAX_SEGMENTS, 0.6) * 0.25;
      lineMaterial.opacity = THREE.MathUtils.lerp(lineMaterial.opacity, targetLineOpacity, 0.12);

      // triangles build from neighbor sets
      let triCount = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        const neigh = neighbors[i];
        if (neigh.length < 2) continue;
        tmpPos.fromArray(positions, i * 3);
        for (let a = 0; a < neigh.length; a++) {
          for (let b = a + 1; b < neigh.length; b++) {
            const j = neigh[a];
            const k = neigh[b];
            if (j <= i || k <= i) continue; // avoid duplicates
            tmpPosB.fromArray(positions, j * 3);
            tmpPosC.fromArray(positions, k * 3);
            const d1 = tmpPosB.distanceTo(tmpPosC);
            if (d1 < triThreshold && triCount < MAX_TRIS) {
              const base = triCount * 9;
              triPositions[base] = tmpPos.x;
              triPositions[base + 1] = tmpPos.y;
              triPositions[base + 2] = tmpPos.z;
              triPositions[base + 3] = tmpPosB.x;
              triPositions[base + 4] = tmpPosB.y;
              triPositions[base + 5] = tmpPosB.z;
              triPositions[base + 6] = tmpPosC.x;
              triPositions[base + 7] = tmpPosC.y;
              triPositions[base + 8] = tmpPosC.z;
              triCount++;
            }
          }
        }
      }
      triGeometry.setDrawRange(0, triCount * 3);
      triGeometry.attributes.position.needsUpdate = true;
      const targetTriOpacity = (isDark ? 0.12 : 0.1) + Math.min(triCount / MAX_TRIS, 0.6) * 0.05;
      triMaterial.opacity = THREE.MathUtils.lerp(triMaterial.opacity, targetTriOpacity, 0.12);

      group.rotation.y = 0.0015 * t + 0.0006 * Math.sin(t * 0.7);
      group.rotation.x = 0.0008 * t + 0.0004 * Math.cos(t * 0.9);

      composer.render();
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
      composer.dispose();
      renderPass.dispose?.();
      fxaaPass.dispose?.();
      bloomPass.dispose?.();
      nodesGeometry.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      triGeometry.dispose();
      triMaterial.dispose();
    };
  }, [isDark]);

  return <div ref={containerRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden />;
}

