import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";
import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "~/root";
import { useLines } from "~/contexts/LinesContext";
import { newsItems } from "~/data/news";
import { useEffect, useState } from "react";

export function News() {
  const [sectionRef, isVisible] = useIntersectionObserver();
  const { theme } = useOutletContext<OutletContext>();
  const isDark = theme === 'dark';
  const lines = useLines('cyan');
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY * 0.12;
      setParallaxOffset(offset);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

      <div className="absolute inset-0 bg-grid-pattern opacity-20" style={{ backgroundColor: isDark ? 'transparent' : 'rgb(0, 0, 0)' }}></div>
      <div className="absolute left-0 top-0 -translate-y-1/2 z-0" style={{ transform: `translateY(${parallaxOffset - 210}px)` }}>
        <img
          src="/images/news/news-bg.png"
          alt="News Background"
          className="w-6/7 h-auto"
          style={{ transform: 'scaleX(-1)' }}
        />
      </div>
      <div className={`container mx-auto relative z-10 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
        <div className="ml-auto max-w-3xl pr-2">
          <h1 className={`text-4xl md:text-7xl font-bold text-right mb-16 relative drop-shadow-[0_0_8px_rgba(0,192,192,0.5)] dark:drop-shadow-[0_0_8px_rgba(0,255,255,0.5)] ${isDark ? 'text-white' : 'text-gray-700'}`}>
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
          <div className="overflow-hidden h-[65vh]">
            <div className="flex flex-col space-y-6 animate-vertical-scroll" style={{ animationDelay: '1s' }}>
              {[...newsItems, ...newsItems].map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className={`bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden flex 
                      shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]
                      hover:shadow-[0_0_25px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]
                      transition-all duration-300 ${isVisible ? 'animate-clip-from-right' : ''}`}
                  style={{
                    animationDelay: `${index * 200}ms`,
                    clipPath: isVisible ? undefined : 'polygon(100% 0, 100% 0, 100% 100%, 0 100%)'
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
                      <p className="text-base md:text-lg text-gray-400 dark:text-gray-500">
                        {item.date}
                      </p>
                      <h3 className="text-xl md:text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-12">
            <a
              href="/news"
              className="inline-block bg-cyan-500 text-white font-semibold py-3 px-6 text-lg md:text-xl rounded-lg shadow-2xl hover:shadow-3xl transition-colors duration-300 hover:bg-cyan-600"
              style={{
                boxShadow: '0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3)',
              }}
            >
              View All News
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 