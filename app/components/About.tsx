import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";
import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "~/root";
import { useLines } from "~/contexts/LinesContext";

export function About() {
  const [sectionRef, isVisible] = useIntersectionObserver();
  const { theme } = useOutletContext<OutletContext>();
  const lines = useLines('fuchsia');
  const isDark = theme === 'dark';

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-20 transition-colors duration-500 overflow-hidden"
      style={{
        backgroundColor: isDark ? 'rgb(17 24 39)' : 'rgb(249 250 251)'
      }}
    >
      {/* 背景の線 */}
      {lines.map((line, index) => (
        <svg
          key={line.id}
          className="absolute will-change-transform pointer-events-none"
          style={{
            left: `${line.left}%`,
            top: '-20vh',
            width: '200px',
            height: '140vh',
            overflow: 'visible',
          }}
        >
          <path
            d={`M ${line.points.map(p => `${p.x},${p.y}`).join(' L ')}`}
            stroke={line.color}
            strokeWidth={line.width}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {line.branches.map((branch, i) => (
            <path
              key={`${line.id}-${i}`}
              d={`M ${branch.points.map(p => `${p.x},${p.y}`).join(' L ')}`}
              stroke={branch.color}
              strokeWidth={branch.width}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>
      ))}

      <div className="container mx-auto relative flex flex-col md:flex-row">
        <div className={`container mx-auto px-4 py-10 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <div className="max-w-4xl relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-16 drop-shadow-[0_0_8px_rgba(255,0,255,0.5)] dark:drop-shadow-[0_0_8px_rgba(255,0,255,0.7)] md:leading-loose">
              About
              <div className="absolute fixed-left">
                <svg width="100vw" height="40" viewBox="0 0 1000 10" preserveAspectRatio="none" style={{ marginLeft: 'calc(-50vw + 75%)' }}>
                  <path
                    d="M0 0 L100 0 120 10 L500 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className={`text-fuchsia-400 dark:text-fuchsia-500 ${isVisible ? 'animate-draw-line-from-left' : ''}`}
                    strokeDasharray="600"
                  />
                </svg>
              </div>
            </h1>
            <p
              className={`text-base md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-loose md:leading-loose transition-all duration-1000 transform 
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: '0.2s' }}
            >
              <span className="text-lg md:text-3xl font-semibold">Seraf()</span>
              はDHU発のゲーム制作を中心としたクリエイタースタジオ。<br className="mb-4" />
              ゲームデザイナー兼シナリオライターであるKTNを主軸に、複数のスキルと高いモチベーションを持ったクリエイターと協力して様々なゲームを作っていく。<br className="mb-4" />
              学生の若さ故の強い自我が大衆に均される前に、確立されたエゴを以て学び合い高めあえるチームへ。<br className="mb-4" />
              誠実に。されど貪欲に。<br className="mb-4" />
              最新鋭の技術や各々の得意や好きを余すことなく活かし、個性をぶつかり合わせて生まれるオリジナリティ溢れる作品の数々をお楽しみあれ。
            </p>
          </div>
        </div>
        <div className="right-8 top-1/2 z-0 transform -translate-y-1/2 absolute">
          <img
            src="/images/namelogo-dark.png"
            alt="Seraf Logo"
            className={`w-auto h-[50vh] opacity-80 transition-all duration-1000 ${isVisible ? 'translate-x-0' : 'translate-x-20'
              } dark:hidden object-contain`}
          />
          <img
            src="/images/namelogo-light.png"
            alt="Seraf Logo"
            className={`w-auto h-[50vh] opacity-80 transition-all duration-1000 ${isVisible ? 'translate-x-0' : 'translate-x-20'
              } hidden dark:block object-contain`}
          />
        </div>
      </div>
    </section>
  );
}
