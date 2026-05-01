import type { MetaFunction } from "@remix-run/node";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { animate, inView, stagger, scroll } from "motion";
import Lenis from "lenis";
import { GlassShards } from "~/components/invi/GlassShards";
import { SkyBackground } from "~/components/invi/SkyBackground";
import { members } from "~/data/members";

export const meta: MetaFunction = () => {
  return [
    { title: "InvI | Seraf()" },
    {
      name: "description",
      content:
        "平成初期、日本の奥深い集落。奥行きのない世界を舞台に、視点変更による次元操作で戦う2D×2Dアクション。",
    },
    { property: "og:title", content: "InvI | Seraf()" },
    {
      property: "og:description",
      content:
        "トップダウンと横スクロールを瞬時に切り替え、空間の錯覚を利用して戦うスタイリッシュな2D×2Dアクション。",
    },
    { property: "og:type", content: "website" },
  ];
};

const NAV_ICONS = [
  { id: "news", label: "00", href: "#news" },
  { id: "visuals", label: "01", href: "#visuals" },
  { id: "systems", label: "02", href: "#systems" },
  { id: "movie", label: "03", href: "#movie" },
  { id: "characters", label: "04", href: "#characters" },
  { id: "world", label: "05", href: "#world" },
  { id: "products", label: "06", href: "#products" },
  { id: "credits", label: "07", href: "#credits" },
  { id: "story", label: "08", href: "#story" },
];

const GLOBAL_NAV = [
  { label: "News", href: "#news" },
  { label: "Story", href: "#story" },
  { label: "Archive", href: "/InvI/wiki" },
  { label: "Movie", href: "#movie" },
  { label: "Character", href: "#characters" },
  { label: "Products", href: "#products" },
  { label: "Credits", href: "#credits" },
  { label: "About", href: "#world" },
];

const NEWS_ITEMS = [
  { category: "Info", date: "2026.05.01", title: "InvI ティザーサイトをリニューアルしました。" },
  { category: "Visual", date: "2026.05.01", title: "スイ、ランのキャラクタービジュアルを公開。" },
  { category: "Movie", date: "2026.04.29", title: "コンセプトムービーを公開しました。" },
];

const HERO_METRICS = [
  { label: "View", value: "2D x 2D" },
  { label: "Depth", value: "Lost" },
  { label: "Shift", value: "Instant" },
];

const MOTION_PANELS = [
  { label: "Layer 01", title: "Top View", value: "Observe" },
  { label: "Layer 02", title: "Side View", value: "Strike" },
  { label: "Layer 03", title: "Tenka", value: "Reflect" },
];

const CHARACTERS = [
  {
    id: "sui",
    name: "スイ",
    role: "奇跡の子",
    type: "Miracle-Aligned",
    image: "/images/invi/sui.png",
    color: "from-blue-200/70 to-cyan-100/40",
  },
  {
    id: "ran",
    name: "ラン",
    role: "悲劇の子",
    type: "Blade-Wielder",
    image: "/images/invi/ran.png",
    color: "from-pink-200/70 to-rose-100/40",
  },
];

const WORLD_CARDS = [
  {
    label: "Location",
    title: "平成初期、日本の奥深い集落",
    desc: "外界から隔てられた山奥の集落。統治する本家アガタを中心に、力と支配を巡る因縁が静かに渦巻いている。",
  },
  {
    label: "Anomaly",
    title: "奥行きのない世界",
    desc: "超常の存在「ナルカミ」によって、遺跡は奥行きを失った空間へ変貌した。遠近、重なり、回避の概念そのものが戦いのルールになる。",
  },
  {
    label: "Conflict",
    title: "スイとアガタの衝突",
    desc: "特異な力を持つ少女スイは、その力を巡って集落を統治する本家アガタと激突する。歪んだ遺跡は、両者の争いをさらに異常なものへ変えていく。",
  },
];

const SCENE_FRAGMENTS = [
  { src: "/images/invi/gallery_key_visual.png", alt: "InVi Key Visual", text: "KEY VISUAL", w: 720, hasImage: true },
  { src: "/images/invi/gallery_scene01.jpg", alt: "Scene Encounter", text: "SCENE_01 / ENCOUNTER", w: 680, hasImage: true },
  { src: "/images/invi/game-topdown.png", alt: "Top-down gameplay", text: "GAMEPLAY_01 / TOPDOWN", w: 680, hasImage: true },
  { src: "/images/invi/game-sideview.png", alt: "Side-view gameplay", text: "GAMEPLAY_02 / SIDE VIEW", w: 680, hasImage: true },
  { src: "/images/invi/game-mignite.png", alt: "Mignite battle gameplay", text: "GAMEPLAY_03 / BATTLE", w: 680, hasImage: true },
];

