import { useEffect, useId, useRef } from "react";
import type { CSSProperties } from "react";
import * as THREE from "three";
import { EffectComposer, RenderPass, ShaderPass, RGBShiftShader } from "three-stdlib";

type Props = { isDark: boolean };

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function isTouchLikeDevice() {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    (navigator.maxTouchPoints ?? 0) > 0 ||
    window.matchMedia?.("(pointer: coarse)")?.matches === true
  );
}

export function ThreeBackground({ isDark }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number | null>(null); // For entry animation
  const noiseId = useId();
  const svgFilterId = `noise-${noiseId.replace(/:/g, "")}`;

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // reduced-motion はWebGLを止める（健康/省電力優先）
    // if (prefersReducedMotion()) return; // ユーザー要望により強制描画

    // タッチ/低性能っぽい環境は「低負荷モード」で動かす（見えないのが最悪なのでOFFしない）
    const lowPower = isTouchLikeDevice();

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      50,
    );
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.5 : 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    // threeの型バージョン差分対策
    (renderer as any).physicallyCorrectLights = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // Exposureが高すぎると色が白飛び（Desaturate）して虹色が消えるので、少し抑える
    renderer.toneMappingExposure = isDark ? 1.0 : 1.0;
    container.appendChild(renderer.domElement);

    // Post-Processing Setup
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // RGB Shift (Chromatic Aberration)
    const rgbShiftPass = new ShaderPass(RGBShiftShader);
    // Amount: 画面に対するシフト量。0.005くらいで結構見える。リファレンスは強め。
    rgbShiftPass.uniforms["amount"].value = 0.0025;
    rgbShiftPass.uniforms["angle"].value = 0.0;
    composer.addPass(rgbShiftPass);

    // Canvasが確実に背景全面を覆うように
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.pointerEvents = "none";

    // ライティング（ガラスが見える最低限）
    const ambient = new THREE.AmbientLight(0xffffff, isDark ? 1.2 : 0.9);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xe0f2fe, isDark ? 1.3 : 1.0);
    key.position.set(2, 2, 4);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x7dd3fc, isDark ? 1.0 : 0.7);
    rim.position.set(-3, 1, -2);
    scene.add(rim);

    // 背景が暗いので、ガラスの輪郭が出る弱い発光ライトを追加
    const glow = new THREE.PointLight(isDark ? 0x22d3ee : 0x0ea5e9, isDark ? 1.2 : 0.7, 25);
    glow.position.set(-2.2, -0.8, 3.2);
    scene.add(glow);

    // 簡易の環境反射（CanvasTexture → PMREM）
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envCanvas = document.createElement("canvas");
    envCanvas.width = 256;
    envCanvas.height = 128;
    const ctx = envCanvas.getContext("2d");
    if (ctx) {
      const g = ctx.createLinearGradient(0, 0, envCanvas.width, envCanvas.height);
      g.addColorStop(0, isDark ? "#0b1020" : "#f8fafc");
      // ハイライトを強めにして、ガラスの反射を出す
      g.addColorStop(0.35, isDark ? "#22d3ee" : "#93c5fd");
      g.addColorStop(0.55, isDark ? "#0ea5e9" : "#dbeafe");
      g.addColorStop(1, isDark ? "#05070c" : "#ffffff");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, envCanvas.width, envCanvas.height);

      // 反射の“筋”を追加（擬似HDR）
      // 色収差（RGBズレ）を表現するために、R/G/Bのラインを少しずらして描く
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = "screen"; // 加算合成で光を重ねる

      // User Request: "Whitish" -> Reduce pure saturation, boost white.
      // Base White Glow (全体を少し白く)
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.fillRect(0, 40, envCanvas.width, 50);

      // Red (Upper) - Slightly paler
      ctx.fillStyle = "#ff4444";
      ctx.fillRect(0, 30, envCanvas.width, 6);

      // Green (Center) - Slightly paler
      ctx.fillStyle = "#44ff44";
      ctx.fillRect(0, 64, envCanvas.width, 6);

      // Blue (Lower) - Pale Blue instead of Deep Blue
      ctx.fillStyle = "#4488ff";
      ctx.fillRect(0, 98, envCanvas.width, 8);

      // White core (Stronger/Wider white highlight)
      ctx.fillStyle = "#ffffff";
      ctx.globalAlpha = 1.0;
      ctx.fillRect(0, 65, envCanvas.width, 4); // Wider line for main reflection

      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = "source-over";
    }
    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    const envRT = pmrem.fromEquirectangular(envTex);
    scene.environment = envRT.texture;

    // ガラス片（InstancedMesh）
    // User Request: "Increase count slightly"
    const shardCount = lowPower ? (isDark ? 80 : 65) : (isDark ? 150 : 110);
    // “板ガラス片”っぽく薄く -> "Vivid+Co"風にクリーンな直方体・キューブに -> "破片（Shard）"感
    // Icosahedron(0)は20面体だが、スケールを歪ませることで「砕けた岩/結晶」のような形になる
    const shardGeo = new THREE.IcosahedronGeometry(0.2, 0);

    // エッジを丸めるならRoundedBoxだが、まずは標準Boxでシャープさを出す
    const shardMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x202020 : 0xffffff, // 完全に黒ではなく、少しグレーにして白さを拾いやすく
      roughness: 0.0,
      metalness: 1.0, // 金属のように周囲を反射させる
      transmission: 0.0,
      thickness: 0.0,
      ior: 2.33,
      transparent: true,
      opacity: isDark ? 0.6 : 0.25, // 黒をしっかり出すためにOpacityを上げる
      side: THREE.BackSide,
      blending: THREE.NormalBlending,
      depthWrite: false,

      // Iridescence (虹色干渉)
      iridescence: 1.0,
      iridescenceIOR: 1.8,
      iridescenceThicknessRange: [100, 800],

      // 白飛びしない程度に強く
      envMapIntensity: 4.0,
    });

    // 以下のdispersionはThree.js r160+でtransmission>0の時のみ有効だが、
    // transmission=0の黒体反射では意味がないため設定しない（あるいは物理的に正しくないがとりあえず入れてみる）
    // (shardMat as any).dispersion = 5.0;
    shardMat.side = THREE.DoubleSide;
    shardMat.vertexColors = false; // 黒ベースにするので頂点カラー（白系）はオフにする
    // 暗い背景でも“存在”が分かる程度の弱い発光（ガラスの縁の補助）
    shardMat.emissive = new THREE.Color(isDark ? 0x22d3ee : 0x0ea5e9);
    shardMat.emissiveIntensity = isDark ? 0.0 : 0.1; // リファレンスは自己発光していないので、環境反射に任せる（0.0にする）

    // Fresnel（縁が光る）をonBeforeCompileで注入
    // リファレンスのような「白いハイライト」のエッジにする
    const fresnelColor = new THREE.Color(isDark ? 0xffffff : 0xdef7ff);
    const fresnelPower = isDark ? 5.0 : 3.0;
    const fresnelIntensity = isDark ? 10.0 : 2.0; // エッジだけ強烈に白く光らせる
    const fresnelAlpha = isDark ? 1.0 : 0.8;

    shardMat.onBeforeCompile = (shader) => {
      shader.uniforms.uFresnelColor = { value: fresnelColor };
      shader.uniforms.uFresnelPower = { value: fresnelPower };
      shader.uniforms.uFresnelIntensity = { value: fresnelIntensity };
      shader.uniforms.uFresnelAlpha = { value: fresnelAlpha };

      // NOTE: uniformsは自動宣言されないので、必ずシェーダに宣言を注入する
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        `#include <common>
         uniform vec3 uFresnelColor;
         uniform float uFresnelPower;
         uniform float uFresnelIntensity;
         uniform float uFresnelAlpha;`,
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <normal_fragment_begin>",
        `#include <normal_fragment_begin>
         float fresnel = pow(1.0 - abs(dot(normalize(vViewPosition), normalize(normal))), uFresnelPower);
         fresnel = clamp(fresnel, 0.0, 1.0);`,
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <output_fragment>",
        `outgoingLight += uFresnelColor * fresnel * uFresnelIntensity;
         diffuseColor.a = max(diffuseColor.a, fresnel * uFresnelAlpha);
         #include <output_fragment>`,
      );
    };
    shardMat.needsUpdate = true;

    const shards = new THREE.InstancedMesh(shardGeo, shardMat, shardCount);
    shards.frustumCulled = false;
    scene.add(shards);

    const dummy = new THREE.Object3D();
    // Orbit parameters
    const initialAngle = new Array<number>(shardCount);
    const radius = new Array<number>(shardCount);
    const speed = new Array<number>(shardCount);
    const rotSpeed = new Array<{ x: number; y: number; z: number }>(shardCount);
    const scale = new Array<number>(shardCount);
    // Random rotation for the shard itself
    const rot = new Array<{ x: number; y: number; z: number }>(shardCount);

    for (let i = 0; i < shardCount; i++) {
      // Ring distribution: Inner radius ~3, Outer ~6 -> Narrower: ~2.2 to ~5.0
      // User Request: "Revert radius spread" -> Wider again.
      // Revert to approx [2.2, 5.0]
      const r = 2.2 + Math.random() * 2.8;
      // Distribute randomly around the circle
      const theta = Math.random() * Math.PI * 2;

      radius[i] = r;
      initialAngle[i] = theta;
      // Speed depends on radius (physically closer = faster, but artistically constant or random is fine)
      // Let's make them move gracefully
      speed[i] = 0.1 + Math.random() * 0.1;

      rot[i] = {
        x: Math.random() * Math.PI,
        y: Math.random() * Math.PI,
        z: Math.random() * Math.PI,
      };
      // Individual rotation tumble
      rotSpeed[i] = {
        x: (Math.random() - 0.5) * 1.0,
        y: (Math.random() - 0.5) * 1.0,
        z: (Math.random() - 0.5) * 1.0,
      };

      // Irregular scaling for "Shard" look
      // X, Y, Zをバラバラに伸ばすことで、正多角形ではなく「細長い破片」「平たい破片」などを作る
      const baseScale = 0.4 + Math.random() * 0.6;
      scale[i] = baseScale;
      dummy.scale.set(
        baseScale * (0.5 + Math.random() * 1.5), // Width
        baseScale * (0.5 + Math.random() * 1.5), // Height
        baseScale * (0.2 + Math.random() * 1.0)  // Depth (Thickness)
      );
    }

    // ほんの少し色味を個体差（ガラスの反射っぽさ）
    const c = new THREE.Color();
    for (let i = 0; i < shardCount; i++) {
      const tint = isDark ? 0.9 + Math.random() * 0.1 : 0.93 + Math.random() * 0.07;
      c.setRGB(0.88 * tint, 0.98 * tint, 1.0 * tint);
      shards.setColorAt(i, c);
    }
    if (shards.instanceColor) shards.instanceColor.needsUpdate = true;

    const bounds = { x: 3.6, y: 2.2, z: 2.6 };

    // ふわっとパララックス
    const pointer = { x: 0, y: 0 };
    const pointerTarget = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      pointerTarget.x = (x - 0.5) * 2;
      pointerTarget.y = (y - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let animationId = 0;
    let lastTime = performance.now();
    let hidden = document.visibilityState === "hidden";

    const handleVisibility = () => {
      hidden = document.visibilityState === "hidden";
    };
    document.addEventListener("visibilitychange", handleVisibility); // Animation loop uses raw matrix updates for performance
    const animate = (now: number) => {
      animationId = requestAnimationFrame(animate);
      if (hidden) return;

      if (startTimeRef.current === null) startTimeRef.current = now;
      const elapsedTime = (now - startTimeRef.current) / 1000;

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const t = now * 0.001;

      // lerp pointer
      pointer.x += (pointerTarget.x - pointer.x) * 0.06;
      pointer.y += (pointerTarget.y - pointer.y) * 0.06;

      camera.position.x = pointer.x * 0.25;
      camera.position.y = -pointer.y * 0.25;
      camera.lookAt(0, 0, 0);

      for (let i = 0; i < shardCount; i++) {
        // Orbit Logic
        const currentTheta = initialAngle[i] + t * speed[i];

        // 1. Calculate position on a FLAT plane (XZ)
        let px = Math.cos(currentTheta) * radius[i];
        let pz = Math.sin(currentTheta) * radius[i];
        // let py = (Math.sin(currentTheta * 3 + t) * 0.5); // Original
        let py = (Math.sin(currentTheta * 3 + t) * 0.2); // Amplitude reduced (less wobble)

        // 2. TILT the plane (Diagonal orbit)
        // Rotate around Z axis by ~30 deg, then X axis by ~60 deg?
        // Let's manually apply a rotation matrix math for a fixed "Saturn Tilt".
        // Tilt axis vector: (1, 0, 1) normalized? 
        // Simpler: Just swap/mix axes.

        // X-axis tilt (approx 20 deg)
        // User request: "More angle (Front lower, Back higher)"
        // 0.35 -> 0.45 (Closer to the rejected 0.5, but refined)
        const tiltX = 0.45; // rad
        const y1 = py * Math.cos(tiltX) - pz * Math.sin(tiltX);
        const z1 = py * Math.sin(tiltX) + pz * Math.cos(tiltX);
        py = y1;
        pz = z1;

        // Z-axis tilt (reversed)
        // Previous was -0.6 (approx -30deg). Reverse means +0.6 or similar.
        // User request: "Looser" -> flatter angle. Reduce from 0.5 to 0.3.
        const tiltZ = 0.3; // rad (少し緩やかに)
        const x2 = px * Math.cos(tiltZ) - py * Math.sin(tiltZ);
        const y2 = px * Math.sin(tiltZ) + py * Math.cos(tiltZ);
        px = x2 - 0.5; // Shift entire ring LEFT (Request: "A bit left")
        py = y2 + 0.8; // Shift entire ring UP (Request: "A bit more up")

        // Tumble rotation
        rot[i].x += rotSpeed[i].x * dt;
        rot[i].y += rotSpeed[i].y * dt;
        rot[i].z += rotSpeed[i].z * dt;

        dummy.position.set(px, py, pz);
        dummy.rotation.set(rot[i].x, rot[i].y, rot[i].z);

        // dummy.scale.set(scale[i], scale[i], scale[i]); // Original
        // アニメーション中も初期の歪みを維持するためには、ここでdummy.scaleを再計算する必要があるが、
        // 配列に保存していないため、初期化時のロジック（ランダム）が再現できない。
        // -> 本来は scaleX[], scaleY[], scaleZ[] を持つべき。
        // 簡易修正: ここでは均等スケールアニメーションのみにする（形は初期化で決まるが、pulseアニメーションは諦めるか、全体にかける）
        // または、scale[i]を基準に簡易的な変形を加える
        // 今回は「形」が重要なので、pulseアニメなしで初期形状を維持させる（scale変数は変えない）
        // dummy.scale.set(...) を書かなければ初期値のまま……ではない。dummyは使い回し変数なので毎回setが必要。
        // 仕方ないので、配列を追加して保存する（正攻法）

        // 既存のscale[]はスカラ値として残し、個別の歪み比率は乱数シード的に再現するか、配列増やす。
        // ここでは、コード変更量を抑えるため「一定の歪み」を擬似再現する
        // Entry Animation: Pop-in with delay
        // Stagger based on index. Total duration ~2s.
        const r1 = (i % 3 + 1) * 0.5; // Pseudo random based on index
        const r2 = (i % 5 + 1) * 0.3;

        const startDelay = i * 0.005;
        const duration = 1.2;
        let progress = Math.max(0, Math.min(1, (elapsedTime - startDelay) / duration));

        // Easing: Elastic Out or Back Out for "Pop"
        // Simple BackOut: (s+1)*t^3 - s*t^2
        const s = 1.70158;
        progress = --progress * progress * ((s + 1) * progress + s) + 1;

        dummy.scale.set(
          scale[i] * r1 * progress,
          scale[i] * r2 * progress,
          scale[i] * 0.5 * progress
        );
        dummy.updateMatrix();
        shards.setMatrixAt(i, dummy.matrix);
      }
      shards.instanceMatrix.needsUpdate = true;

      // Render using composer
      composer.render();
    };

    // Start animation loop
    animate(performance.now());

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      composer.setSize(w, h);
      composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      shardGeo.dispose();
      shardMat.dispose();
      envTex.dispose();
      envRT.texture.dispose();
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, [isDark]);

  // Hero Highlight (Bright gradients only in Hero)
  // Transparent base color to allow global nodes to shine through
  const heroHighlightStyle: CSSProperties = isDark
    ? {
      backgroundColor: "transparent",
      backgroundImage: `
          radial-gradient(65% 65% at 34% 46%, rgba(34, 211, 238, 0.34) 0%, rgba(34, 211, 238, 0.00) 68%),
          radial-gradient(55% 55% at 78% 18%, rgba(59, 130, 246, 0.26) 0%, rgba(59, 130, 246, 0.00) 64%),
          radial-gradient(60% 60% at 22% 86%, rgba(14, 165, 233, 0.22) 0%, rgba(14, 165, 233, 0.00) 62%),
          linear-gradient(135deg, rgba(34, 211, 238, 0.10) 0%, rgba(59, 130, 246, 0.06) 40%, rgba(0,0,0,0) 72%)
        `,
    }
    : {
      backgroundColor: "transparent",
      backgroundImage: `
          radial-gradient(55% 55% at 18% 22%, rgba(14, 165, 233, 0.16) 0%, rgba(14, 165, 233, 0.00) 66%),
          radial-gradient(50% 50% at 88% 16%, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.00) 64%),
          radial-gradient(60% 60% at 70% 92%, rgba(34, 211, 238, 0.12) 0%, rgba(34, 211, 238, 0.00) 62%),
          linear-gradient(135deg, rgba(14, 165, 233, 0.06) 0%, rgba(59, 130, 246, 0.03) 45%, rgba(255,255,255,0) 75%)
        `,
    };

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden transition-all duration-700"
      aria-hidden="true"
      style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
    >
      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-0"
        style={heroHighlightStyle}
      />

      {/* Grain / Texture (SVG filter) */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18] mix-blend-overlay"
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
      >
        <filter id={svgFilterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${svgFilterId})`} />
      </svg>

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,rgba(0,0,0,0)_66%,rgba(0,0,0,0.38)_100%)] opacity-20"
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
      />
    </div>
  );
}
