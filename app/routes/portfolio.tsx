import type { MetaFunction } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { animate, stagger, inView } from "motion";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { PortfolioNetworkBackground } from "~/components/PortfolioNetworkBackground";
import { PortfolioCursorNodes } from "~/components/PortfolioCursorNodes";
import type { OutletContext } from "~/root";
import { works } from "~/data/works";

type Project = {
  title: string;
  period: string;
  summary: string;
  contribution: string;
  tech: string[];
  link?: string;
  tag: string;
  image?: string;
};

const projects: Project[] = works;

const capabilities = [
  {
    title: "ゲーム / アプリケーション",
    items: [
      "ゲーム制作 (Unity / UE5)",
      "スマホアプリ開発",
      "VR / AR コンテンツ"
    ]
  },
  {
    title: "3DCG",
    items: [
      "モデリング / アニメーション (Blender / UE5)",
      "ロボットモデリング / プロップモデリング",
      "MV制作 / 映像演出"
    ]
  },
  {
    title: "イラスト",
    items: [
      "キャラクターデザイン",
      "Live2D リギング",
      "背景 / ステージデザイン"
    ]
  },
  {
    title: "Webデザイン / コーディング",
    items: [
      "Next.js / React / Three.js...",
      "Webサービス (ECサイト、ChatBot…)",
      "インタラクティ演出 (AR / XR)"
    ]
  },
  {
    title: "その他",
    items: [
      "舞台照明 (QLC+ / MagicQ / DasLight 5)",
      "サウンドエフェクト",
      "VJ(TouchDesigner, Unity...)"
    ]
  }
];

const metrics = [
  { label: "プログラミング", value: "ゲーム / XR / Web / インタラクティブ" },
  { label: "デザイン", value: "キャラクター / ロボット / 背景 / Web" },
  { label: "その他", value: "Live2D / 3Dモデリング / 舞台照明" },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Portfolio | Seraf()" },
    { name: "description", content: "Seraf() の制作実績と取り組みのポートフォリオ" },
    { property: "og:title", content: "Portfolio | Seraf()" },
    { property: "og:description", content: "Seraf() の制作実績と取り組みをご紹介します。" },
  ];
};

