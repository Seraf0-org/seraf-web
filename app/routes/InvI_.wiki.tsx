import type { MetaFunction } from "@remix-run/node";
import { useEffect } from "react";
import Lenis from "lenis";
import { ArchiveBackground } from "~/components/invi/ArchiveBackground";

export const meta: MetaFunction = () => {
  return [
    { title: "InvI Archive | Seraf()" },
    {
      name: "description",
      content:
        "杉沢村、不可分領域、ナルカミに関する組織保管資料。InvIの世界観を記録する書庫ページ。",
    },
    { property: "og:title", content: "InvI Archive | Seraf()" },
    {
      property: "og:description",
      content:
        "外部組織の補足記録として、杉沢村と不可分領域の情報を閲覧できるアーカイブ。",
    },
    { property: "og:type", content: "website" },
  ];
};

const RECORDS = [
  {
    code: "FILE-001",
    label: "Location",
    title: "杉沢村",
    body:
      "日本の山間部に存在したとされる隠れ里。行政記録から抹消され、外界との接触を制限した独自の共同体として存続していた。",
  },
  {
    code: "FILE-002",
    label: "Anomaly",
    title: "インヴィ / 不可分領域",
    body:
      "禁足地の遺跡周辺に固定された空間異常。第6ナルカミの能力により奥行きの概念が断たれ、横視点のような平面構造を呈する。",
  },
  {
    code: "FILE-003",
    label: "Seal",
    title: "十の楔",
    body:
      "村に伝わる十個の宝玉を転用した封印機構。不可分領域を遺跡内に押し留めるための観測上の基準点でもある。",
  },
  {
    code: "FILE-004",
    label: "Threat",
    title: "ピクシィズ",
    body:
      "不可分領域内で確認される虚数由来の生命体。二次元的な環境に適応し、侵入者に対して敵対的な行動を取る。",
  },
];

const HOUSES = [
  {
    name: "織家 / アガタ",
    role: "本家",
    desc: "杉沢村の統治と祭祀を担う家系。水、霧、糸にまつわる象徴を持ち、神核の管理にも深く関与する。",
  },
  {
    name: "日野家",
    role: "武門",
    desc: "村の防衛と実力行使を担う分家。外敵や禁足地に関する実働部隊として扱われる。",
  },
  {
    name: "加賀美家",
    role: "実務",
    desc: "村内の管理、調整、記録を担当する分家。御三家の均衡を維持するための事務的な役割を負う。",
  },
  {
    name: "七種家",
    role: "外様",
    desc: "禁足地を見張る役目を与えられた家系。第6ナルカミとの血縁により、村の秩序からは異物として扱われる。",
  },
];

const TIMELINE = [
  {
    year: "1911",
    title: "杉沢村の成立",
    body: "ウツシミたちが山奥へ逃れ、隠匿結界のもとで村を形成する。",
  },
  {
    year: "約36年前",
    title: "不可分領域の発生",
    body: "神核を巡る実験の破綻により、禁足地の遺跡がインヴィへ変質する。",
  },
  {
    year: "封印後",
    title: "十の楔による固定",
    body: "外部組織は残された宝玉を封印機構として再構成し、異常の拡大を抑止する。",
  },
  {
    year: "2020",
    title: "封印破断",
    body: "楔の汚染により不可分領域が再活性化。七種翠は母から刀を受け取り、遺跡へ向かう。",
  },
];

const PERSONS = [
  {
    name: "七種 翠",
    alias: "スイ",
    desc: "視点そのものを切り替える能力「転加」を持つ少女。不可分領域の構造に対して特異な適性を示す。",
  },
  {
    name: "織 藍",
    alias: "ラン",
    desc: "本家アガタに属する少女。血を媒介に刀剣を顕現させる能力を持ち、スイと対になる存在として記録される。",
  },
  {
    name: "織 直樹",
    alias: "前当主",
    desc: "不可分領域発生の遠因となった人物。現在も村の意思決定に影響を残していると推定される。",
  },
  {
    name: "七種 聡",
    alias: "第6ナルカミ",
    desc: "能力「不可分」により空間の奥行きを断った存在。現在のインヴィ事案における中心記録。",
  },
];

const TERMS = [
  ["ウツシミ", "生まれながらに特殊な能力を持つ人間の総称。"],
  ["ナルカミ", "能力の深層へ到達し、人の領域を越えた存在。"],
  ["神核", "ナルカミの魂が物質化した高密度の結晶。"],
  ["転加", "空間の向きを変え、トップダウンと横スクロールの視点を切り替えるスイの力。"],
  ["万織", "血を媒介に、織家の集合意識から刀剣を編み出すランの力。"],
  ["冠位禽獣", "ピクシィズの上位個体。災害級の敵性存在として分類される。"],
];