const SYSTEMS = [
  {
    label: "01",
    title: "2つの2D視点",
    desc: "上から見た視点と横から見た視点を切り替えながら進む2Dアクション。見え方を変えることで、移動や攻撃の方法も変わる。",
  },
  {
    label: "02",
    title: "視点切り替え",
    desc: "同じ場所でも、視点を変えると通れる道や敵との距離が変わる。状況に合わせて視点を切り替えることが攻略の鍵になる。",
  },
  {
    label: "03",
    title: "転加",
    desc: "物体の向きを変える「転加」で、移動、回避、反撃を広げる。視点切り替えと組み合わせて戦い方を組み立てる。",
  },
];

const GAME_OVERVIEW = [
  { label: "Genre", value: "2D x 2D Action" },
  { label: "Play Style", value: "View Shift / Battle / ADV" },
  { label: "Control", value: "Controller Action" },
  { label: "Key System", value: "Dimensional Shift / Tenka" },
];

const PRODUCTS = [
  { label: "Teaser Site", title: "InvI Official Web", status: "Now Open" },
  { label: "Concept Movie", title: "Depthless World Trailer", status: "Watch" },
  { label: "Development", title: "2D x 2D Action Project", status: "In Progress" },
];

const CARD_BACKGROUNDS = [
  "/images/invi/detail-ui-panel.png",
  "/images/invi/lower-data-field.png",
  "/images/invi/lower-transition-band.png",
];

const CREDIT_GROUPS = [
  { role: "Planning / Direction", memberIds: [1] },
  { role: "Scenario / Game Design", memberIds: [1] },
  { role: "Programming / Web", memberIds: [1] },
  { role: "Character Illustration", memberIds: [17] },
  { role: "Visual Design", memberIds: [1, 17] },
];

const CREDIT_FEATURED_MEMBER_IDS = [1, 17];