export default function PortfolioPage() {
  const { theme } = useOutletContext<OutletContext>();
  const isDark = theme === "dark";
  const [scrollOffset, setScrollOffset] = useState(0);
  const [selected, setSelected] = useState<Project | null>(null);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [showAllProjects, setShowAllProjects] = useState(false);

  const tags = ["all", ...Array.from(new Set(projects.map((p) => p.tag)))];
  const parsePeriod = (period: string) => {
    // YYYY-MM-DD / YYYY-MM / YYYY を優先して厳格にパース（UTCで比較）
    const normalized = period.trim();
    const seasonMonth = (str: string): number | null => {
      const s = str.toLowerCase();
      if (s.includes("春") || s.includes("spring")) return 4;
      if (s.includes("夏") || s.includes("summer")) return 7;
      if (s.includes("秋") || s.includes("fall") || s.includes("autumn")) return 10;
      if (s.includes("冬") || s.includes("winter")) return 1;
      return null;
    };
    const ts = (y: number, m = 1, d = 1) => Date.UTC(y, m - 1, d);

    // 1) YYYY-MM-DD (ハイフン/スラッシュ/ドット等区切り対応)
    const full = normalized.match(/(\d{4})[^\d]?(\d{1,2})[^\d]?(\d{1,2})/);
    if (full) {
      const y = Number(full[1]);
      const m = Number(full[2]);
      const d = Number(full[3]);
      return ts(y, m, d);
    }
    // 2) YYYY-MM
    const ym = normalized.match(/(\d{4})[^\d]?(\d{1,2})/);
    if (ym) {
      const y = Number(ym[1]);
      const m = Number(ym[2]);
      return ts(y, m, 1);
    }
    // 3) YYYY (+季節キーワードで月補完)
    const y = normalized.match(/(\d{4})/);
    if (y) {
      const year = Number(y[1]);
      const month = seasonMonth(normalized) ?? 1;
      return ts(year, month, 1);
    }
    return 0;
  };

  const filteredProjects = selectedTag === "all" ? projects : projects.filter((p) => p.tag === selectedTag);
  const sortedProjects = useMemo(
    () => [...filteredProjects].sort((a, b) => parsePeriod(b.period) - parsePeriod(a.period)),
    [filteredProjects]
  );

  const limitedProjects = useMemo(() => {
    if (showAllProjects) return sortedProjects;
    // 最新4件 + プレビュー2件をぼかしで表示
    return sortedProjects.slice(0, 6);
  }, [sortedProjects, showAllProjects]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollOffset(window.scrollY);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ease = [0.25, 0.46, 0.45, 0.94];

    // ヒーロー初期アニメーション
    (animate as any)(
      ".portfolio-hero .hero-chip, .portfolio-hero .hero-heading, .portfolio-hero .hero-text, .portfolio-hero .hero-cta",
      { opacity: [0, 1], y: [18, 0] },
      { delay: stagger(0.12), duration: 0.7, easing: ease }
    );

    const seenMetrics = new WeakSet<Element>();
    const seenProjects = new WeakSet<Element>();
    const seenCaps = new WeakSet<Element>();
    const seenContact = new WeakSet<Element>();

    // メトリクス / プロジェクト / ケイパビリティ / コンタークトをスクロールインで発火
    const stopMetrics = inView(".portfolio-metrics-card", (element) => {
      if (seenMetrics.has(element)) return;
      seenMetrics.add(element);
      (animate as any)(
        element,
        { opacity: [0, 1], y: [26, -6, 0], scale: [0.9, 1.05, 1] },
        { duration: 0.8, easing: ease }
      );
    });
    const stopProjects = inView(".portfolio-project-card", (element) => {
      if (seenProjects.has(element)) return;
      seenProjects.add(element);
      (animate as any)(
        element,
        { opacity: [0, 1], y: [28, -8, 0], scale: [0.9, 1.06, 1], rotateZ: [-1.2, 0.4, 0] },
        { duration: 0.85, easing: ease }
      );
    });
    const stopCaps = inView(".portfolio-cap-card", (element) => {
      if (seenCaps.has(element)) return;
      seenCaps.add(element);
      (animate as any)(
        element,
        { opacity: [0, 1], y: [24, -5, 0], scale: [0.92, 1.04, 1] },
        { duration: 0.75, easing: ease }
      );
    });
    const stopContact = inView(".portfolio-contact", (element) => {
      if (seenContact.has(element)) return;
      seenContact.add(element);
      (animate as any)(
        element,
        { opacity: [0, 1], y: [30, -6, 0], scale: [0.9, 1.05, 1] },
        { duration: 0.85, easing: ease }
      );
    });

    return () => {
      stopMetrics();
      stopProjects();
      stopCaps();
      stopContact();
    };
  }, []);

  // モーダルの入場アニメーション
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!selected) return;
    setIsClosingModal(false);
    const ease = [0.25, 0.46, 0.45, 0.94];
    (animate as any)(
      ".portfolio-modal-overlay",
      { opacity: [0, 1] },
      { duration: 0.25, easing: ease }
    );
    (animate as any)(
      ".portfolio-modal-content",
      { opacity: [0, 1], scale: [0.96, 1], y: [12, 0] },
      { duration: 0.32, delay: 0.05, easing: ease }
    );
  }, [selected]);

  const handleModalClose = () => {
    if (!selected || isClosingModal) return;
    setIsClosingModal(true);
    const ease = [0.25, 0.46, 0.45, 0.94];
    (animate as any)(
      ".portfolio-modal-content",
      { opacity: [1, 0], scale: [1, 0.96], y: [0, 12] },
      { duration: 0.24, easing: ease }
    );
    (animate as any)(
      ".portfolio-modal-overlay",
      { opacity: [1, 0] },
      { duration: 0.2, easing: ease }
    );
    setTimeout(() => {
      setSelected(null);
      setIsClosingModal(false);
    }, 240);
  };

  return (
    <div className="relative min-h-screen text-gray-900 dark:text-gray-50 overflow-hidden">
      {/* 背景グラデーションレイヤー（最背面） */}
      <div className="fixed inset-0 z-0 opacity-95" style={{
        backgroundImage: isDark
          ? "linear-gradient(180deg, rgba(10,12,20,0.9) 0%, rgba(15,23,42,0.92) 45%, rgba(17,24,39,0.98) 100%)"
          : "linear-gradient(180deg, rgba(245,249,255,0.9) 0%, rgba(241,245,249,0.9) 45%, rgba(255,255,255,0.96) 100%)"
      }} />

      {/* 背景3Dレイヤー（グラデーションより前、コンテンツより後ろ） */}
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          transform: `translateY(${-Math.min(scrollOffset * 0.22, 180)}px) scale(1.12)`,
          transformOrigin: "center",
          transition: "transform 120ms linear",
        }}
      >
        <PortfolioNetworkBackground isDark={isDark} />
      </div>

      {/* カーソル追従のノードネットワークエフェクト */}
      <PortfolioCursorNodes isDark={isDark} />

      <Header />

      <main className="relative z-20 pt-32 pb-24 px-6 lg:px-12">
        <section
          id="about"
          className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[1.4fr_1fr] items-center"
        >
          <div className="space-y-6 portfolio-hero">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full border border-gray-200/70 dark:border-white/10 bg-white/70 dark:bg-gray-800/60 backdrop-blur hero-chip">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Portfolio</span>
            </div>
            <h1 className="text-3xl sm:text-3xl lg:text-5xl font-bold leading-tight hero-heading">
              体験の質にこだわり、<br className="hidden sm:block" />
              企画から運用まで伴走します。
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed hero-text">
              ゲーム / インタラクティブコンテンツを軸に、デジタル体験の企画・デザイン・実装・運用をワンストップで提供しています。
              実装とデザインを行き来しながら、クライアント様の求める心地よいプロダクトを形にしていきます。
            </p>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed hero-text">
              ゲーム/Web制作、背景/キャラクターデザイン、Live2D、メカ/プロップモデリング、舞台照明など、
              シーンに応じて必要なスキルセットを組み合わせて対応いたします。
            </p>
            <div className="flex flex-wrap gap-3 hero-cta">
              <a
                href="/#contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/35 transition-transform duration-200 hover:-translate-y-0.5"
              >
                プロジェクトの相談をする
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-gray-800/70 hover:border-cyan-400/80 hover:text-cyan-500 transition-colors duration-200"
              >
                ホームに戻る
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl p-6 bg-white/80 dark:bg-gray-800/70 border border-gray-200/70 dark:border-white/10 shadow-xl shadow-gray-200/40 dark:shadow-black/30 portfolio-metrics-card"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">{metric.label}</p>
                <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="products" className="max-w-6xl mx-auto mt-20 space-y-6">
          <div className="flex flex-col gap-3">
            <div className="text-sm font-semibold text-cyan-500 uppercase tracking-[0.3em]">Projects</div>
            <h2 className="text-3xl font-bold">主な制作実績</h2>
            <p className="text-base text-gray-600 dark:text-gray-300 max-w-3xl">
              触り心地、没入感、運用しやすさにフォーカスしたプロジェクトを選抜しています。リンクがあるものは詳細ページやデモに遷移できます。
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSelectedTag((prev) => (prev === tag ? "all" : tag));
                  setShowAllProjects(false);
                }}
                className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors duration-200 ${selectedTag === tag
                  ? "bg-cyan-500 text-white border-cyan-500 shadow-cyan-500/30 shadow"
                  : "bg-white/70 dark:bg-gray-900/60 border-gray-200/70 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:border-cyan-400/60 hover:text-cyan-600 dark:hover:text-cyan-300"
                  }`}
              >
                {tag === "all" ? "すべて" : tag}
              </button>
            ))}
          </div>

          <div className="relative">
            <div className={`grid gap-6 md:grid-cols-2 ${!showAllProjects ? "max-h-[1080px] overflow-hidden relative" : ""}`}>
              {limitedProjects.map((project, idx) => {
                const isPreview = !showAllProjects && idx >= 4;
                return (
                  <article
                    key={project.title}
                    className={`group relative rounded-2xl p-6 border border-gray-200/70 dark:border-white/10 bg-white/80 dark:bg-gray-900/70 shadow-lg shadow-gray-200/30 dark:shadow-black/20 overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400/70 portfolio-project-card ${isPreview ? "blur-sm opacity-80 translate-y-3" : ""
                      }`}
                    onClick={() => setSelected(project)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelected(project);
                      }
                    }}
                  >
                    {isPreview && (
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-transparent" />
                    )}
                    {project.image && (
                      <div className="mb-4 relative overflow-hidden rounded-xl border border-gray-200/70 dark:border-white/10">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/[0.02] to-fuchsia-500/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20">
                        {project.tag}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{project.period}</span>
                    </div>
                    <h3 className="mt-4 text-2xl font-bold">{project.title}</h3>
                    <p className="mt-3 text-gray-700 dark:text-gray-200 leading-relaxed">{project.summary}</p>
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      <span className="font-semibold">担当:</span> {project.contribution}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.tech.map((stack) => (
                        <span
                          key={stack}
                          className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200"
                        >
                          {stack}
                        </span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>

            {!showAllProjects && filteredProjects.length > limitedProjects.length && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
            )}

            {!showAllProjects && filteredProjects.length > limitedProjects.length && (
              <div className="flex justify-center mt-4 relative">
                <button
                  type="button"
                  onClick={() => setShowAllProjects(true)}
                  className="px-5 py-2.5 rounded-full font-semibold border border-cyan-500/60 text-cyan-600 dark:text-cyan-300 bg-white/90 dark:bg-gray-900/90 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-colors duration-200 shadow"
                >
                  すべて表示
                </button>
              </div>
            )}
          </div>
        </section>

        <section id="members" className="max-w-6xl mx-auto mt-20">
          <div className="flex flex-col gap-3">
            <div className="text-sm font-semibold text-cyan-500 uppercase tracking-[0.3em]">Capabilities</div>
            <h2 className="text-3xl font-bold">得意な領域</h2>
            <p className="text-base text-gray-600 dark:text-gray-300 max-w-3xl">
              企画フェーズでのプロトタイピングから、実装と運用まで、幅広くカバーします。必要に応じてパートナーとも連携します。
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {capabilities.map((capability) => (
              <div
                key={capability.title}
                className="rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/80 dark:bg-gray-900/70 p-6 shadow-lg shadow-gray-200/30 dark:shadow-black/20 portfolio-cap-card"
              >
                <h3 className="text-xl font-semibold">{capability.title}</h3>
                <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-200">
                  {capability.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="max-w-6xl mx-auto mt-24">
          <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 dark:from-cyan-500/15 dark:via-blue-600/15 dark:to-fuchsia-500/15 p-10 md:p-14 shadow-xl shadow-cyan-500/20 dark:shadow-cyan-900/40 portfolio-contact">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
              <div className="flex-1 space-y-3">
                <p className="text-sm font-semibold text-cyan-500 uppercase tracking-[0.3em]">Contact</p>
                <h2 className="text-3xl font-bold">一緒に新しい体験を作りませんか？</h2>
                <p className="text-base text-gray-700 dark:text-gray-200 max-w-3xl">
                  企画段階の相談、既存プロダクトの改善、展示イベント向けの短期開発など、お気軽にご連絡ください。
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/#contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/35 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  お問い合わせフォームへ
                </a>
                <a
                  href="mailto:contact@seraf0.com"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold border border-white/60 text-gray-900 dark:text-white bg-white/80 dark:bg-gray-900/70 hover:border-cyan-400/80 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors duration-200"
                >
                  メールで連絡
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {selected && (
        <div className="portfolio-modal-overlay fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={handleModalClose}>
          <div
            className="portfolio-modal-content relative w-full max-w-4xl max-h-[90vh] overflow-auto rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl opacity-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="閉じる"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {selected.image && (
              <div className="w-full h-64 md:h-80 overflow-hidden rounded-t-2xl">
                <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20">
                  {selected.tag}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{selected.period}</span>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{selected.title}</h3>
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-200 leading-relaxed">{selected.summary}</p>

              <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <span className="font-semibold">担当:</span> {selected.contribution}
              </div>

              {selected.tech && (
                <div className="flex flex-wrap gap-2">
                  {selected.tech.map((stack) => (
                    <span
                      key={stack}
                      className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200"
                    >
                      {stack}
                    </span>
                  ))}
                </div>
              )}

              {selected.link && (
                <div>
                  <a
                    href={selected.link}
                    target={selected.link.startsWith("http") ? "_blank" : undefined}
                    rel={selected.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-300 font-semibold hover:gap-3 transition-all duration-150"
                  >
                    リンクを開く
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


