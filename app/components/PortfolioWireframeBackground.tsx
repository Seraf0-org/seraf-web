import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

type Props = {
  isDark: boolean;
};

export function PortfolioWireframeBackground({ isDark }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0, 0, 120);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 1.25 : 1.12;
    container.appendChild(renderer.domElement);

    // Postprocessing (bloom)
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      isDark ? 1.35 : 1.05, // strength
      1.25,                 // radius
      0.0                   // threshold
    );
    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    const edgeColor = new THREE.Color(isDark ? 0x67e8f9 : 0x0ea5e9);
    const wireMaterial = new THREE.LineBasicMaterial({
      color: edgeColor,
      transparent: true,
      opacity: 0.7,
    });

    const geo = new THREE.IcosahedronGeometry(45, 2);
    const edges = new THREE.EdgesGeometry(geo);
    const wireframe = new THREE.LineSegments(edges, wireMaterial);
    wireframe.rotation.x = 0.3;
    scene.add(wireframe);

    const secondaryGeo = new THREE.TorusKnotGeometry(18, 4, 150, 32);
    const secondaryEdges = new THREE.EdgesGeometry(secondaryGeo);
    const glowMaterial = new THREE.LineBasicMaterial({
      color: edgeColor,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const glow = new THREE.LineSegments(edges, glowMaterial);
    glow.scale.setScalar(1.08);
    scene.add(glow);

    const secondary = new THREE.LineSegments(
      secondaryEdges,
      new THREE.LineBasicMaterial({
        color: isDark ? 0x818cf8 : 0x7c3aed,
        transparent: true,
        opacity: 0.4,
      })
    );
    secondary.rotation.x = -0.4;
    secondary.rotation.y = 0.4;
    scene.add(secondary);

    const grid = new THREE.GridHelper(500, 60, edgeColor, edgeColor);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.14;
    grid.position.y = -90;
    scene.add(grid);

    let frameId = 0;
    const clock = new THREE.Clock();

    const onResize = () => {
      if (!containerRef.current) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    let targetRotX = 0;
    let targetRotY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      targetRotY = nx * 0.3;
      targetRotX = -ny * 0.2;
    };
    window.addEventListener("pointermove", handlePointerMove);

    const animate = () => {
      const t = clock.getElapsedTime();
      wireframe.rotation.y += 0.0025;
      wireframe.rotation.x = THREE.MathUtils.lerp(
        wireframe.rotation.x,
        0.25 + Math.sin(t * 0.45) * 0.06 + targetRotX,
        0.06
      );
      wireframe.rotation.y = THREE.MathUtils.lerp(
        wireframe.rotation.y,
        wireframe.rotation.y + targetRotY,
        0.08
      );
      secondary.rotation.x = THREE.MathUtils.lerp(secondary.rotation.x, -0.4 + targetRotX * 1.2, 0.08);
      secondary.rotation.y = THREE.MathUtils.lerp(secondary.rotation.y, 0.4 + targetRotY * 1.2, 0.08);
      (grid.material as THREE.Material).opacity = 0.06 + 0.02 * Math.sin(t * 0.8);

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
      geo.dispose();
      edges.dispose();
      secondaryGeo.dispose();
      secondaryEdges.dispose();
    };
  }, [isDark]);

  return <div ref={containerRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden />;
}

