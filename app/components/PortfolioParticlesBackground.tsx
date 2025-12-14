import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

type Props = {
  isDark: boolean;
};

export function PortfolioParticlesBackground({ isDark }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0, 0, 160);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 1.2 : 1.1;
    container.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      isDark ? 1.15 : 0.95, // strength
      1.2,                  // radius
      0.0                   // threshold
    );
    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    const count = 1400;
    const positions = new Float32Array(count * 3);
    const basePositions = new Float32Array(count * 3);
    const phases = new Float32Array(count);

    const dustCount = 900;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustAlpha = new Float32Array(dustCount);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 40 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      basePositions[i3] = x;
      basePositions[i3 + 1] = y;
      basePositions[i3 + 2] = z;
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      phases[i] = Math.random() * Math.PI * 2;
    }

    for (let i = 0; i < dustCount; i++) {
      const i3 = i * 3;
      const radius = 20 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      dustPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      dustPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      dustPositions[i3 + 2] = radius * Math.cos(phi);
      dustAlpha[i] = 0.35 + Math.random() * 0.55;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 2.0,
      color: isDark ? 0x38bdf8 : 0x06b6d4,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ふわっとした粒子層
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute("alpha", new THREE.BufferAttribute(dustAlpha, 1));

    const dustMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(isDark ? 0x67e8f9 : 0x0ea5e9) },
        uSize: { value: 18.0 },
      },
      vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = uSize * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          float mask = smoothstep(0.5, 0.1, d);
          gl_FragColor = vec4(uColor, mask * vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const dustPoints = new THREE.Points(dustGeometry, dustMaterial);
    dustPoints.scale.setScalar(1.35);
    scene.add(dustPoints);

    const ringGeometry = new THREE.TorusGeometry(65, 0.6, 8, 120);
    const ring = new THREE.LineSegments(
      new THREE.EdgesGeometry(ringGeometry),
      new THREE.LineBasicMaterial({
        color: isDark ? 0x8b5cf6 : 0x7c3aed,
        transparent: true,
        opacity: 0.45,
      })
    );
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    let frameId = 0;
    const clock = new THREE.Clock();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    let targetRotX = 0;
    let targetRotY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      targetRotY = nx * 0.4;
      targetRotX = -ny * 0.25;
    };
    window.addEventListener("pointermove", handlePointerMove);

    const animate = () => {
      const t = clock.getElapsedTime();
      const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const baseX = basePositions[i3];
        const baseY = basePositions[i3 + 1];
        const baseZ = basePositions[i3 + 2];

        const wave = Math.sin(t * 0.9 + phases[i]) * 6;
        const swirl = Math.sin(t * 0.3 + (baseX + baseZ) * 0.01) * 4;

        pos.array[i3] = baseX + Math.sin(t * 0.4 + baseY * 0.02) * 2;
        pos.array[i3 + 1] = baseY + wave;
        pos.array[i3 + 2] = baseZ + swirl;
      }
      pos.needsUpdate = true;

      points.rotation.y = THREE.MathUtils.lerp(points.rotation.y, targetRotY + 0.0009 * t, 0.08);
      points.rotation.x = THREE.MathUtils.lerp(points.rotation.x, 0.05 * Math.sin(t * 0.2) + targetRotX, 0.08);
      dustPoints.rotation.y = THREE.MathUtils.lerp(dustPoints.rotation.y, targetRotY * 0.6, 0.05);
      dustPoints.rotation.x = THREE.MathUtils.lerp(dustPoints.rotation.x, targetRotX * 0.4, 0.05);
      ring.rotation.z += 0.0006;
      ring.rotation.x = THREE.MathUtils.lerp(ring.rotation.x, Math.PI / 2 + targetRotX * 0.6, 0.08);
      ring.rotation.y = THREE.MathUtils.lerp(ring.rotation.y, targetRotY * 0.6, 0.08);
      composer.render();
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", handlePointerMove);
      container.removeChild(renderer.domElement);
      renderer.dispose();
      composer.dispose();
      renderPass.dispose?.();
      bloomPass.dispose?.();
      geometry.dispose();
      dustGeometry.dispose();
      ringGeometry.dispose();
    };
  }, [isDark]);

  return <div ref={containerRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden />;
}