function getMemberName(id: number) {
  return members.find((member) => member.id === id)?.name ?? "Unknown";
}

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
    const start = Date.now();
    const duration = 2000; // 2秒間ローディング画面を見せる
    let frameId = 0;
    let openTimer: ReturnType<typeof setTimeout>;

    const updateProgress = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(p);

      if (elapsed < duration) {
        frameId = requestAnimationFrame(updateProgress);
      } else {
        openTimer = setTimeout(() => setIsLoading(false), 300); // 100%になって少し待ってから開く
      }
    };
    frameId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(openTimer);
    };
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

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const ease = [0.22, 0.61, 0.36, 1];

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
      { delay: stagger(0.1, { startDelay: 0.8 }), duration: 0.8, easing: ease }
    );
    (animate as any)(
      ".invi-art",
      { opacity: [0, 1], scale: [1.02, 1] },
      { delay: 0.8, duration: 1.0, easing: ease }
    );
    (animate as any)(
      ".invi-motion-panel",
      { opacity: [0, 1], x: [28, 0], filter: ["blur(6px)", "blur(0px)"] },
      { delay: stagger(0.12, { startDelay: 1.05 }), duration: 0.9, easing: ease }
    );
    (animate as any)(
      ".invi-metric",
      { opacity: [0, 1], y: [14, 0] },
      { delay: stagger(0.08, { startDelay: 1.2 }), duration: 0.65, easing: ease }
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
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 relative overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">

      {/* フィルムグレイン（ノイズ）エフェクト */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] mix-blend-multiply [background-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44NSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWx0ZXI9InVybCgjbikiIG9wYWNpdHk9IjEiLz48L3N2Zz4=')] [background-size:200px_200px]" />

      {/* 全体に漂う1層目のガラス破片（少なめ） */}
      <GlassShards count={34} className="fixed inset-0 z-[1] pointer-events-none opacity-55" />

      {/* ===== 強化版ローディング画面 ===== */}
      {isLoading && (
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
      )}

      {/* ===== 左・縦ナビバー ===== */}
      <nav className="invi-sidenav fixed left-0 inset-y-0 z-40 w-12 sm:w-16 flex flex-col items-center justify-between py-8 bg-white/40 backdrop-blur-md border-r border-black/5">
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-serif tracking-[0.3em] text-gray-800 [writing-mode:vertical-rl] rotate-180 select-none">
            InVi
          </span>
          <div className="h-8 w-px bg-black/10" />
        </div>
        <div className="flex flex-col items-center gap-4 sm:gap-5">
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

      <header className="fixed left-12 right-0 top-0 z-50 border-b border-black/5 bg-white/55 backdrop-blur-xl sm:left-16">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
          <a href="#top" className="flex items-center gap-3">
            <img src="/images/invi/emblem.png" alt="" className="h-6 w-6 object-contain invert opacity-70" />
            <span className="font-serif text-xs font-bold uppercase tracking-[0.35em] text-gray-900">InvI</span>
          </a>
          <nav className="hidden items-center gap-6 lg:flex">
            {GLOBAL_NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-500 transition-colors hover:text-gray-950"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="https://x.com/seraf_dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center border border-black/10 bg-gray-950 px-3 text-[9px] font-bold uppercase tracking-[0.22em] text-white transition-colors hover:bg-gray-800"
          >
            Official X
          </a>
        </div>
      </header>

      {/* ===== HERO（フルスクリーン） ===== */}
      <section
        id="top"
        className="relative min-h-[100svh] w-full overflow-hidden bg-[#0f172a] pl-12 pt-14 sm:pl-16"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      >
        {/* ヒーロー背景：青とピンクのドラマチックな空 */}
        <SkyBackground />

        <div className="pointer-events-none absolute inset-0 z-[0] overflow-hidden bg-[#eef7ff]">
          <img
            src="/images/invi/motion-hero-bg.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center opacity-82 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.18),rgba(255,255,255,0.62)_34%,rgba(239,246,255,0.34)_58%,rgba(15,23,42,0.12)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_16%,transparent_82%,rgba(226,242,255,0.28))]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.42),transparent_20%,transparent_74%,rgba(255,255,255,0.34))]" />
        </div>

        <div className="pointer-events-none absolute inset-0 z-[3] opacity-70">
          <div className="invi-scanline absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cyan-200/35 via-white/20 to-transparent" />
          <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(15,23,42,0.34)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.18)_1px,transparent_1px)] [background-size:100%_7px,7px_100%]" />
          <div className="absolute left-[18%] top-[18%] h-[22rem] w-[22rem] rounded-full border border-cyan-200/50 shadow-[0_0_80px_rgba(125,211,252,0.28)]" />
          <div className="absolute right-[6%] bottom-[17%] h-[18rem] w-[18rem] rounded-full border border-pink-200/45 shadow-[0_0_70px_rgba(244,114,182,0.2)]" />
        </div>

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
        <GlassShards count={36} className="absolute inset-0 z-[2] pointer-events-none opacity-75" />

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

            <div className="parallax-bg absolute left-[7%] top-[56%] z-[6] hidden w-56 pointer-events-none lg:block">
              <div
                className="transition-transform duration-700 ease-out"
                style={{ transform: `translate(${mousePos.x * 16}px, ${mousePos.y * 10}px)` }}
              >
                {MOTION_PANELS.map((panel, index) => (
                  <div
                    key={panel.label}
                    className="invi-motion-panel mb-3 border border-white/50 bg-white/32 px-4 py-3 text-gray-700 shadow-[0_18px_60px_rgba(59,130,246,0.12)] backdrop-blur-xl"
                    style={{ clipPath: index === 1 ? "polygon(0 0, 100% 0, 92% 100%, 0 100%)" : "polygon(8% 0, 100% 0, 100% 100%, 0 100%, 0 18%)" }}
                  >
                    <div className="flex items-center justify-between gap-4 text-[8px] font-bold uppercase tracking-[0.28em] text-cyan-600/80">
                      <span>{panel.label}</span>
                      <span>0{index + 1}</span>
                    </div>
                    <div className="mt-3 flex items-end justify-between gap-4">
                      <span className="font-serif text-xl leading-none tracking-wide text-gray-950">{panel.title}</span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-gray-500">{panel.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 背面の巨大エンブレム */}
            <div className="parallax-bg absolute inset-0 z-[8] pointer-events-none">
              <div
                className="flex h-full w-full items-center justify-center pb-[18vh] transition-transform duration-700 ease-out lg:pb-[8vh]"
                style={{ transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 6}px) scale(${1 + Math.abs(mousePos.x) * 0.01})` }}
              >
                <img
                  src="/images/invi/emblem.png"
                  alt="InVi Emblem"
                  className="w-[48vw] min-w-[17rem] max-w-[42rem] object-contain invert opacity-[0.16] mix-blend-multiply -translate-y-[4vh]"
                />
              </div>
            </div>

            {/* ど真ん中のタイトルロゴ */}
            <div className="parallax-bg absolute inset-0 z-[30] pointer-events-none">
              <div
                className="w-full h-full flex flex-col items-center justify-center transition-transform duration-700 ease-out pb-[18vh] lg:pb-[8vh]"
                style={{ transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)` }}
              >
                {/* タイトルロゴ */}
                <div className="relative w-[68vw] max-w-[480px] -translate-y-[6vh] sm:-translate-y-[4vh]">
                  <img
                    src="/images/invi/logo.png"
                    alt=""
                    className="absolute inset-0 h-auto w-full translate-x-1 -translate-y-1 object-contain opacity-25 blur-[0.5px] mix-blend-screen"
                    style={{ filter: "invert(71%) sepia(42%) saturate(801%) hue-rotate(176deg) brightness(96%)" }}
                  />
                  <img
                    src="/images/invi/logo.png"
                    alt=""
                    className="absolute inset-0 h-auto w-full -translate-x-1 translate-y-1 object-contain opacity-20 blur-[0.5px] mix-blend-screen"
                    style={{ filter: "invert(78%) sepia(58%) saturate(1069%) hue-rotate(292deg) brightness(101%)" }}
                  />
                  <img
                    src="/images/invi/logo.png"
                    alt="InVi Logo"
                    className="relative h-auto w-full object-contain opacity-80 mix-blend-multiply drop-shadow-[0_18px_50px_rgba(255,255,255,0.72)]"
                    style={{ filter: "invert(1) brightness(0.72) saturate(0.85)" }}
                  />
                </div>
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
                  className="absolute bottom-[-50vh] left-1/2 h-[108%] w-auto -translate-x-[16%] select-none object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)] sm:bottom-[-52vh] sm:h-[128%] sm:-translate-x-[24%] lg:bottom-[-61vh] lg:h-[152%] lg:-translate-x-[30%] xl:bottom-[-66vh] xl:h-[160%] xl:-translate-x-[34%]"
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
                  className="absolute bottom-[-49vh] left-1/2 h-[106%] w-auto -translate-x-[74%] select-none object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)] sm:bottom-[-51vh] sm:h-[126%] sm:-translate-x-[80%] lg:bottom-[-60vh] lg:h-[148%] lg:-translate-x-[76%] xl:bottom-[-65vh] xl:h-[156%] xl:-translate-x-[74%]"
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
          <div className="pl-[5vw] max-w-[46rem] space-y-5 pt-12 sm:space-y-6">
            <p className="anim-fade-up text-[10px] font-medium uppercase tracking-[0.4em] text-gray-400 flex items-center gap-3">
              <span className="w-6 h-px bg-gray-300" />
              2D x 2D Action / Narrative
            </p>
            <h1 className="anim-fade-up font-serif text-[2.35rem] sm:text-5xl lg:text-6xl font-medium leading-[1.12] text-gray-900 tracking-normal">
              <span className="mb-2 block sm:whitespace-nowrap">奥行きを失った世界で、</span>
              <span className="block text-gray-400">生きる。</span>
            </h1>
            <p className="anim-fade-up text-xs sm:text-sm leading-loose text-gray-500 max-w-sm tracking-wide">
              トップダウンと横スクロールを切り替え、<br />
              空間の錯覚で戦うスタイリッシュ2Dアクション。
            </p>
          </div>
        </div>

        <aside className="hidden xl:block anim-fade-up absolute right-[4vw] top-[16vh] z-30 w-[22rem] border border-black/10 bg-white/70 p-5 backdrop-blur-xl shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <span className="text-[9px] font-serif uppercase tracking-[0.35em] text-gray-400">News</span>
            <span className="h-2 w-2 rounded-full bg-blue-300 shadow-[0_0_16px_rgba(147,197,253,0.9)]" />
          </div>
          <div className="mt-4 space-y-4">
            {NEWS_ITEMS.map((item) => (
              <a key={`${item.date}-${item.title}`} href="#news" className="group block border-b border-black/5 pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.22em]">
                  <span className="text-blue-500">{item.category}</span>
                  <span className="text-gray-300">/</span>
                  <time className="text-gray-400">{item.date}</time>
                </div>
                <p className="mt-2 text-xs font-bold leading-relaxed tracking-wide text-gray-700 transition-colors group-hover:text-gray-950">
                  {item.title}
                </p>
              </a>
            ))}
          </div>
        </aside>

        <div className="pointer-events-none absolute right-[2vw] top-[48vh] z-[8] hidden w-[18rem] -translate-y-1/2 xl:block">
          <div className="relative overflow-hidden border-y border-white/45 py-4 text-gray-800">
            <img
              src="/images/invi/detail-ui-panel.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-[0.28] mix-blend-multiply"
            />
            <div className="absolute inset-0 bg-white/34 backdrop-blur-[2px]" />
            <div className="absolute inset-y-3 left-0 w-px bg-cyan-300/80" />
            <div className="absolute inset-y-3 right-0 w-px bg-pink-200/70" />
            <div className="relative space-y-3 px-4">
              {HERO_METRICS.map((metric, index) => (
                <div key={metric.label} className="invi-metric grid grid-cols-[4.5rem_1fr] items-baseline gap-4 border-b border-black/10 pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-cyan-400/80" />
                    <p className="text-[8px] font-bold uppercase tracking-[0.28em] text-cyan-700/75">{metric.label}</p>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-serif text-xl leading-none tracking-wide text-gray-950">{metric.value}</p>
                    <span className="text-[8px] font-bold uppercase tracking-[0.24em] text-gray-400">0{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右下ボタン群（PC） */}
        <div className="hidden md:flex absolute right-[4vw] bottom-[8vh] z-30 items-center gap-4">
          <a
            href="/InvI/wiki"
            className="anim-fade-up group relative inline-flex items-center gap-3 bg-gray-950 border border-gray-950 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:bg-gray-800 hover:border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
          >
            <span className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-blue-200 to-pink-200 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            Open Archive
          </a>
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
          <img
            src="/images/invi/lower-data-field.png"
            alt=""
            className="absolute left-1/2 top-[12rem] h-[58rem] w-[150vw] max-w-none -translate-x-1/2 object-cover opacity-[0.16] mix-blend-multiply"
          />
          <img
            src="/images/invi/detail-ui-panel.png"
            alt=""
            className="absolute left-1/2 top-[58rem] h-[46rem] w-[140vw] max-w-none -translate-x-1/2 object-cover opacity-[0.1] mix-blend-multiply"
          />
          <img
            src="/images/invi/lower-transition-band.png"
            alt=""
            className="absolute left-1/2 top-[96rem] h-[24rem] w-[150vw] max-w-none -translate-x-1/2 object-cover opacity-[0.18] mix-blend-multiply"
          />
          <img
            src="/images/invi/detail-mood-banner.png"
            alt=""
            className="absolute left-1/2 top-[144rem] h-[42rem] w-[140vw] max-w-none -translate-x-1/2 object-cover opacity-[0.08] mix-blend-multiply"
          />
          <img
            src="/images/invi/lower-edge-accent.png"
            alt=""
            className="absolute right-[-8rem] top-[32rem] h-[86rem] w-[30rem] object-cover opacity-[0.16] mix-blend-multiply"
          />
          <img
            src="/images/invi/lower-edge-accent.png"
            alt=""
            className="absolute left-[-10rem] top-[118rem] h-[78rem] w-[30rem] scale-x-[-1] object-cover opacity-[0.13] mix-blend-multiply"
          />
          <div className="absolute inset-x-0 top-[76rem] h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
          <div className="absolute inset-x-0 top-[132rem] h-px bg-gradient-to-r from-transparent via-pink-300/25 to-transparent" />
          <div className="absolute left-[20%] inset-y-0 w-px bg-black/[0.03]" />
          <div className="absolute left-[50%] inset-y-0 w-px bg-black/[0.03]" />
          <div className="absolute left-[80%] inset-y-0 w-px bg-black/[0.03]" />
        </div>

        <div className="mx-auto max-w-6xl px-6 sm:px-12 pb-32">

          {/* NEWS */}
          <section id="news" className="invi-section pt-24 space-y-8">
            <div className="flex flex-col gap-6 border-b border-black/5 pb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-px bg-black/20" />
                  <p className="text-[10px] font-serif uppercase tracking-[0.4em] text-gray-400">
                    00 — News
                  </p>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 tracking-wide">
                  最新情報
                </h2>
              </div>
              <a
                href="https://x.com/seraf_dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center border border-black/10 bg-white px-5 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-gray-600 transition-colors hover:bg-gray-950 hover:text-white"
              >
                Official X
              </a>
            </div>

            <div className="divide-y divide-black/5 border border-black/5 bg-white/80">
              {NEWS_ITEMS.map((item) => (
                <a
                  key={`${item.date}-${item.title}`}
                  href="https://x.com/seraf_dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid gap-3 p-5 transition-colors hover:bg-gray-50 sm:grid-cols-[8rem_7rem_1fr]"
                >
                  <time className="text-[10px] font-bold uppercase tracking-[0.28em] text-gray-400">{item.date}</time>
                  <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-blue-500">{item.category}</span>
                  <span className="text-sm font-bold leading-relaxed tracking-wide text-gray-700 transition-colors group-hover:text-gray-950">
                    {item.title}
                  </span>
                </a>
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
                    01 — Fragments
                  </p>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 tracking-wide">
                  記憶の欠片。
                </h2>
              </div>
              <p className="max-w-xl text-xs sm:text-sm leading-loose text-gray-500 tracking-wide">
                立ち絵、キーアート、未公開の場面断片を並べたビジュアルログ。<br />
                まだ像を結ばないシーンは、物語の欠落として残しておく。
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
                    {SCENE_FRAGMENTS.map((item, i) => (
                      <div
                        key={i}
                        className="relative h-[220px] w-[min(82vw,var(--scene-w))] shrink-0 overflow-hidden group sm:h-[380px]"
                        style={{ "--scene-w": `${item.w}px` } as CSSProperties}
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

          {/* SYSTEMS */}
          <section id="systems" className="invi-section pt-32 space-y-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-black/5 pb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-px bg-black/20" />
                  <p className="text-[10px] font-serif uppercase tracking-[0.4em] text-gray-400">
                    02 — System
                  </p>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 tracking-wide">
                  ふたつの視点を切り替えて戦う。
                </h2>
              </div>
              <p className="max-w-xl text-xs sm:text-sm leading-loose text-gray-500 tracking-wide">
                上から見た画面と、横から見た画面を切り替えながら進むアクションゲーム。視点を変えることで、移動できる場所や敵との距離が変わる。
              </p>
            </div>

            <div className="grid overflow-hidden border border-black/5 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.05)] lg:grid-cols-[1.08fr_0.92fr]">
              <div className="relative min-h-[22rem] bg-gray-950">
                <img
                  src="/images/invi/gallery_scene01.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-55 mix-blend-screen"
                />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(15,23,42,0.35)_52%,rgba(236,72,153,0.22))]" />
                <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:38px_38px]" />
                <div className="relative flex h-full min-h-[22rem] flex-col justify-between p-7 sm:p-9">
                  <div className="flex flex-wrap gap-2">
                    {GAME_OVERVIEW.map((item) => (
                      <span key={item.label} className="border border-white/15 bg-white/10 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.24em] text-white/70 backdrop-blur-md">
                        {item.value}
                      </span>
                    ))}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-blue-200">2D x 2D Action</p>
                    <h3 className="mt-4 max-w-xl font-serif text-3xl leading-tight tracking-normal text-white sm:text-5xl">
                      見え方を変えて、
                      <span className="block text-white/55">道を作る。</span>
                    </h3>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-black/5 bg-[#fbfaf6]">
                {[
                  ["01", "上から見る", "部屋全体の配置を見ながら移動する。敵の位置や進める場所を確認しやすい視点。"],
                  ["02", "横から見る", "ジャンプや段差、攻撃の高さがわかりやすい視点。アクションの操作感が変わる。"],
                  ["03", "切り替えて進む", "片方の視点では進めない場所も、もう片方の視点に変えると突破口が見える。"],
                ].map(([num, title, desc]) => (
                  <article key={num} className="grid gap-5 p-6 sm:grid-cols-[4rem_1fr] sm:p-7">
                    <span className="font-serif text-3xl text-gray-300">{num}</span>
                    <div>
                      <h3 className="text-base font-bold tracking-[0.2em] text-gray-900">{title}</h3>
                      <p className="mt-3 text-xs leading-loose tracking-wide text-gray-500">{desc}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {SYSTEMS.map((system, index) => (
                <article key={system.label} className="group relative min-h-[15rem] overflow-hidden border border-black/5 bg-white p-7 shadow-[0_10px_36px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
                  <img
                    src={CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length]}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-[0.13] mix-blend-multiply transition-opacity duration-500 group-hover:opacity-[0.2]"
                  />
                  <div className="absolute inset-0 bg-white/74" />
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-blue-200 via-white to-pink-200 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative flex h-full flex-col justify-between gap-10">
                    <span className="font-serif text-xs tracking-[0.45em] text-gray-300">{system.label}</span>
                    <div>
                      <h3 className="font-serif text-2xl tracking-wide text-gray-950">{system.title}</h3>
                      <p className="mt-5 text-xs leading-loose tracking-wide text-gray-500">{system.desc}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* MOVIE / TRAILER */}
          <section id="movie" className="invi-section pt-32 space-y-12">
            <div className="flex items-center gap-3 px-6 sm:px-12 max-w-5xl mx-auto">
              <span className="w-8 h-px bg-black/20" />
              <p className="text-[10px] font-serif uppercase tracking-[0.4em] text-gray-400">
                03 — Movie
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

          {/* CHARACTERS */}
          <section id="characters" className="invi-section pt-32 space-y-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-black/5 pb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-px bg-black/20" />
                  <p className="text-[10px] font-serif uppercase tracking-[0.4em] text-gray-400">
                    04 — Characters
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

          {/* WORLD */}
          <section id="world" className="invi-section pt-32 space-y-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-black/5 pb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-px bg-black/20" />
                  <p className="text-[10px] font-serif uppercase tracking-[0.4em] text-gray-400">
                    05 — World
                  </p>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 tracking-wide">
                  平成初期、日本の奥深い集落で
                </h2>
              </div>
              <p className="max-w-xl text-xs sm:text-sm leading-loose text-gray-500 tracking-wide">
                超常の存在「ナルカミ」により、遺跡は"奥行きのない世界"と化した。<br />
                特異な力を持つ少女スイは、集落を統治する本家アガタと力を巡って激突する。
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {WORLD_CARDS.map((item, i) => (
                <div key={i} className="group relative overflow-hidden bg-white p-8 border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-black/10">
                  <img
                    src={CARD_BACKGROUNDS[(i + 1) % CARD_BACKGROUNDS.length]}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-[0.1] mix-blend-multiply transition-opacity duration-500 group-hover:opacity-[0.18]"
                  />
                  <div className="absolute inset-0 bg-white/78" />
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-blue-100 to-pink-100 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  <div className="relative">
                    <p className="text-[9px] font-serif uppercase tracking-[0.3em] text-gray-400">{item.label}</p>
                    <p className="mt-4 text-sm font-bold text-gray-800 tracking-wide">{item.title}</p>
                    <p className="mt-4 text-[11px] leading-loose text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-8 border border-black/5 bg-white/60 p-6 sm:p-8 md:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-[10px] font-serif uppercase tracking-[0.4em] text-gray-400">Incident Chain</p>
                <h3 className="mt-4 font-serif text-2xl text-gray-900">遺跡は、奥行きを失った。</h3>
              </div>
              <div className="space-y-5">
                {[
                  ["01", "平成初期、日本の奥深い集落に超常の存在「ナルカミ」が現れる。"],
                  ["02", "ナルカミの影響により、遺跡は奥行きのない異常空間へ変貌する。"],
                  ["03", "特異な力を持つスイは、本家アガタと力を巡って激突する。"],
                ].map(([num, text]) => (
                  <div key={num} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-black/5 pb-5 last:border-b-0 last:pb-0">
                    <span className="font-serif text-xs tracking-[0.3em] text-gray-300">{num}</span>
                    <p className="text-xs leading-loose tracking-wide text-gray-600">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PRODUCTS */}
          <section id="products" className="invi-section pt-32 space-y-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-black/5 pb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-px bg-black/20" />
                  <p className="text-[10px] font-serif uppercase tracking-[0.4em] text-gray-400">
                    06 — Products
                  </p>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 tracking-wide">
                  公開中のコンテンツ
                </h2>
              </div>
              <p className="max-w-xl text-xs sm:text-sm leading-loose text-gray-500 tracking-wide">
                作品情報、映像、制作ログを段階的に公開していくためのポータル。ティザーから本編情報へ、公式サイトとして育てていく。
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {PRODUCTS.map((product, index) => (
                <article key={product.label} className="group relative overflow-hidden border border-black/5 bg-white p-7 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
                  <img
                    src={CARD_BACKGROUNDS[(index + 2) % CARD_BACKGROUNDS.length]}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-[0.12] mix-blend-multiply transition-opacity duration-500 group-hover:opacity-[0.22]"
                  />
                  <div className="absolute inset-0 bg-white/72" />
                  <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-blue-200 via-white to-pink-200 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative">
                    <p className="text-[10px] font-serif uppercase tracking-[0.35em] text-gray-400">{product.label}</p>
                    <h3 className="mt-6 min-h-[4rem] font-serif text-2xl leading-snug tracking-wide text-gray-900">{product.title}</h3>
                    <div className="mt-8 flex items-center justify-between border-t border-black/5 pt-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-500">{product.status}</span>
                      <span className="text-lg text-gray-300 transition-colors group-hover:text-gray-900">→</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* CREDITS */}
          <section id="credits" className="invi-section pt-32 space-y-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-black/5 pb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-px bg-black/20" />
                  <p className="text-[10px] font-serif uppercase tracking-[0.4em] text-gray-400">
                    07 — Credits
                  </p>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 tracking-wide">
                  開発メンバー
                </h2>
              </div>
              <p className="max-w-xl text-xs sm:text-sm leading-loose text-gray-500 tracking-wide">
                InvI は KTN と楚々による制作プロジェクトです。企画、シナリオ、実装、ビジュアル制作のクレジットを掲載します。
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative overflow-hidden border border-black/5 bg-gray-950 p-8 text-white shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
                <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
                <img
                  src="/images/invi/emblem.png"
                  alt=""
                  className="absolute -right-12 -top-12 w-44 opacity-[0.06] invert"
                />
                <div className="relative">
                  <p className="text-[10px] font-serif uppercase tracking-[0.4em] text-white/35">Core Staff</p>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    {CREDIT_FEATURED_MEMBER_IDS.map((id) => {
                      const member = members.find((item) => item.id === id);
                      if (!member) return null;

                      return (
                        <div key={member.id} className="group">
                          <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
                            <img
                              src={member.mainImage}
                              alt={member.name}
                              className="h-full w-full object-cover opacity-80 grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 to-transparent" />
                          </div>
                          <p className="mt-3 text-sm font-bold tracking-[0.16em] text-white">{member.name}</p>
                          <p className="mt-1 text-[10px] leading-relaxed tracking-[0.18em] text-white/45">
                            {member.position.split(",").slice(0, 2).join(" / ")}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="border border-black/5 bg-white/80">
                {CREDIT_GROUPS.map((group) => (
                  <div key={group.role} className="grid gap-4 border-b border-black/5 p-5 last:border-b-0 sm:grid-cols-[14rem_1fr]">
                    <p className="text-[10px] font-bold uppercase leading-relaxed tracking-[0.25em] text-gray-400">
                      {group.role}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.memberIds.map((id) => (
                        <span
                          key={`${group.role}-${id}`}
                          className="border border-black/5 bg-gray-50 px-3 py-2 text-xs font-bold tracking-[0.12em] text-gray-700"
                        >
                          {getMemberName(id)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* STORY */}
          <section id="story" className="invi-section pt-32 pb-16 space-y-12">
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-black/20" />
              <p className="text-[10px] font-serif uppercase tracking-[0.4em] text-gray-400">
                08 — Story
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="border border-black/5 bg-gray-50/50 p-8 sm:p-12">
                <p className="text-lg sm:text-xl font-serif text-gray-900 leading-loose tracking-wide">
                  これは、奥行きのない世界で、<br />
                  スイが力を巡る争いへ踏み込む物語。
                </p>
                <p className="mt-8 text-xs sm:text-sm leading-loose text-gray-600 tracking-wide">
                  平成初期、日本の奥深い集落。超常の存在「ナルカミ」により、遺跡は奥行きのない世界へ変貌した。<br />
                  特異な力を持つ少女スイは、集落を統治する本家アガタと力を巡り激突する。<br />
                  美麗なイラストによるADVパートでは、戦いの裏側にある因縁と感情が描かれていく。
                </p>
              </div>
              <div className="relative overflow-hidden border border-black/5 bg-white p-8 sm:p-10">
                <img
                  src="/images/invi/emblem.png"
                  alt=""
                  className="absolute -right-10 -top-10 w-40 opacity-[0.04] invert"
                />
                <p className="text-[10px] font-serif uppercase tracking-[0.4em] text-gray-400">Development Note</p>
                <p className="mt-5 text-sm leading-loose tracking-wide text-gray-600">
                  本編とは別の視点から、杉沢村、不可分領域、ナルカミに関する補足記録を整理しています。設定資料庫も順次更新予定です。
                </p>
                <a
                  href="/InvI/wiki"
                  className="mt-8 inline-flex items-center border border-black/10 bg-gray-950 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white transition-colors hover:bg-gray-800"
                >
                  Open Archive
                </a>
              </div>
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
