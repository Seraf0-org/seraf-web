import type { MetaFunction } from "@remix-run/node";
import { Suspense, useEffect, useRef, useState } from "react";
import { animate, inView, stagger, scroll } from "motion";
import Lenis from "lenis";
import { GlassShards } from "~/components/invi/GlassShards";
import { SkyBackground } from "~/components/invi/SkyBackground";

export const meta: MetaFunction = () => {
  return [
    { title: "InVi | Seraf()" },
    {
      name: "description",
      content:
        "平成中期、日本の山奥にある閉ざされた集落。神の死が残した歪んだ世界で、ふたりの少女が運命に選ばされていく物語。",
    },
    { property: "og:title", content: "InVi | Seraf()" },
    {
      property: "og:description",
      content:
        "神の死が残した世界の歪みと、それに運命を選ばされた少女たちの物語。",
    },
    { property: "og:type", content: "website" },
  ];
};

const NAV_ICONS = [
  { id: "world", label: "01", href: "#world" },
  { id: "characters", label: "02", href: "#characters" },
  { id: "story", label: "03", href: "#story" },
];

export default function InViPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window === "undefined") return;
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  };

  // ローディングのシミュレーション
  useEffect(() => {
    if (typeof window === "undefined") return;
    let start = Date.now();
    const duration = 2500; // 2.5秒間ローディング画面を見せる

    const updateProgress = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(p);

      if (elapsed < duration) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => setIsLoading(false), 300); // 100%になって少し待ってから開く
      }
    };
    requestAnimationFrame(updateProgress);
  }, []);

  // ローディング完了後の本編アニメーション
  useEffect(() => {
    if (typeof window === "undefined" || isLoading) return;

    // Lenis Smooth Scroll Setup
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const ease = [0.22, 0.61, 0.36, 1];

    // 強化版 Entrance Shutter
    (animate as any)(
      ".invi-shutter-panel",
      { scaleY: [1, 0] },
      { delay: 0.1, duration: 1.2, easing: [0.76, 0, 0.24, 1] }
    );
    (animate as any)(
      ".invi-shutter-content",
      { opacity: [1, 0], scale: [1, 0.95] },
      { duration: 0.6, easing: ease }
    );
    (animate as any)(
      ".invi-shutter-container",
      { display: "none" },
      { delay: 1.5 }
    );

    // Parallax
    scroll(animate(".parallax-bg-deep", { y: [0, 400] }));
    scroll(animate(".parallax-bg", { y: [0, 200], scale: [1, 1.05] }));
    scroll(animate(".parallax-mid", { y: [0, -60] }));
    scroll(animate(".parallax-front", { y: [0, -150], scale: [1, 1.02] }));
    scroll(animate(".parallax-extreme", { y: [0, -500], scale: [1, 1.1] }));

    // Ticker animation
    (animate as any)(
      ".invi-ticker-track",
      { x: ["0%", "-50%"] },
      { duration: 40, easing: "linear", repeat: Infinity }
    );

    // Hero entry animations
    (animate as any)(
      ".anim-fade-up",
      { opacity: [0, 1], y: [20, 0] },
      { delay: stagger(0.1, { start: 0.8 }), duration: 0.8, easing: ease }
    );
    (animate as any)(
      ".invi-art",
      { opacity: [0, 1], scale: [1.02, 1] },
      { delay: 0.8, duration: 1.0, easing: ease }
    );
    (animate as any)(
      ".invi-sidenav",
      { opacity: [0, 1] },
      { delay: 0.4, duration: 0.6, easing: ease }
    );

    // Scroll-in for lower sections
    const seen = new WeakSet<Element>();
    const stopSections = inView(
      ".invi-section",
      (element) => {
        if (seen.has(element)) return;
        seen.add(element);
        (animate as any)(
          element,
          { opacity: [0, 1], y: [40, 0] },
          { duration: 0.8, easing: ease }
        );
      },
      { margin: "-10% 0px -10% 0px" }
    );

    return () => {
      stopSections();
      lenis.destroy();
    };
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 relative overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* フィルムグレイン（ノイズ）エフェクト */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] mix-blend-multiply [background-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44NSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWx0ZXI9InVybCgjbikiIG9wYWNpdHk9IjEiLz48L3N2Zz4=')] [background-size:200px_200px]" />

      {/* 全体に漂う1層目のガラス破片（少なめ） */}
      <GlassShards count={60} className="fixed inset-0 z-[1] pointer-events-none opacity-50" />

      {/* ===== 強化版ローディング画面 ===== */}
      <div className="invi-shutter-container fixed inset-0 z-[100] pointer-events-none flex flex-col">
        {/* 上下のシャッターパネル */}
        <div className="invi-shutter-panel origin-top w-full h-1/2 bg-[#FDFDFD] border-b border-gray-100" />
        <div className="invi-shutter-panel origin-bottom w-full h-1/2 bg-[#FDFDFD] border-t border-gray-100" />
        
        {/* ローディングコンテンツ */}
        <div className="invi-shutter-content absolute inset-0 flex flex-col items-center justify-center">
          {/* 追加いただいたエンブレムロゴ */}
          <img 
            src="/images/invi/emblem.png" 
            alt="Loading Emblem" 
            className="w-12 h-12 object-contain opacity-80 mb-6 animate-pulse invert mix-blend-multiply"
          />
          
          {/* パーセンテージ表示 */}
          <div className="font-serif text-3xl tracking-widest text-gray-800 mb-2">
            {progress.toString().padStart(3, '0')}<span className="text-sm text-gray-400 ml-1">%</span>
          </div>
          
          {/* ステータステキスト */}
          <span className="font-serif text-[9px] tracking-[0.4em] text-gray-400 uppercase">
            {progress < 100 ? "Establishing Connection..." : "System Ready"}
          </span>

          {/* プログレスバー */}
          <div className="w-48 h-[1px] bg-gray-200 mt-6 relative overflow-hidden">
            <div 
              className="absolute left-0 top-0 bottom-0 bg-gray-800 transition-all duration-75 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ===== 左・縦ナビバー ===== */}
      <nav className="invi-sidenav fixed left-0 inset-y-0 z-40 w-12 sm:w-16 flex flex-col items-center justify-between py-8 bg-white/40 backdrop-blur-md border-r border-black/5">
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-serif tracking-[0.3em] text-gray-800 [writing-mode:vertical-rl] rotate-180 select-none">
            InVi
          </span>
          <div className="h-8 w-px bg-black/10" />
        </div>
        <div className="flex flex-col items-center gap-6">
          {NAV_ICONS.map((nav) => (
            <a
              key={nav.id}
              href={nav.href}
              className="text-[10px] font-medium tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
              title={nav.id}
            >
              {nav.label}
            </a>
          ))}
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-px bg-black/10" />
          <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-gray-400 [writing-mode:vertical-rl] rotate-180 select-none">
            Seraf()
          </span>
        </div>
      </nav>

      {/* ===== HERO（フルスクリーン） ===== */}
      <section 
        className="relative h-screen w-full overflow-hidden pl-12 sm:pl-16 bg-[#0f172a]"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      >
        {/* ヒーロー背景：青とピンクのドラマチックな空 */}
        <SkyBackground />

        {/* 背景キャンバスとグリッド */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-[1] mix-blend-overlay opacity-50">
          
          {/* Hairline Grids (より繊細に) */}
          <div className="absolute left-[15%] inset-y-0 w-px bg-black/[0.04]" />
          <div className="absolute left-[50%] inset-y-0 w-px bg-black/[0.04]" />
          <div className="absolute right-[15%] inset-y-0 w-px bg-black/[0.04]" />
          <div className="absolute inset-x-0 top-[15%] h-px bg-black/[0.04]" />
          <div className="absolute inset-x-0 bottom-[15%] h-px bg-black/[0.04]" />
          
          {/* 装飾的な縦書きテキスト・角のマーカー */}
          <div className="absolute left-[15%] top-[15%] flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
            <div className="w-2 h-px bg-black" />
            <div className="w-px h-2 bg-black" />
          </div>
          <div className="absolute right-[15%] bottom-[15%] flex flex-col items-center translate-x-1/2 translate-y-1/2">
            <div className="w-2 h-px bg-black" />
            <div className="w-px h-2 bg-black" />
          </div>
          <p className="absolute left-[15%] top-[30%] -translate-x-1/2 rotate-90 origin-center text-[10px] tracking-[0.3em] font-serif opacity-40">
            INVI PROJECT / LIE:VERSE AESTHETIC
          </p>
          <p className="absolute right-[15%] bottom-[30%] translate-x-1/2 -rotate-90 origin-center text-[10px] tracking-[0.3em] font-serif opacity-40">
            THE INVISIBLE TRUTH LIES BEYOND
          </p>
        </div>

        {/* 巨大な背景テキスト（最奥のパララックス） */}
        <div className="parallax-bg-deep absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.02]">
          <span className="font-serif text-[18vw] sm:text-[15vw] font-bold leading-none whitespace-nowrap select-none">
            MIRACLE
          </span>
        </div>

        {/* Three.js 舞い上がるガラス破片 (ヒーロー限定の2層目・高密度) */}
        <GlassShards count={150} className="absolute inset-0 z-[2] pointer-events-none opacity-80" />

        {/* キーアート（スイ＋ラン＋ロゴ＋ガラス片） */}
        <div className="invi-art absolute inset-0 z-[4] flex items-end justify-center pointer-events-none">
          <div className="relative w-full h-full max-w-7xl mx-auto">
            
            {/* 浮遊するガラス片 (パララックス) */}
            <div className="parallax-front absolute top-[20%] left-[15%] z-[30] opacity-80 transition-transform duration-1000 ease-out" style={{ transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px) rotate(15deg)` }}>
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100/40 via-purple-50/20 to-white/60 backdrop-blur-sm border border-white shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-tl-3xl rounded-br-3xl" />
            </div>
            <div className="parallax-bg absolute bottom-[40%] right-[10%] z-0 opacity-60 transition-transform duration-1000 ease-out" style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px) rotate(-25deg)` }}>
              <div className="w-40 h-40 bg-gradient-to-tr from-pink-50/30 via-white/50 to-blue-50/20 backdrop-blur-md border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.02)] rounded-full" />
            </div>

            {/* 超特大アクセントテキスト（最前面・超高速スクロール） */}
            <div className="parallax-extreme absolute top-[70%] left-[-5%] z-[100] opacity-5 pointer-events-none">
              <span className="font-serif text-[12rem] sm:text-[18rem] font-bold tracking-widest text-transparent" style={{ WebkitTextStroke: "1px rgba(0,0,0,0.5)" }}>DEPTH</span>
            </div>

            {/* ど真ん中のロゴ群 */}
            <div className="parallax-bg absolute inset-0 z-[30] pointer-events-none">
              <div 
                className="w-full h-full flex flex-col items-center justify-center transition-transform duration-700 ease-out gap-4 sm:gap-6"
                style={{ transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)` }}
              >
                {/* いただいたシンボルロゴ（目のようなアイコン） */}
                {/* ※画像を public/images/invi/emblem.png として保存してください */}
                <img 
                  src="/images/invi/emblem.png" 
                  alt="InVi Emblem" 
                  className="w-[12vw] max-w-[80px] object-contain invert opacity-90 mix-blend-multiply -translate-y-[6vh] sm:-translate-y-[4vh]"
                />
                
                {/* タイトルロゴ */}
                <img 
                  src="/images/invi/logo.png" 
                  alt="InVi Logo" 
                  className="w-[60vw] max-w-[400px] object-contain invert opacity-90 mix-blend-multiply -translate-y-[6vh] sm:-translate-y-[4vh]"
                />
              </div>
            </div>

            {/* 装飾レイヤー：縦書きテキスト */}
            <div className="parallax-mid absolute top-[30%] left-[25%] sm:left-[32%] z-[5] opacity-60 pointer-events-none">
              <div 
                className="transition-transform duration-700 ease-out"
                style={{ transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)` }}
              >
                <div className="text-[9px] font-serif tracking-[0.4em] text-gray-500 [writing-mode:vertical-rl]">
                  01 — Resonance
                </div>
              </div>
            </div>

            <div className="parallax-front absolute bottom-[35%] right-[22%] sm:right-[30%] z-[25] opacity-60 pointer-events-none">
              <div 
                className="transition-transform duration-700 ease-out"
                style={{ transform: `translate(${mousePos.x * -25}px, ${mousePos.y * -25}px)` }}
              >
                <div className="text-[9px] font-serif tracking-[0.4em] text-gray-500 [writing-mode:vertical-rl]">
                  02 — Blade_W
                </div>
              </div>
            </div>

            {/* スイ（左）とラン（右）を中央付近で重ねる */}
            <div className="parallax-mid absolute inset-0 z-10 pointer-events-none">
              <div 
                className="w-full h-full flex items-end justify-center transition-transform duration-700 ease-out"
                style={{ transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -10}px)` }}
              >
                <img
                  src="/images/invi/ran.png"
                  alt="ラン"
                  className="absolute bottom-0 left-1/2 -translate-x-[20%] sm:-translate-x-[30%] h-[60%] sm:h-[70%] lg:h-[85%] w-auto object-contain select-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)]"
                />
              </div>
            </div>
            
            <div className="parallax-front absolute inset-0 z-20 pointer-events-none">
              <div 
                className="w-full h-full flex items-end justify-center transition-transform duration-700 ease-out"
                style={{ transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -20}px)` }}
              >
                <img
                  src="/images/invi/sui.png"
                  alt="スイ"
                  className="absolute bottom-0 left-1/2 -translate-x-[70%] sm:-translate-x-[80%] h-[58%] sm:h-[68%] lg:h-[82%] w-auto object-contain select-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ライブティッカーバー (ライトテーマ) */}
        <div className="absolute bottom-0 inset-x-0 h-10 border-t border-black/5 bg-white/60 backdrop-blur-md z-[20] overflow-hidden flex items-center">
          <div className="invi-ticker-track flex whitespace-nowrap text-[9px] font-medium tracking-[0.25em] text-gray-500 w-max uppercase">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-12 pr-12">
                <span>Narrative <span className="text-blue-400 mx-2">/</span> Active</span>
                <span>Coordinate <span className="text-gray-300 mx-2">—</span> Unknown</span>
                <span>Depth <span className="text-pink-400 mx-2">/</span> Lost</span>
                <span>Observation Continuing</span>
                <span>Anomaly in Sector 9</span>
              </div>
            ))}
          </div>
        </div>

        {/* 左側コピー */}
        <div className="invi-copy absolute inset-y-0 left-12 sm:left-16 z-30 flex items-center pointer-events-none">
          <div className="pl-[5vw] max-w-[30rem] space-y-6">
            <p className="anim-fade-up text-[10px] font-medium uppercase tracking-[0.4em] text-gray-400 flex items-center gap-3">
              <span className="w-6 h-px bg-gray-300" />
              RPG / Narrative
            </p>
            <h1 className="anim-fade-up font-serif text-[2.5rem] sm:text-5xl lg:text-6xl font-medium leading-[1.2] text-gray-900 tracking-wide">
              <span className="block mb-2">奥行きを失った世界で、</span>
              <span className="block text-gray-400">生きる。</span>
            </h1>
            <p className="anim-fade-up text-xs sm:text-sm leading-loose text-gray-500 max-w-sm tracking-wide">
              神の死が残した歪みの中で、<br />
              ふたりの少女が運命に選ばされていく。
            </p>
          </div>
        </div>

        {/* 右下ボタン群（PC） */}
        <div className="hidden md:flex absolute right-[4vw] bottom-[6vh] z-30 items-center gap-4">
          <a
            href="https://x.com/seraf_dev"
            target="_blank"
            rel="noopener noreferrer"
            className="anim-fade-up group relative inline-flex items-center gap-3 bg-white border border-black/10 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-600 transition-all hover:bg-gray-50 hover:border-black/20 hover:text-gray-900 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
          >
            <span className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-blue-200 to-pink-200 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Follow Updates
          </a>
        </div>
      </section>

      {/* ===== 下層セクション ===== */}
      <main className="relative z-10 pl-12 sm:pl-16 bg-transparent">
        
        {/* 背景グリッドの下層延長 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[20%] inset-y-0 w-px bg-black/[0.03]" />
          <div className="absolute left-[50%] inset-y-0 w-px bg-black/[0.03]" />
          <div className="absolute left-[80%] inset-y-0 w-px bg-black/[0.03]" />
        </div>

        <div className="mx-auto max-w-5xl px-6 sm:px-12 pb-32">
          
          {/* WORLD */}
          <section id="world" className="invi-section pt-32 space-y-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-black/5 pb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-px bg-black/20" />
                  <p className="text-[10px] font-serif uppercase tracking-[0.4em] text-gray-400">
                    01 — World
                  </p>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 tracking-wide">
                  平成中期、日本の山奥で
                </h2>
              </div>
              <p className="max-w-xl text-xs sm:text-sm leading-loose text-gray-500 tracking-wide">
                この集落には、かつて"神"と呼ばれた男がいた。<br />
                彼は奇跡を起こし、願いを叶え、人々の信仰を一身に受けていた——暴走する、その力に気づくまでは。<br />
                神は討たれ、残されたのは"力"だけ。やがてそれは遺跡にこびりつき、世界から「奥行き」を奪っていく。
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                { label: "Location", title: "山間の閉ざされた集落", desc: "外界からほとんど切り離された、平成中期の日本の山奥。過去の信仰と噂話だけが、この村をかろうじて世界とつないでいる。" },
                { label: "Anomaly", title: "奥行きを失った遺跡空間", desc: "神の力が滞留した遺跡では、遠くのものも近くのものも、すべてが同じ距離に見える。壁も、道も、空さえも、押しつぶされたように重なり合っている。" },
                { label: "Power", title: "神の死後も残り続けた力", desc: "奇跡そのものは消えても、代償だけは世界に残る。その力をどう扱い、誰に背負わせるのか——決めるのは、いつだって神ではなく人間だ。" }
              ].map((item, i) => (
                <div key={i} className="group relative bg-white p-8 border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-black/10">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-blue-100 to-pink-100 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  <p className="text-[9px] font-serif uppercase tracking-[0.3em] text-gray-400">{item.label}</p>
                  <p className="mt-4 text-sm font-bold text-gray-800 tracking-wide">{item.title}</p>
                  <p className="mt-4 text-[11px] leading-loose text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* VISUALS / SCENES */}
          <section id="visuals" className="invi-section pt-32 space-y-12 overflow-hidden">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-black/5 pb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-px bg-black/20" />
                  <p className="text-[10px] font-serif uppercase tracking-[0.4em] text-gray-400">
                    02 — Fragments
                  </p>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 tracking-wide">
                  記憶の欠片。
                </h2>
              </div>
              <p className="max-w-xl text-xs sm:text-sm leading-loose text-gray-500 tracking-wide">
                ※画像が用意されるまでのプレースホルダーです。ここに物語のワンシーンやCGを配置します。<br />
                画面外までエンドレスに流れ続ける横スクロールギャラリーです。
              </p>
            </div>

            {/* 横スクロールギャラリー — 純CSS無限ループ */}
            <div className="relative w-screen -ml-[calc(50vw-50%)] overflow-hidden border-y border-black/5 bg-gray-50/30 py-6">
              {/* フェードエッジ */}
              <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-gray-50/60 to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-gray-50/60 to-transparent pointer-events-none" />

              <div
                className="flex gap-6"
                style={{
                  width: "max-content",
                  animation: "invi-marquee 60s linear infinite",
                }}
              >
                {/* 4セット並べてシームレスなループを保証 */}
                {[...Array(4)].map((_, groupIndex) => (
                  <div key={groupIndex} className="flex gap-6 shrink-0">
                    {[
                      { src: "/images/invi/gallery_key_visual.png", alt: "InVi Key Visual", text: "KEY VISUAL", w: 700, hasImage: true },
                      { src: "/images/invi/gallery_scene01.jpg", alt: "Scene — Encounter", text: "SCENE_01 / ENCOUNTER", w: 700, hasImage: true },
                      { src: null, alt: null, text: "SCENE_02 / AWAKENING", w: 500, hasImage: false },
                      { src: null, alt: null, text: "SCENE_03 / RESONANCE", w: 560, hasImage: false },
                      { src: null, alt: null, text: "SCENE_04 / TRUTH", w: 480, hasImage: false },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="relative h-[220px] sm:h-[380px] shrink-0 overflow-hidden group"
                        style={{ width: `${item.w}px` }}
                      >
                        {item.hasImage ? (
                          <>
                            <img
                              src={item.src!}
                              alt={item.alt!}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-500" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                              <span className="text-[9px] font-serif tracking-[0.4em] text-white/70 uppercase">{item.text}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-white border border-black/5" />
                            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "repeating-linear-gradient(45deg, #aaa 0, #aaa 1px, transparent 0, transparent 50%)", backgroundSize: "8px 8px" }} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              <span className="text-[9px] font-serif tracking-[0.3em] text-gray-400">{item.text}</span>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CHARACTERS */}
          <section id="characters" className="invi-section pt-32 space-y-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-black/5 pb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-px bg-black/20" />
                  <p className="text-[10px] font-serif uppercase tracking-[0.4em] text-gray-400">
                    03 — Characters
                  </p>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 tracking-wide">
                  奇跡の子と、悲劇の子。
                </h2>
              </div>
              <p className="max-w-xl text-xs sm:text-sm leading-loose text-gray-500 tracking-wide">
                周囲の思惑によって敵同士として出会ったふたりの少女は、やがて互いの「選ばれ方」とその代償を知っていく。
              </p>
            </div>

            <div className="space-y-32">
              {/* スイ */}
              <article className="group relative flex flex-col md:flex-row items-center gap-8 md:gap-16">
                <div className="relative w-full md:w-1/2 flex justify-center h-[60vh] md:h-[80vh] min-h-[500px] max-h-[800px]">
                  {/* 背景の巨大テキスト */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] md:text-[15vw] font-serif font-bold text-gray-100 opacity-60 whitespace-nowrap -z-10 tracking-widest select-none pointer-events-none">
                    SUI
                  </div>
                  <img
                    src="/images/invi/sui.png"
                    alt="スイ"
                    className="h-full w-auto select-none object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="relative w-full md:w-1/2 py-8 bg-white/40 backdrop-blur-md p-8 sm:p-12 border border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
                  <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-blue-300 to-transparent scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-widest">スイ</h3>
                    <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-blue-500 border border-blue-200 px-4 py-1.5">
                      奇跡の子
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs font-serif uppercase tracking-[0.4em] text-gray-400 mb-8">
                    Miracle-Aligned / Resonance
                  </p>
                  <p className="text-sm sm:text-base leading-loose text-gray-700 tracking-wide">
                    生まれつき"神の力"と強く共鳴する特殊な能力を持った少女。<br />
                    集落では"奇跡の子"として祭り上げられ、母と周囲からの寵愛を一身に受けて育った。<br />
                    無邪気で明るく、深く考えずに笑っていられる——その在り方自体が、誰かにとっての残酷さになることを知らないまま。
                  </p>
                </div>
              </article>

              {/* ラン */}
              <article className="group relative flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
                <div className="relative w-full md:w-1/2 flex justify-center h-[60vh] md:h-[80vh] min-h-[500px] max-h-[800px]">
                  {/* 背景の巨大テキスト */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] md:text-[15vw] font-serif font-bold text-gray-100 opacity-60 whitespace-nowrap -z-10 tracking-widest select-none pointer-events-none">
                    RAN
                  </div>
                  <img
                    src="/images/invi/ran.png"
                    alt="ラン"
                    className="h-full w-auto select-none object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="relative w-full md:w-1/2 py-8 bg-white/40 backdrop-blur-md p-8 sm:p-12 border border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
                  <div className="absolute right-0 top-0 h-full w-[2px] bg-gradient-to-b from-pink-300 to-transparent scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-widest">ラン</h3>
                    <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-pink-500 border border-pink-200 px-4 py-1.5">
                      悲劇の子
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs font-serif uppercase tracking-[0.4em] text-gray-400 mb-8">
                    Blade-Wielder / Counter-Miracle
                  </p>
                  <p className="text-sm sm:text-base leading-loose text-gray-700 tracking-wide">
                    集落で絶大な権力を誇るアガタ家が、"奇跡の子"スイに対抗するために生み出した最高傑作。<br />
                    数多の剣を自在に操る力を与えられ、戦うためだけに育てられた少女。<br />
                    愛情よりも期待と義務を浴び続けた彼女は、同じ"選ばれた子"であるスイの存在を、運命への問いとして突きつけられる。
                  </p>
                </div>
              </article>
            </div>
          </section>

          {/* MOVIE / TRAILER */}
          <section id="movie" className="invi-section pt-32 space-y-12">
            <div className="flex items-center gap-3 px-6 sm:px-12 max-w-5xl mx-auto">
              <span className="w-8 h-px bg-black/20" />
              <p className="text-[10px] font-serif uppercase tracking-[0.4em] text-gray-400">
                04 — Movie
              </p>
            </div>
            
            {/* YouTube埋め込み */}
            <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6">
              <div className="relative aspect-video w-full bg-black overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
                <iframe
                  src="https://www.youtube.com/embed/0MKQKQDTbNc?rel=0&modestbranding=1&color=white"
                  title="InVi Concept Movie"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          </section>

          {/* STORY */}
          <section id="story" className="invi-section pt-32 pb-16 space-y-12">
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-black/20" />
              <p className="text-[10px] font-serif uppercase tracking-[0.4em] text-gray-400">
                05 — Story
              </p>
            </div>

            <div className="bg-gray-50/50 p-8 sm:p-12 border border-black/5">
              <p className="text-lg sm:text-xl font-serif text-gray-900 leading-loose tracking-wide">
                これは、"神の死"が残した歪みと、<br />
                それに運命を選ばされた少女たちの物語。
              </p>
              <p className="mt-8 text-xs sm:text-sm leading-loose text-gray-600 tracking-wide">
                神がいなくなったあとも、力だけは世界に残る。<br />
                集落の大人たちは、その力を恐れながらも手放せず、「奇跡」と「悲劇」を名前だけ変えて子どもたちに押しつけていく。<br />
                スイとランは、自分たちが何のために選ばれたのかを知ったとき、世界の歪みと向き合うか、それとも物語ごと拒絶するかを選ばされる。
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 pl-12 sm:pl-16 border-t border-black/5 bg-white py-8 text-[10px] text-gray-400">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 sm:px-12">
          <div className="flex items-center gap-4">
            <span className="font-serif font-bold uppercase tracking-[0.3em] text-gray-600">InVi</span>
            <span className="hidden sm:inline tracking-widest">— Under Development</span>
          </div>
          <div className="flex items-center gap-6 tracking-widest">
            <span>© Seraf()</span>
            <a href="/" className="transition-colors hover:text-gray-900">Return</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
