import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";
import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "~/root";
import { useLines } from "~/contexts/LinesContext";
import { newsItems } from "~/data/news";
import { useEffect, useState, useRef } from "react";
import { animate, stagger } from "motion";

export function News() {
  const [sectionRef, isVisible] = useIntersectionObserver();
  const { theme } = useOutletContext<OutletContext>();
  const isDark = theme === 'dark';
  const lines = useLines('cyan');
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY * 0.08;
      setParallaxOffset(offset);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (videoRef.current && !isIOS && isVisible) {
      videoRef.current.play();
    }
  }, [isVisible, isIOS]);

  // Motionアニメーションを初期化
  useEffect(() => {
    if (isVisible) {
      // タイトルのアニメーション
      (animate as any)(
        ".news-title",
        { opacity: [0, 1], y: [30, 0] },
        { duration: 1, easing: [0.25, 0.46, 0.45, 0.94] }
      );

      // ニュースアイテムの表示アニメーション
      (animate as any)(
        ".news-item",
        { opacity: [0, 1], y: [50, 0], scale: [0.9, 1] },
        { 
            delay: stagger(0.15),
            duration: 0.8,
            easing: [0.25, 0.46, 0.45, 0.94]
        }
      );

      // ニュースアイテム内のテキストアニメーション
      (animate as any)(
        ".news-text",
        { opacity: [0, 1], y: [20, 0] },
        { 
            delay: stagger(0.1, { startDelay: 0.8 }),
            duration: 0.6,
            easing: [0.25, 0.46, 0.45, 0.94]
        }
      );

      // 装飾線のアニメーション
      (animate as any)(
        ".news-decorative-line",
        { strokeDashoffset: [1000, 0] },
        { duration: 1.2, delay: 0.8, easing: [0.25, 0.46, 0.45, 0.94] }
      );
    }
  }, [isVisible]);

  // ホバーアニメーションの設定
  useEffect(() => {
    const newsItems = document.querySelectorAll('.news-item');
    
    newsItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        (animate as any)(
          item,
          { 
            y: [0, -8],
            scale: [1, 1.02],
            boxShadow: ['0 10px 25px rgba(0,0,0,0.1)', '0 20px 40px rgba(0,0,0,0.2)']
          },
          { duration: 0.3, easing: [0.25, 0.46, 0.45, 0.94] }
        );
      });

      item.addEventListener('mouseleave', () => {
        (animate as any)(
          item,
          { 
            y: [-8, 0],
            scale: [1.02, 1],
            boxShadow: ['0 20px 40px rgba(0,0,0,0.2)', '0 10px 25px rgba(0,0,0,0.1)']
          },
          { duration: 0.3, easing: [0.25, 0.46, 0.45, 0.94] }
        );
      });
    });
  }, [isVisible]);

  return (
    <section
      id="news"
      ref={sectionRef}
      className="relative min-h-screen py-20 transition-colors duration-500 overflow-hidden"
      style={{
        backgroundColor: isDark ? 'rgb(17 24 39)' : 'rgb(249 250 251)'
      }}
    >
      {/* 横書きの「News」 */}
      <div
        className="absolute top-[90%] transform pointer-events-none z-20"
        style={{ transform: `translateY(calc(-90% + ${parallaxOffset}px))`, right: '-20px' }}
      >
        <svg width="900" height="200" viewBox="0 0 900 200" preserveAspectRatio="xMidYMid meet">
          <text
            x="450"
            y="100"
            fill="none"
            stroke={isDark ? '#ffffff' : '#000000'}
            strokeWidth="1"
            strokeOpacity="0.4"
            fontSize="100"
            fontWeight="bold"
            textAnchor="middle"
            style={{ letterSpacing: '0.3em' }}
          >
            {Array.from("News").map((letter, index) => (
              <tspan
                key={index}
                className="animate-draw-path"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                }}
              >
                {letter}
              </tspan>
            ))}
          </text>
          {/* 上部のライン */}
          <line
            x1="0"
            y1="0"
            x2="100"
            y2="0"
            stroke={isDark ? 'rgb(210, 255, 255)' : 'rgb(0, 192, 192)'}
            strokeWidth="0.2"
          />
          {/* 下部のライン */}
          <line
            x1="0"
            y1="100"
            x2="100"
            y2="100"
            stroke={isDark ? 'rgb(210, 255, 255)' : 'rgb(0, 192, 192)'}
            strokeWidth="0.2"
          />
        </svg>
      </div>

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

      <div
        className="absolute inset-0 bg-grid-pattern"
        style={{
          opacity: 0.3,
          backgroundImage: isDark
            ? 'linear-gradient(to right, rgba(255, 255, 255, 0.8) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.8) 1px, transparent 1px)'
            : 'linear-gradient(to right, rgba(0, 0, 0, 0.8) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 1px, transparent 1px)',
        }}
      ></div>
      <div className="absolute left-0 top-0 -translate-y-1/2 z-0 w-full h-full md:w-full md:h-auto" style={{ transform: `translateY(${parallaxOffset - 170}px)` }}>
        {isIOS ? (
          <img
            src="/images/news/news-bg.png"
            alt="News Background"
            className="w-auto h-full md:h-full md:w-6/7"
            style={{ transform: 'scaleX(-1)', maxWidth: 'none' }}
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            disablePictureInPicture
            controlsList="nodownload nofullscreen"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            className="w-auto h-[90vh] md:w-6/7 md:h-auto pointer-events-none"
            style={{ transform: 'scaleX(-1)', maxWidth: 'none', userSelect: 'none' }}
          >
            <source src="/videos/news-bg.webm" type="video/webm" />
          </video>
        )}
      </div>
      <div className="container mx-auto relative z-10">
        <div className="ml-auto max-w-3xl pr-6 md:pr-2">
          <h1 className="news-title text-4xl md:text-7xl font-bold text-right mb-16 relative drop-shadow-[0_0_8px_rgba(0,192,192,0.5)] dark:drop-shadow-[0_0_8px_rgba(0,255,255,0.5)] opacity-0">
            News
            <div className="absolute fixed-right">
              <svg width="100vw" height="45" viewBox="0 0 1000 10" preserveAspectRatio="none" style={{ marginLeft: 'calc(-50vw' }}>
                <path
                  d="M470 10 L910 10 940 0 L1000 0"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="news-decorative-line text-cyan-400 dark:text-cyan-100"
                  strokeDasharray="1000"
                  strokeDashoffset="1000"
                  style={{
                    transformOrigin: 'left'
                  }}
                />
              </svg>
            </div>
          </h1>
          <div className="overflow-hidden h-[65vh] px-4 md:px-0">
            <div className="flex flex-col space-y-6 animate-vertical-scroll" style={{ animationDelay: '1s' }}>
              {[...newsItems, ...newsItems].map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="news-item bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden flex 
                      shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]
                      hover:shadow-[0_0_25px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]
                      transition-all duration-300 opacity-0"
                  style={{
                    height: '20vh'
                  }}
                >
                  <div className="w-1/3 relative">
                    <div className="relative h-full">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="w-2/3 p-4 md:p-6 relative">
                    <div className="absolute bottom-0 right-0 w-full h-full bg-white dark:bg-gray-900"
                      style={{
                        clipPath: 'polygon(100% 50%, 100% 100%, 87% 100%)'
                      }}
                    />
                    <div className="relative z-10">
                      <p className="news-text text-sm md:text-lg text-gray-400 dark:text-gray-500 opacity-0">
                        {item.date}
                      </p>
                      <h3 className="news-text text-lg md:text-2xl font-semibold mb-2 text-gray-900 dark:text-white opacity-0" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title}
                      </h3>
                      <p className="news-text text-sm md:text-lg text-gray-600 dark:text-gray-300 opacity-0">
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
              className="inline-block bg-cyan-500 text-white font-semibold py-3 px-6 text-lg md:text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-colors duration-300 hover:bg-cyan-600"
              style={{
                boxShadow: '0 0 10px rgba(0, 255, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3)',
              }}
            >
              View All News
            </a>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 z-5 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          <polygon
            points="50,0 100,0 100,100 75,100"
            fill={isDark ? 'rgb(17 24 39)' : 'rgb(249 250 251)'}
            style={{
              filter: 'drop-shadow(0 0 3px rgba(64, 200, 200, 0.7))',
            }}
          />
          <line
            x1="50"
            y1="0"
            x2="75"
            y2="100"
            stroke={isDark ? 'rgb(210, 255, 255)' : 'rgb(0, 192, 192)'}
            strokeWidth="0.2"
          />
        </svg>
      </div>
    </section>
  );
} 