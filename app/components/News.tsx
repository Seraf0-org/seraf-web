import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";
import { useLines } from "~/contexts/LinesContext";
import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "~/root";

export function News() {
  const [sectionRef, isVisible] = useIntersectionObserver();
  const { theme } = useOutletContext<OutletContext>();
  const isDark = theme === 'dark';
  const lines = useLines('cyan');
  const newsItems = [
    {
      id: 1,
      date: "2024.08.21",
      title: "Reflectone配信！",
      description: "UnityRoomにて、Reflectoneの配信を開始しました。",
      image: "/images/news/news1.jpg"
    },
    {
      id: 2,
      date: "2024.11.23",
      title: "デジハリ学園祭2024にて展示！",
      description: "デジタルハリウッド大学の学園祭にて、ゲームの展示を行いました。",
      image: "/images/news/news2.jpg"
    },
    {
      id: 3,
      date: "2024.11.24",
      title: "Seraf()設立！",
      description: "本チームが立ち上げられ、活動を開始しました。",
      image: "/images/news/news3.jpg"
    }
  ];

  return (
    <section
      id="news"
      ref={sectionRef}
      className="relative min-h-screen py-20 transition-colors duration-500 overflow-hidden"
      style={{
        backgroundColor: isDark ? 'rgb(17 24 39)' : 'rgb(249 250 251)'
      }}
    >
      {lines.map((line, index) => (
        <svg
          key={line.id}
          className="absolute will-change-transform pointer-events-none"
          style={{
            left: `${line.left}%`,
            top: 0,
            width: '200px',
            height: '100%',
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

      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-0">
        <img
          src="/images/news/mertis.png"
          alt="News Background"
          className="w-auto h-auto opacity-80"
        />
      </div>
      <div className={`container mx-auto px-4 relative z-10 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
        <div className="ml-auto max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-right text-gray-900 dark:text-white mb-16 relative drop-shadow-[0_0_8px_rgba(0,192,192,0.5)] dark:drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">
            News
            <div className="absolute fixed-right">
              <svg width="100vw" height="45" viewBox="0 0 1000 10" preserveAspectRatio="none" style={{ marginLeft: 'calc(-50vw' }}>
                <path
                  d="M470 10 L910 10 940 0 L1000 0"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className={`text-cyan-400 dark:text-cyan-100 ${isVisible ? 'animate-draw-line-from-right' : ''}`}
                  strokeDasharray="1000"
                />
              </svg>
            </div>
          </h1>
          <div className="flex flex-col space-y-6">
            {[...newsItems].reverse().map((item, index) => (
              <div
                key={item.id}
                className={`bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden flex 
                    shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]
                    hover:shadow-[0_0_25px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]
                    transition-all duration-300 ${isVisible ? 'animate-clip-from-right' : ''}`}
                style={{
                  animationDelay: `${index * 200}ms`,
                  clipPath: isVisible ? undefined : 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)'
                }}
              >
                <div className="w-1/3 relative">
                  <div className="relative pt-[75%]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>
                <div className="w-2/3 p-6 relative">
                  <div className="absolute bottom-0 right-0 w-full h-full bg-white dark:bg-gray-900"
                    style={{
                      clipPath: 'polygon(100% 50%, 100% 100%, 87% 100%)'
                    }}
                  />
                  <div className="relative z-10">
                    <p className="text-gray-400 dark:text-gray-500">
                      {item.date}
                    </p>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 