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
  const startTimeRef = useRef<number | null>(null);
  const scrollGroupRef = useRef<THREE.Group | null>(null);
  const noiseId = useId();
  const svgFilterId = `noise-${noiseId.replace(/:/g, "")}`;

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
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
    (renderer as any).physicallyCorrectLights = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 1.0 : 1.0;
    container.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const rgbShiftPass = new ShaderPass(RGBShiftShader);
    rgbShiftPass.uniforms["amount"].value = isDark ? 0.0025 : 0.0012;
    rgbShiftPass.uniforms["angle"].value = 0.0;
    composer.addPass(rgbShiftPass);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.pointerEvents = "none";
    renderer.domElement.style.zIndex = "1";

    const scrollGroup = new THREE.Group();
    scene.add(scrollGroup);
    scrollGroupRef.current = scrollGroup;
    const ambient = new THREE.AmbientLight(0xffffff, isDark ? 1.2 : 0.9);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xe0f2fe, isDark ? 1.3 : 1.0);
    key.position.set(2, 2, 4);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x7dd3fc, isDark ? 1.0 : 0.7);
    rim.position.set(-3, 1, -2);
    scene.add(rim);

    const glow = new THREE.PointLight(isDark ? 0x22d3ee : 0x0ea5e9, isDark ? 1.2 : 0.7, 25);
    glow.position.set(-2.2, -0.8, 3.2);
    scene.add(glow);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envCanvas = document.createElement("canvas");
    envCanvas.width = 256;
    envCanvas.height = 128;
    const ctx = envCanvas.getContext("2d");
    if (ctx) {
      const g = ctx.createLinearGradient(0, 0, envCanvas.width, envCanvas.height);
      g.addColorStop(0, isDark ? "#0b1020" : "#bfcad6");
      g.addColorStop(0.35, isDark ? "#22d3ee" : "#89b9ef");
      g.addColorStop(0.55, isDark ? "#0ea5e9" : "#c5dbf5");
      g.addColorStop(1, isDark ? "#05070c" : "#e2e8f0");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, envCanvas.width, envCanvas.height);

      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = "screen";

      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.fillRect(0, 40, envCanvas.width, 50);

      ctx.fillStyle = "#ff4444";
      ctx.fillRect(0, 30, envCanvas.width, 6);

      ctx.fillStyle = "#44ff44";
      ctx.fillRect(0, 64, envCanvas.width, 6);

      ctx.fillStyle = "#4488ff";
      ctx.fillRect(0, 98, envCanvas.width, 8);

      ctx.fillStyle = "#ffffff";
      ctx.globalAlpha = 1.0;
      ctx.fillRect(0, 65, envCanvas.width, 4);

      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = "source-over";
    }
    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    const envRT = pmrem.fromEquirectangular(envTex);
    scene.environment = envRT.texture;

    const shardCount = lowPower ? (isDark ? 80 : 65) : (isDark ? 150 : 110);
    const shardGeo = new THREE.IcosahedronGeometry(0.2, 0);


    const shardMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x202020 : 0xffffff,
      roughness: isDark ? 0.0 : 0.2,
      metalness: isDark ? 1.0 : 0.0,
      transmission: isDark ? 0.0 : 1.0,
      thickness: isDark ? 0.0 : 1.5,
      ior: 1.5,
      transparent: true,
      opacity: isDark ? 0.6 : 1.0,
      side: THREE.BackSide,
      blending: THREE.NormalBlending,
      depthWrite: false,

      iridescence: isDark ? 1.0 : 0.6,
      iridescenceIOR: 1.8,
      iridescenceThicknessRange: [100, 800],
      envMapIntensity: 4.0,
    });

    shardMat.side = THREE.DoubleSide;
    shardMat.vertexColors = false;
    shardMat.emissive = new THREE.Color(isDark ? 0x22d3ee : 0x000000);
    shardMat.emissiveIntensity = isDark ? 0.0 : 0.0;

    const fresnelColor = new THREE.Color(isDark ? 0xffffff : 0xdef7ff);
    const fresnelPower = isDark ? 5.0 : 3.0;
    const fresnelIntensity = isDark ? 10.0 : 2.0;
    const fresnelAlpha = isDark ? 1.0 : 0.8;

    if (isDark) {
      shardMat.onBeforeCompile = (shader) => {
        shader.uniforms.uFresnelColor = { value: fresnelColor };
        shader.uniforms.uFresnelPower = { value: fresnelPower };
        shader.uniforms.uFresnelIntensity = { value: fresnelIntensity };
        shader.uniforms.uFresnelAlpha = { value: fresnelAlpha };

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
          
          float radius = 0.35 + sin(uTime * 0.2) * 0.02;
          float width = 0.05;
          
          float r = smoothstep(width, 0.0, abs(dist - (radius + 0.015)));
          float g = smoothstep(width, 0.0, abs(dist - radius));
          float b = smoothstep(width, 0.0, abs(dist - (radius - 0.015)));
          
          vec3 ringColor = vec3(r, g, b);

          float radius2 = 0.6 + cos(uTime * 0.15) * 0.05;
          float width2 = 0.15;
          float r2 = smoothstep(width2, 0.0, abs(dist - (radius2 + 0.03)));
          float g2 = smoothstep(width2, 0.0, abs(dist - radius2));
          float b2 = smoothstep(width2, 0.0, abs(dist - (radius2 - 0.03)));
          
          vec3 ringColor2 = vec3(r2, g2, b2);
          
          vec3 finalColor = ringColor * 1.5 + ringColor2 * 0.5;
          
          float alpha = smoothstep(0.45, 0.1, dist);
          
          gl_FragColor = vec4(finalColor, alpha * uIntensity);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: isDark ? 0.35 : 0.0 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.position.set(0, 0, -2);
    scene.add(haloMesh);

    const prismGeo = new RoundedBoxGeometry(0.7, 0.7, 0.7, 4, 0.1);
    const prismMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x000000 : 0xffffff,
      roughness: isDark ? 0.0 : 0.15,
      metalness: isDark ? 1.0 : 0.0,
      transmission: isDark ? 0.0 : 1.0,
      thickness: isDark ? 0.0 : 1.2,
      ior: 1.6,
      transparent: true,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      side: THREE.DoubleSide,
      depthWrite: false,

      envMapIntensity: isDark ? 2.0 : 1.0,

      iridescence: 1.0,
      iridescenceIOR: 2.2,
      iridescenceThicknessRange: [100, 800],
    } as any);

    (prismMat as any).dispersion = 0.0;

    prismMat.attenuationColor = new THREE.Color(0xffffff);
    prismMat.attenuationDistance = 1000.0;
    const prismFresnelColor = new THREE.Color(isDark ? 0xffffff : 0xdef7ff);
    const prismFresnelPower = 20.0;
    const prismFresnelIntensity = 10.0;

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
          `outgoingLight += uFresnelColor * fresnel * uFresnelIntensity;
            #include <output_fragment>`
        );
      };
    }

    const prismMesh = new THREE.Mesh(prismGeo, prismMat);
    prismMesh.position.set(0, 0, 0);
    scene.add(prismMesh);

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
          float d = length(uv);
          float dX = length(vec2(uv.x * 0.1, uv.y));
          
          float glow = 0.05 / (d + 0.05);
          glow = pow(glow, 2.0);
          
          float streak = 0.02 / (abs(uv.y) + 0.02);
          streak *= smoothstep(0.5, 0.0, abs(uv.x));
          streak = pow(streak, 2.5);
          
          vec3 finalColor = uColor * (glow * 1.5 + streak * 0.8);
          
          float alpha = smoothstep(0.5, 0.2, d);
          finalColor *= alpha;
          
          float brightness = max(finalColor.r, max(finalColor.g, finalColor.b));
          gl_FragColor = vec4(finalColor, brightness);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xccf0ff) },
      },
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const flareMesh = new THREE.Mesh(flareGeo, flareMat);
    flareMesh.position.set(0, 0, 0.01);
    scene.add(flareMesh);

    const shards = new THREE.InstancedMesh(shardGeo, shardMat, shardCount);
    shards.frustumCulled = false;
    scrollGroup.add(shards);

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
      opacity: 1.0,
      side: THREE.DoubleSide,
      depthWrite: false,
      envMapIntensity: 2.0,
    });
    const bubbles = new THREE.InstancedMesh(bubbleGeo, bubbleMat, bubbleCount);
    bubbles.frustumCulled = false;
    bubbles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(bubbles);

    const bubbleData = new Array(bubbleCount).fill(0).map(() => ({
      x: (Math.random() - 0.5) * 15,
      y: (Math.random() - 0.5) * 10 - 5,
      z: (Math.random() - 0.5) * 5,
      speed: 0.5 + Math.random() * 1.5,
      scale: 0.3 + Math.random() * 0.7,
      offset: Math.random() * 100,
    }));

    const dummy = new THREE.Object3D();
    const initialAngle = new Array<number>(shardCount);
    const radius = new Array<number>(shardCount);
    const speed = new Array<number>(shardCount);
    const rotSpeed = new Array<{ x: number; y: number; z: number }>(shardCount);
    const scale = new Array<number>(shardCount);
    const rot = new Array<{ x: number; y: number; z: number }>(shardCount);

    for (let i = 0; i < shardCount; i++) {
      const r = 2.2 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;

      radius[i] = r;
      initialAngle[i] = theta;
      speed[i] = 0.1 + Math.random() * 0.1;

      rot[i] = {
        x: Math.random() * Math.PI,
        y: Math.random() * Math.PI,
        z: Math.random() * Math.PI,
      };
      rotSpeed[i] = {
        x: (Math.random() - 0.5) * 1.0,
        y: (Math.random() - 0.5) * 1.0,
        z: (Math.random() - 0.5) * 1.0,
      };
      const baseScale = 0.4 + Math.random() * 0.6;
      scale[i] = baseScale;
      dummy.scale.set(
        baseScale * (0.5 + Math.random() * 1.5),
        baseScale * (0.5 + Math.random() * 1.5),
        baseScale * (0.2 + Math.random() * 1.0)
      );
    }

    const c = new THREE.Color();
    for (let i = 0; i < shardCount; i++) {
      const tint = isDark ? 0.9 + Math.random() * 0.1 : 0.93 + Math.random() * 0.07;
      c.setRGB(0.88 * tint, 0.98 * tint, 1.0 * tint);
      shards.setColorAt(i, c);
    }
    if (shards.instanceColor) shards.instanceColor.needsUpdate = true;

    const bounds = { x: 3.6, y: 2.2, z: 2.6 };

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
    document.addEventListener("visibilitychange", handleVisibility);
    const animate = (now: number) => {
      animationId = requestAnimationFrame(animate);
      if (hidden) return;

      if (startTimeRef.current === null) startTimeRef.current = now;
      const elapsedTime = (now - startTimeRef.current) / 1000;

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const t = now * 0.001;

      const currentScrollY = window.scrollY || 0;
      if ((animate as any).lastScrollY === undefined) (animate as any).lastScrollY = currentScrollY;
      const deltaY = currentScrollY - (animate as any).lastScrollY;
      (animate as any).lastScrollY = currentScrollY;


      const vh = window.innerHeight;

      if (scrollGroupRef.current) {
        const threshold = vh * 1.5;
        const offset = Math.max(0, currentScrollY - threshold);
        scrollGroupRef.current.position.y = offset * 0.005;
      }

      const shiftStart = vh * 1.6;
      const shiftEnd = vh * 2.8;
      const shiftProgress = Math.min(1, Math.max(0, (currentScrollY - shiftStart) / (shiftEnd - shiftStart)));
      const smoothShift = shiftProgress * shiftProgress * (3 - 2 * shiftProgress);
      const targetX = smoothShift * -2;

      prismMesh.position.x = targetX;
      flareMesh.position.x = targetX;
      haloMesh.position.x = targetX;
      if (scrollGroupRef.current) {
        scrollGroupRef.current.position.x = targetX;
      }

      if ((animate as any).totalRotation === undefined) (animate as any).totalRotation = (now * 0.001);
      if ((animate as any).scrollVelocity === undefined) (animate as any).scrollVelocity = 0;

      (animate as any).scrollVelocity += deltaY * 0.08;
      (animate as any).scrollVelocity *= 0.92;
      const timeScale = 1.0 + (animate as any).scrollVelocity;
      (animate as any).totalRotation += dt * timeScale;

      const effectiveT = (animate as any).totalRotation;

      haloMat.uniforms.uTime.value = t;

      const targetScale = 1.0 + (smoothShift * 0.5);
      prismMesh.scale.set(targetScale, targetScale, targetScale);
      haloMesh.scale.set(targetScale, targetScale, targetScale);

      prismMesh.rotation.x = t * 0.2;
      prismMesh.rotation.y = t * 0.25 + (smoothShift * Math.PI * 4.0);
      prismMesh.rotation.z = t * 0.15;

      pointer.x += (pointerTarget.x - pointer.x) * 0.06;
      pointer.y += (pointerTarget.y - pointer.y) * 0.06;

      camera.position.x = pointer.x * 0.25;
      camera.position.y = -pointer.y * 0.25;
      camera.lookAt(0, 0, 0);

      const newsStart = vh * 3.1;
      const bubbleTrigger = newsStart;
      const newsEnd = vh * 3.7;
      const fadeLength = vh * 0.3;

      let globalAlpha = 1.0;

      if (currentScrollY > newsStart - fadeLength && currentScrollY < newsEnd + fadeLength) {
        if (currentScrollY < newsStart) {
          globalAlpha = 1.0 - (currentScrollY - (newsStart - fadeLength)) / fadeLength;
        } else if (currentScrollY > newsEnd) {
          globalAlpha = (currentScrollY - newsEnd) / fadeLength;
        } else {
          globalAlpha = 0.0;
        }
      }

      prismMesh.visible = globalAlpha > 0.01;
      haloMesh.visible = globalAlpha > 0.01;
      flareMesh.visible = globalAlpha > 0.01;
      (prismMat as any).opacity = globalAlpha;
      haloMat.uniforms.uIntensity.value = (isDark ? 0.35 : 0.0) * globalAlpha;
      flareMesh.rotation.copy(camera.rotation);
      const pulse = 1.0 + Math.sin(t * 1.5) * 0.05 + Math.sin(t * 4.3) * 0.02;
      flareMesh.scale.set(pulse * targetScale, pulse * targetScale, 1.0);
      flareMat.uniforms.uTime.value = t;
      flareMat.uniforms.uColor.value.setScalar(globalAlpha);

      for (let i = 0; i < shardCount; i++) {
        const currentTheta = initialAngle[i] + effectiveT * speed[i];
        let px = Math.cos(currentTheta) * radius[i];
        let pz = Math.sin(currentTheta) * radius[i];
        let py = (Math.sin(currentTheta * 3 + t) * 0.2);

        const tiltX = 0.45;
        const y1 = py * Math.cos(tiltX) - pz * Math.sin(tiltX);
        const z1 = py * Math.sin(tiltX) + pz * Math.cos(tiltX);
        py = y1;
        pz = z1;


        const tiltZ = 0.3;
        const x2 = px * Math.cos(tiltZ) - py * Math.sin(tiltZ);
        const y2 = px * Math.sin(tiltZ) + py * Math.cos(tiltZ);
        px = x2 - 0.5;
        py = y2 + 0.8;

        rot[i].x += rotSpeed[i].x * dt;
        rot[i].y += rotSpeed[i].y * dt;
        rot[i].z += rotSpeed[i].z * dt;

        dummy.position.set(px, py, pz);
        dummy.rotation.set(rot[i].x, rot[i].y, rot[i].z);

        const r1 = (i % 3 + 1) * 0.5;
        const r2 = (i % 5 + 1) * 0.3;

        const startDelay = i * 0.005;
        const duration = 1.2;
        let progress = Math.max(0, Math.min(1, (elapsedTime - startDelay) / duration));

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


      let bubbleAlpha = 0.0;
      if (currentScrollY > bubbleTrigger) {
        bubbleAlpha = Math.min(1.0, (currentScrollY - bubbleTrigger) / (vh * 0.8));
      }

      if (bubbleAlpha > 0.01) {
        bubbles.visible = true;
        const bDummy = new THREE.Object3D();
        const bColor = new THREE.Color(0xffffff);

        for (let i = 0; i < bubbleCount; i++) {
          const d = bubbleData[i];

          let y = d.y + (t * d.speed * 0.5);
          const range = 12;
          const halfRange = range / 2;
          y = ((y + halfRange) % range) - halfRange;

          const x = d.x + Math.sin(t + d.offset) * 0.2;
          const z = d.z + Math.cos(t * 0.8 + d.offset) * 0.2;

          bDummy.position.set(x, y, z);
          const s = d.scale * bubbleAlpha;
          bDummy.scale.set(s, s, s);
          bDummy.updateMatrix();
          bubbles.setMatrixAt(i, bDummy.matrix);
        }
        bubbles.instanceMatrix.needsUpdate = true;
      } else {
        bubbles.visible = false;
      }

      composer.render();
    };

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

      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,rgba(0,0,0,0)_66%,rgba(0,0,0,0.38)_100%)] opacity-20"
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
      />
    </div>
  );
}