export default function InViWikiPage() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.7,
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#091016] text-slate-200 selection:bg-cyan-200 selection:text-slate-950">
      <ArchiveBackground />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_16%_12%,rgba(14,165,233,0.18),transparent_26%),radial-gradient(circle_at_88%_10%,rgba(244,114,182,0.1),transparent_24%),linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.7))]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-px bg-cyan-200/50" />

      <header className="relative z-10 border-b border-cyan-100/10 bg-slate-950/78 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="/InvI" className="text-[11px] font-bold uppercase tracking-[0.42em] text-cyan-100">
            Sugisawa Archive
          </a>
          <nav className="flex items-center gap-5 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">
            <a href="#records" className="transition-colors hover:text-cyan-100">Records</a>
            <a href="#timeline" className="transition-colors hover:text-cyan-100">Timeline</a>
            <a href="#terms" className="transition-colors hover:text-cyan-100">Glossary</a>
          </nav>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[17rem_1fr] lg:py-20">
        <aside className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
          <div className="border border-cyan-100/15 bg-slate-950/72 p-5 font-mono shadow-[0_0_40px_rgba(14,165,233,0.08)] backdrop-blur-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-cyan-300">Classified Index</p>
            <h1 className="mt-6 font-serif text-3xl leading-tight tracking-normal text-slate-50">
              不可分領域
              <span className="block text-cyan-200/45">資料庫</span>
            </h1>
            <p className="mt-6 text-xs leading-loose tracking-wide text-slate-400">
              外部組織が杉沢村事案を補足するために再編した閲覧用アーカイブ。ゲーム本編外の視点から、地名、家系、異常現象を記録する。
            </p>
            <div className="mt-8 space-y-2 border-t border-cyan-100/15 pt-5 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
              <p><span className="text-cyan-300">Access</span>: Provisional</p>
              <p><span className="text-cyan-300">Sector</span>: Sugisawa</p>
              <p><span className="text-cyan-300">Status</span>: Observation</p>
            </div>
          </div>
        </aside>

        <div className="space-y-14">
          <section className="relative overflow-hidden border border-cyan-100/15 bg-slate-950/78 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-10">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-300/70 via-transparent to-pink-300/40" />
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-300">Observation Note / External Casefile</p>
            <h2 className="mt-5 font-serif text-4xl leading-tight tracking-normal text-slate-50 sm:text-6xl">
              組織保管資料
              <span className="block text-cyan-100/35">杉沢村事案</span>
            </h2>
            <p className="mt-8 max-w-2xl text-sm leading-loose tracking-wide text-slate-400">
              『InvI』は杉沢村で発生した不可分領域事案を描く外伝です。本ページでは、組織が保管する調査記録という体裁で、村の歴史、御三家、ナルカミ、禁足地の異常を整理します。
            </p>
          </section>

          <section id="records" className="space-y-5">
            <ArchiveHeading number="01" title="Primary Records" caption="杉沢村事案 / 主要記録" />
            <div className="grid gap-px overflow-hidden border border-cyan-100/15 bg-cyan-100/15 md:grid-cols-2">
              {RECORDS.map((record) => (
                <article key={record.code} className="bg-slate-950/82 p-6 backdrop-blur-xl">
                  <div className="flex items-center justify-between gap-4 border-b border-cyan-100/10 pb-4 font-mono">
                    <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">{record.code}</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-300">{record.label}</span>
                  </div>
                  <h3 className="mt-5 font-serif text-2xl text-slate-50">{record.title}</h3>
                  <p className="mt-4 text-sm leading-loose tracking-wide text-slate-400">{record.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="houses" className="space-y-5">
            <ArchiveHeading number="02" title="Village Houses" caption="杉沢村御三家 / 外様" />
            <div className="grid gap-px overflow-hidden border border-cyan-100/15 bg-cyan-100/15 md:grid-cols-2">
              {HOUSES.map((house) => (
                <article key={house.name} className="bg-slate-900/88 p-6">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-pink-300">{house.role}</p>
                  <h3 className="mt-3 font-serif text-2xl text-slate-50">{house.name}</h3>
                  <p className="mt-4 text-sm leading-loose tracking-wide text-slate-400">{house.desc}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="timeline" className="space-y-5">
            <ArchiveHeading number="03" title="Chronology" caption="不可分領域関連年表" />
            <div className="border border-cyan-100/15 bg-slate-950/82 p-6 sm:p-8">
              {TIMELINE.map((item, index) => (
                <article key={`${item.year}-${item.title}`} className="grid gap-4 border-b border-cyan-100/10 py-6 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[8rem_1fr]">
                  <div className="font-mono text-xl text-cyan-300/70">{item.year}</div>
                  <div>
                    <h3 className="text-base font-bold tracking-[0.18em] text-slate-50">{item.title}</h3>
                    <p className="mt-3 text-sm leading-loose tracking-wide text-slate-400">{item.body}</p>
                    <span className="mt-4 inline-block font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
                      Record {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="persons" className="space-y-5">
            <ArchiveHeading number="04" title="Persons" caption="主要人物 / 観測対象" />
            <div className="grid gap-4 md:grid-cols-2">
              {PERSONS.map((person) => (
                <article key={person.name} className="relative overflow-hidden border border-cyan-100/15 bg-[#111827] p-6 text-white">
                  <div className="absolute -right-12 -top-12 h-32 w-32 border border-cyan-100/10" />
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-cyan-200">{person.alias}</p>
                  <h3 className="mt-4 font-serif text-2xl">{person.name}</h3>
                  <p className="mt-4 text-sm leading-loose tracking-wide text-slate-400">{person.desc}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="terms" className="space-y-5 pb-20">
            <ArchiveHeading number="05" title="Glossary" caption="用語索引" />
            <div className="grid gap-px overflow-hidden border border-cyan-100/15 bg-cyan-100/15">
              {TERMS.map(([term, desc]) => (
                <article key={term} className="grid gap-3 bg-slate-950/82 p-5 sm:grid-cols-[10rem_1fr]">
                  <h3 className="font-serif text-xl text-slate-50">{term}</h3>
                  <p className="text-sm leading-loose tracking-wide text-slate-400">{desc}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function ArchiveHeading({ number, title, caption }: { number: string; title: string; caption: string }) {
  return (
    <div className="flex items-end justify-between gap-6 border-b border-cyan-100/15 pb-4">
      <div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-cyan-300/70">{number} / Archive</p>
        <h2 className="mt-2 font-serif text-3xl text-slate-50">{title}</h2>
      </div>
      <p className="hidden font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 sm:block">{caption}</p>
    </div>
  );
}
