import { useEffect, useId, useRef } from "react";
import type { CSSProperties } from "react";
import * as THREE from "three";
import { EffectComposer, RenderPass, ShaderPass, RGBShiftShader, RoundedBoxGeometry } from "three-stdlib";

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
  const scrollGroupRef = useRef<THREE.Group | null>(null); // To move shards
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
    rgbShiftPass.uniforms["amount"].value = isDark ? 0.0025 : 0.0012; // Light Mode: Reduced shift
    rgbShiftPass.uniforms["angle"].value = 0.0;
    composer.addPass(rgbShiftPass);

    // Canvasが確実に背景全面を覆うように
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.pointerEvents = "none";
    renderer.domElement.style.zIndex = "1"; // User Request: "Behind text"


    // Groups
    const scrollGroup = new THREE.Group();
    scene.add(scrollGroup);
    scrollGroupRef.current = scrollGroup;

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
      g.addColorStop(0, isDark ? "#0b1020" : "#bfcad6");
      // ハイライトを強めにして、ガラスの反射を出す
      g.addColorStop(0.35, isDark ? "#22d3ee" : "#89b9ef");
      g.addColorStop(0.55, isDark ? "#0ea5e9" : "#c5dbf5");
      g.addColorStop(1, isDark ? "#05070c" : "#e2e8f0");
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
      roughness: isDark ? 0.0 : 0.2, // Light Mode: Blurred/Soft Glass
      metalness: isDark ? 1.0 : 0.0, // Light Mode: Glass (Dielectric), Dark Mode: Metallic
      transmission: isDark ? 0.0 : 1.0, // Light Mode: Refractive Glass
      thickness: isDark ? 0.0 : 1.5,     // Thickness for refraction
      ior: 1.5,
      transparent: true,
      opacity: isDark ? 0.6 : 1.0, // Light Mode: Full opacity (rely on transmission)
      side: THREE.BackSide,
      blending: THREE.NormalBlending,
      depthWrite: false,

      // Iridescence (虹色干渉)
      iridescence: isDark ? 1.0 : 0.6, // Light Mode: Bit stronger again because roughness blurs it
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
    shardMat.emissive = new THREE.Color(isDark ? 0x22d3ee : 0x000000);
    shardMat.emissiveIntensity = isDark ? 0.0 : 0.0; // リファレンスは自己発光していないので、環境反射に任せる（0.0にする）

    // Fresnel（縁が光る）をonBeforeCompileで注入
    // リファレンスのような「白いハイライト」のエッジにする
    const fresnelColor = new THREE.Color(isDark ? 0xffffff : 0xdef7ff);
    const fresnelPower = isDark ? 5.0 : 3.0;
    const fresnelIntensity = isDark ? 10.0 : 2.0; // エッジだけ強烈に白く光らせる
    const fresnelAlpha = isDark ? 1.0 : 0.8;

    if (isDark) {
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
    }
    shardMat.needsUpdate = true;

    // --- HALO EFFECT START ---
    // User Request: Spectral/Lens Flare Halo in center
    const haloGeo = new THREE.PlaneGeometry(12, 12);
    const haloMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uIntensity;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv - 0.5;
          float dist = length(uv);
          
          // Spectral ring parameters
          float radius = 0.35 + sin(uTime * 0.2) * 0.02;
          float width = 0.05;
          
          // Create RGB offset for rainbow effect (Chromatic Aberration)
          // Red is outer, Blue is inner (or vice versa)
          float r = smoothstep(width, 0.0, abs(dist - (radius + 0.015)));
          float g = smoothstep(width, 0.0, abs(dist - radius));
          float b = smoothstep(width, 0.0, abs(dist - (radius - 0.015)));
          
          vec3 ringColor = vec3(r, g, b);

          // Add a second, larger, fainter ring
          float radius2 = 0.6 + cos(uTime * 0.15) * 0.05;
          float width2 = 0.15;
          float r2 = smoothstep(width2, 0.0, abs(dist - (radius2 + 0.03)));
          float g2 = smoothstep(width2, 0.0, abs(dist - radius2));
          float b2 = smoothstep(width2, 0.0, abs(dist - (radius2 - 0.03)));
          
          vec3 ringColor2 = vec3(r2, g2, b2);
          
          // Combine
          vec3 finalColor = ringColor * 1.5 + ringColor2 * 0.5;
          
          // Fade out edges of the plane
          // Ensure it hits 0.0 before dist reaches 0.5 (edge of 1x1 plane)
          // Previous (0.7, 0.2) was keeping it opaque at the edges (dist=0.5 -> alpha=0.4)
          float alpha = smoothstep(0.45, 0.1, dist);
          
          gl_FragColor = vec4(finalColor, alpha * uIntensity);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: isDark ? 0.35 : 0.0 }, // Only visible in dark mode primarily
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.position.set(0, 0, -2); // Behind shards
    scene.add(haloMesh); // Fixed (Follows cube)
    // --- HALO EFFECT END ---

    // --- PRISM START ---
    // User Request: "Reference image style" -> Rounded, Glassy, Dispersion
    const prismGeo = new RoundedBoxGeometry(0.7, 0.7, 0.7, 4, 0.1); // Rounded edges
    const prismMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x000000 : 0xffffff,
      roughness: isDark ? 0.0 : 0.15, // Light Mode: Slightly softer
      metalness: isDark ? 1.0 : 0.0, // Dark=Mirror, Light=Glass
      transmission: isDark ? 0.0 : 1.0, // Transmission for Light mode
      thickness: isDark ? 0.0 : 1.2,
      ior: 1.6,
      transparent: true,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      side: THREE.DoubleSide,
      depthWrite: false,

      envMapIntensity: isDark ? 2.0 : 1.0,

      // Iridescence (Fake Dispersion/Rainbow)
      iridescence: 1.0,
      iridescenceIOR: 2.2,
      iridescenceThicknessRange: [100, 800],
    } as any);

    // Disable dispersion property (Using Iridescence instead)
    (prismMat as any).dispersion = 0.0;

    // Additional tuning for the "Glow" inside
    prismMat.attenuationColor = new THREE.Color(0xffffff);
    prismMat.attenuationDistance = 1000.0; // Effectively Infinity (No fog)

    // Custom Fresnel Injection for "More Fresnel" look (User Request)
    const prismFresnelColor = new THREE.Color(isDark ? 0xffffff : 0xdef7ff);
    const prismFresnelPower = 20.0;    // Ghostly Sharp (Only exact edges)
    const prismFresnelIntensity = 10.0; // Extreme Glow to be visible

    // Only apply extreme Additive Fresnel in Dark Mode
    if (isDark) {
      prismMat.onBeforeCompile = (shader) => {
        shader.uniforms.uFresnelColor = { value: prismFresnelColor };
        shader.uniforms.uFresnelPower = { value: prismFresnelPower };
        shader.uniforms.uFresnelIntensity = { value: prismFresnelIntensity };

        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <common>",
          `#include <common>
            uniform vec3 uFresnelColor;
            uniform float uFresnelPower;
            uniform float uFresnelIntensity;`
        );

        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <normal_fragment_begin>",
          `#include <normal_fragment_begin>
            float fresnel = pow(1.0 - abs(dot(normalize(vViewPosition), normalize(normal))), uFresnelPower);
            fresnel = clamp(fresnel, 0.0, 1.0);`
        );

        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <output_fragment>",
          `// Additive Fresnel
            outgoingLight += uFresnelColor * fresnel * uFresnelIntensity;
            #include <output_fragment>`
        );
      };
    }

    const prismMesh = new THREE.Mesh(prismGeo, prismMat);
    prismMesh.position.set(0, 0, 0);
    scene.add(prismMesh);
    // --- PRISM END ---

    // --- LENS FLARE START ---
    // User Request: Lens Flare
    const flareGeo = new THREE.PlaneGeometry(10, 10);
    const flareMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3 uColor;
        
        void main() {
          vec2 uv = vUv - 0.5;
          // Anamorphic Stretch
          float d = length(uv);
          float dX = length(vec2(uv.x * 0.1, uv.y)); // Stretch X
          
          // Core Glow
          float glow = 0.05 / (d + 0.05);
          glow = pow(glow, 2.0);
          
          // Horizontal Streak
          float streak = 0.02 / (abs(uv.y) + 0.02);
          streak *= smoothstep(0.5, 0.0, abs(uv.x)); // Fade out ends
          streak = pow(streak, 2.5);
          
          // Combine
          vec3 finalColor = uColor * (glow * 1.5 + streak * 0.8);
          
          // Soft edges
          float alpha = smoothstep(0.5, 0.2, d);
          finalColor *= alpha; // Apply mask
          
          // Use brightness as alpha to prevents black box (0 alpha)
          // while keeping bright parts visible (high alpha)
          float brightness = max(finalColor.r, max(finalColor.g, finalColor.b));
          gl_FragColor = vec4(finalColor, brightness);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xccf0ff) }, // Cyan-ish white
      },
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const flareMesh = new THREE.Mesh(flareGeo, flareMat);
    flareMesh.position.set(0, 0, 0.01); // Slightly in front
    scene.add(flareMesh);
    // --- LENS FLARE END ---

    const shards = new THREE.InstancedMesh(shardGeo, shardMat, shardCount);
    shards.frustumCulled = false;
    scrollGroup.add(shards); // Scroll away

    // --- BUBBLES START ---
    // User Request: "Bubbles appearing from News section"
    const bubbleCount = isDark ? 60 : 40;
    const bubbleGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const bubbleMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 1.0,
      thickness: 1.5,
      ior: 1.4,
      transparent: true,
      opacity: 1.0, // Changed from 0.0 to 1.0 so they are actually visible
      side: THREE.DoubleSide,
      depthWrite: false, // Important for glass sorting
      envMapIntensity: 2.0,
    });
    const bubbles = new THREE.InstancedMesh(bubbleGeo, bubbleMat, bubbleCount);
    bubbles.frustumCulled = false;
    bubbles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(bubbles); // Fixed in scene, doesn't scroll with "ScrollGroup" (we want them to float independently)

    const bubbleData = new Array(bubbleCount).fill(0).map(() => ({
      x: (Math.random() - 0.5) * 15, // Wide spread
      y: (Math.random() - 0.5) * 10 - 5, // Convert to range roughly -10 to 0 initially
      z: (Math.random() - 0.5) * 5,
      speed: 0.5 + Math.random() * 1.5,
      scale: 0.3 + Math.random() * 0.7,
      offset: Math.random() * 100, // Random starting time offset
    }));
    // --- BUBBLES END ---

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
      const t = now * 0.001; // Needed for pulsing etc

      // Calculate Scroll-based Rotation (Smoothed Momentum)
      const currentScrollY = window.scrollY || 0;
      if ((animate as any).lastScrollY === undefined) (animate as any).lastScrollY = currentScrollY;
      const deltaY = currentScrollY - (animate as any).lastScrollY;
      (animate as any).lastScrollY = currentScrollY;

      // Move ScrollGroup (simulate document flow)
      // Visual Height at Z=0 is approx 5 units. Window Height is ~1000px.
      // Ratio ~ 0.005.
      // Move UP positive Y.
      // User Request: "Fixed initially (Hero), then scroll away (About)"
      // Threshold: ~800px (End of Hero text interaction)
      // Updated by User: Responsive (vh based)
      // Hero is 250vh.
      const vh = window.innerHeight;

      if (scrollGroupRef.current) {
        const threshold = vh * 1.5; // Start scrolling shards away at 2.2vh
        const offset = Math.max(0, currentScrollY - threshold);
        scrollGroupRef.current.position.y = offset * 0.005;
      }

      // Horizontal Shift Logic
      // Start shifting after Hero (Hero is 250vh)
      // About starts appearing around 2.5vh
      const shiftStart = vh * 1.6;
      const shiftEnd = vh * 2.8;
      const shiftProgress = Math.min(1, Math.max(0, (currentScrollY - shiftStart) / (shiftEnd - shiftStart)));
      // Smooth ease
      const smoothShift = shiftProgress * shiftProgress * (3 - 2 * shiftProgress);
      const targetX = smoothShift * -2; // Move left by 2.5 units (User Request: "A little more left")

      prismMesh.position.x = targetX;
      flareMesh.position.x = targetX; // + 0 is handled in geometry/creation, but here we override position
      haloMesh.position.x = targetX; // Halo follows cube
      if (scrollGroupRef.current) {
        // Shards also shift left while scrolling up
        scrollGroupRef.current.position.x = targetX;
      }

      // Initialize persistent variables
      if ((animate as any).totalRotation === undefined) (animate as any).totalRotation = (now * 0.001);
      if ((animate as any).scrollVelocity === undefined) (animate as any).scrollVelocity = 0;

      // 1. Add impulse from scroll (Sensitivity)
      // This creates "Acceleration" rather than "Position Mapping".
      // Smooths out the "Kaku-kaku" (stepped) movement of scroll wheels.
      (animate as any).scrollVelocity += deltaY * 0.08;

      // 2. Apply Friction / Decay 
      // Returns to 0 over time.
      (animate as any).scrollVelocity *= 0.92;

      // 3. Apply velocity to rotation
      // Base speed: 1.0 (Matches original normal speed)
      // Plus scroll momentum.
      // effectiveT is multiplied by speed[i] (~0.15) later.
      const timeScale = 1.0 + (animate as any).scrollVelocity;
      (animate as any).totalRotation += dt * timeScale;

      const effectiveT = (animate as any).totalRotation;

      // Update Halo Uniforms
      haloMat.uniforms.uTime.value = t;

      // Scale Logic (User Request: "Make it a bit bigger at this time")
      const targetScale = 1.0 + (smoothShift * 0.5); // Scale up to 1.6x (User Request: "A bit more bigger")
      prismMesh.scale.set(targetScale, targetScale, targetScale);
      haloMesh.scale.set(targetScale, targetScale, targetScale);

      // Animate Prism
      // Slow rotation + Fast spin during scroll shift
      prismMesh.rotation.x = t * 0.2;
      prismMesh.rotation.y = t * 0.25 + (smoothShift * Math.PI * 4.0); // Spin 2 times during shift
      prismMesh.rotation.z = t * 0.15;


      // lerp pointer
      pointer.x += (pointerTarget.x - pointer.x) * 0.06;
      pointer.y += (pointerTarget.y - pointer.y) * 0.06;

      camera.position.x = pointer.x * 0.25;
      camera.position.y = -pointer.y * 0.25;
      camera.lookAt(0, 0, 0);

      // News Section Visibility Logic (User Request: "Hide temporally in News section")
      // News estimated range: 3.8vh to 5.5vh
      const newsStart = vh * 3.1;
      const newsEnd = vh * 3.7;
      const fadeLength = vh * 0.3;

      // 1.0 = Visible, 0.0 = Hidden
      let globalAlpha = 1.0;

      if (currentScrollY > newsStart - fadeLength && currentScrollY < newsEnd + fadeLength) {
        // Entering News
        if (currentScrollY < newsStart) {
          // Fade Out
          globalAlpha = 1.0 - (currentScrollY - (newsStart - fadeLength)) / fadeLength;
        } else if (currentScrollY > newsEnd) {
          // Fade In
          globalAlpha = (currentScrollY - newsEnd) / fadeLength;
        } else {
          // Inside News
          globalAlpha = 0.0;
        }
      }

      // Apply visibility
      prismMesh.visible = globalAlpha > 0.01;
      haloMesh.visible = globalAlpha > 0.01;
      flareMesh.visible = globalAlpha > 0.01;

      // Modulate Opacity/Intensity for smooth fade
      // Prism is Additive Black, so Opacity controls alpha blending
      (prismMat as any).opacity = globalAlpha;
      // Also scale it down for effect? No, simple fade is cleaner.

      haloMat.uniforms.uIntensity.value = (isDark ? 0.35 : 0.0) * globalAlpha;

      // Flare billboard update with alpha
      flareMesh.rotation.copy(camera.rotation);
      const pulse = 1.0 + Math.sin(t * 1.5) * 0.05 + Math.sin(t * 4.3) * 0.02;
      // Multiply pulse by targetScale to keep proportion
      flareMesh.scale.set(pulse * targetScale, pulse * targetScale, 1.0);
      flareMat.uniforms.uTime.value = t;
      flareMat.uniforms.uColor.value.setScalar(globalAlpha); // Dim color to fade

      for (let i = 0; i < shardCount; i++) {
        // Orbit Logic
        // Use effectiveT instead of raw t
        const currentTheta = initialAngle[i] + effectiveT * speed[i];

        // 1. Calculate position on a FLAT plane (XZ)
        let px = Math.cos(currentTheta) * radius[i];
        let pz = Math.sin(currentTheta) * radius[i];
        // let py = (Math.sin(currentTheta * 3 + t) * 0.5); // Original
        // Use raw 't' for bobbing to keep it independent of orbit speed? 
        // Or sync it? Syncing feels more natural if "accelerating".
        let py = (Math.sin(currentTheta * 3 + t) * 0.2); // Keep pulse gentle mostly


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

      // --- BUBBLE ANIMATION START ---
      // Bubbles appear after News section starts
      // News Range: newsStart (~3.1vh) onwards.
      // Need to adjust this to match the actual DOM layout.
      // Hero (2.5vh) + About (~1.0vh+) -> News starts around 3.5vh.
      // Trigger visually during About so they are fully present for News.
      const bubbleTrigger = newsStart; // User Request: "Start from News is fine"
      let bubbleAlpha = 0.0;
      if (currentScrollY > bubbleTrigger) {
        // Fade in over 1.0vh scroll distance
        bubbleAlpha = Math.min(1.0, (currentScrollY - bubbleTrigger) / (vh * 0.8));
      }

      // If visible, animate
      if (bubbleAlpha > 0.01) {
        bubbles.visible = true;
        const bDummy = new THREE.Object3D();
        const bColor = new THREE.Color(0xffffff);

        for (let i = 0; i < bubbleCount; i++) {
          const d = bubbleData[i];
          // Float Up
          // Y position loops from -8 to +8 (relative to camera y?)
          // Since camera moves with pointer slightly, but mostly fixed Y?
          // Wait, scrollGroup moves. Scene is fixed.
          // Bubbles should fill the screen. Sreen height at Z=0 is ~5-6 units.
          // Range -4 to +4 seems proper.

          let y = d.y + (t * d.speed * 0.5);
          // Wrap logic
          const range = 12;
          const halfRange = range / 2;
          y = ((y + halfRange) % range) - halfRange;
          // y is now -6 to +6.

          // Wiggle
          const x = d.x + Math.sin(t + d.offset) * 0.2;
          const z = d.z + Math.cos(t * 0.8 + d.offset) * 0.2;

          bDummy.position.set(x, y, z);
          // Scale In/Out based on lifespan or just keep constant?
          // Let's just scale by global alpha for fade in/out
          const s = d.scale * bubbleAlpha; // Simple fade via scale?
          // Scale 0 -> invisible.
          bDummy.scale.set(s, s, s);
          bDummy.updateMatrix();
          bubbles.setMatrixAt(i, bDummy.matrix);

          // Optional: Tint bubbles?
          // bubbles.setColorAt(i, bColor);
        }
        bubbles.instanceMatrix.needsUpdate = true;
      } else {
        bubbles.visible = false;
      }
      // --- BUBBLE ANIMATION END ---

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
      haloGeo.dispose();
      haloMat.dispose();
      prismGeo.dispose();
      prismMat.dispose();
      flareGeo.dispose();
      flareMat.dispose();
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
          radial-gradient(65% 65% at 34% 46%, rgba(34, 211, 238, 0.20) 0%, rgba(34, 211, 238, 0.00) 68%),
          radial-gradient(55% 55% at 78% 18%, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.00) 64%),
          radial-gradient(60% 60% at 22% 86%, rgba(14, 165, 233, 0.12) 0%, rgba(14, 165, 233, 0.00) 62%),
          linear-gradient(135deg, rgba(34, 211, 238, 0.05) 0%, rgba(59, 130, 246, 0.03) 40%, rgba(0,0,0,0) 72%)
        `,
    }
    : {
      backgroundColor: "transparent",
      backgroundImage: `
          radial-gradient(55% 55% at 18% 22%, rgba(14, 165, 233, 0.10) 0%, rgba(14, 165, 233, 0.00) 66%),
          radial-gradient(50% 50% at 88% 16%, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.00) 64%),
          radial-gradient(60% 60% at 70% 92%, rgba(34, 211, 238, 0.08) 0%, rgba(34, 211, 238, 0.00) 62%),
          linear-gradient(135deg, rgba(14, 165, 233, 0.04) 0%, rgba(59, 130, 246, 0.02) 45%, rgba(255,255,255,0) 75%)
        `,
    };

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-all duration-700"
      aria-hidden="true"
      style={{ position: "fixed", top: 0, right: 0, bottom: 0, left: 0 }}
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
