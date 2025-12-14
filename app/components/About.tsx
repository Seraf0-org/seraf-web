import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";
import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "~/root";
import { useLines } from "~/contexts/LinesContext";
import { useState, useRef, useEffect } from "react";
import { animate, stagger } from "motion";

// 型定義を追加
interface Point {
  x: number;
  y: number;
}

interface Branch {
  points: Point[];
  color: string;
  width: number;
}

interface Line {
  id: string;
  left: number;
  points: Point[];
  color: string;
  width: number;
  branches: Branch[];
}

export function About() {
  const [sectionRef, isVisible] = useIntersectionObserver();
  const { theme } = useOutletContext<OutletContext>();
  const lines = useLines('fuchsia');
  const isDark = theme === 'dark';
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [isIOS, setIsIOS] = useState(false);

  // SSRでnavigatorが無い環境を避けるためクライアント判定を遅延
  useEffect(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") return;
    // @ts-ignore - MSStreamはIE判定用
    const detected = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(detected);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY * 0.05;
      setParallaxOffset(offset);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      const videoElement = videoRef.current;
      const sources = videoElement.getElementsByTagName('source');
      const darkVideoSrc = "/images/logo-anim-dark";
      const lightVideoSrc = "/images/logo-anim-light";

      sources[0].src = isDark ? `${darkVideoSrc}.mov` : `${lightVideoSrc}.mov`;
      sources[1].src = isDark ? `${darkVideoSrc}.webm` : `${lightVideoSrc}.webm`;

      videoElement.load(); // ソースを変更した後に動画を再読み込み
    }

    if (videoRef.current && !isIOS && isVisible) {
      videoRef.current.play();
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isDark, isIOS, isVisible]);

  // Motionアニメーションを初期化
  useEffect(() => {
    if (isVisible) {
      // タイトルのアニメーション
      (animate as any)(
        ".about-title",
        { opacity: [0, 1], y: [30, 0] },
        { duration: 1, easing: [0.25, 0.46, 0.45, 0.94] }
      );

      // コンテンツのフェードインアニメーション
      (animate as any)(
        ".about-content",
        { opacity: [0, 1], y: [40, 0] },
        { duration: 1.2, delay: 0.5, easing: [0.25, 0.46, 0.45, 0.94] }
      );

      // 動画のアニメーション
      (animate as any)(
        ".about-video",
        { opacity: [0, 1], scale: [0.9, 1] },
        { duration: 1, easing: [0.25, 0.46, 0.45, 0.94] }
      );

      // 装飾線のアニメーション
      (animate as any)(
        ".decorative-line",
        { strokeDashoffset: [600, 0] },
        { duration: 1.5, delay: 0.5, easing: [0.25, 0.46, 0.45, 0.94] }
      );
    }
  }, [isVisible]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen py-20 transition-colors duration-500 overflow-hidden"
      style={{
        backgroundColor: isDark ? 'rgb(17 24 39)' : 'rgb(249 250 251)'
      }}
    >
      {/* 横書きの「About」 */}
      <div
        className="absolute left-14 top-[90%] transform pointer-events-none"
        style={{ transform: `translateY(calc(-55% + ${parallaxOffset}px))` }}
      >
        <svg width="100%" height="200" viewBox="0 0 900 200" preserveAspectRatio="xMidYMid meet">
          <text
            x="50%"
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
            {Array.from("About").map((letter, index) => (
              <tspan
                key={index}
                className="animate-draw-path"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  textShadow: '0 0 10px rgba(255, 0, 255, 0.8)',
                }}
              >
                {letter}
              </tspan>
            ))}
          </text>
        </svg>
      </div>

      {/* 背景の線 */}
      {lines.map((line: Line) => (
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
            d={`M ${line.points.map((p: Point) => `${p.x},${p.y}`).join(' L ')}`}
            stroke={line.color}
            strokeWidth={line.width}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {line.branches.map((branch: Branch, i: number) => (
            <path
              key={`${line.id}-${i}`}
              d={`M ${branch.points.map((p: Point) => `${p.x},${p.y}`).join(' L ')}`}
              stroke={branch.color}
              strokeWidth={branch.width}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>
      ))}

      <div className="about-content container mx-auto px-6 md:px-4 py-10 flex flex-col md:flex-row items-center">
        <div className="max-w-4xl text-left md:mr-8">
          <h1 className="about-title text-4xl md:text-6xl font-bold text-gray-700 dark:text-white mb-16 drop-shadow-[0_0_8px_rgba(255,0,255,0.5)] dark:drop-shadow-[0_0_8px_rgba(255,0,255,0.7)] md:leading-loose">
            About
            <div className="absolute fixed-left">
              <svg width="100vw" height="40" viewBox="0 0 1000 10" preserveAspectRatio="none" style={{ marginLeft: 'calc(-50vw + 75%)' }}>
                <path
                  d="M0 0 L100 0 L120 10 L500 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="decorative-line text-fuchsia-400 dark:text-fuchsia-500 origin-left"
                  strokeDasharray="600"
                  strokeDashoffset="600"
                />
              </svg>
            </div>
          </h1>
          <p
            className="text-base md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-loose md:leading-loose"
          >
            <span className="text-lg md:text-3xl font-semibold">Seraf()</span>
            は、ゲーム制作を中心としたクリエイタースタジオです。<br className="mb-4" />
            リーダーのKTNを主軸に、複数のスキルと高いモチベーションを持ったクリエイターと共に様々なゲームを作っていきます。<br className="mb-4" />
            学生の若さ故に持つ強い自我が大衆に均される前に、確立されたエゴを以て学び合い高めあう。<br className="mb-4" />
            誠実に。されど貪欲に。<br className="mb-4" />
            最新鋭の技術や、各々の得意や好きを余すことなく活かし、個性をぶつかり合わせて生まれるオリジナリティ溢れる作品をお楽しみあれ。
          </p>
        </div>
        <div className="about-video mt-10">
          {isIOS ? (
            <img
              src={isDark ? "/images/namelogo-light.png" : "/images/namelogo-dark.png"}
              alt="Seraf Logo"
              className="w-auto h-[40vh] md:h-[60vh] opacity-80 object-contain"
            />
          ) : (
            <video
              ref={videoRef}
              muted
              playsInline
              className="w-full md:w-auto max-w-xs md:max-w-xl h-auto"
              style={{
                transform: 'scale(1.1)',
                objectFit: 'contain',
              }}
            >
              <source src={isDark ? "/images/logo-anim-dark.mov" : "/images/logo-anim-light.mov"} type="video/quicktime" />
              <source src={isDark ? "/images/logo-anim-dark.webm" : "/images/logo-anim-light.webm"} type="video/webm" />
            </video>
          )}
        </div>
      </div>
    </section>
  );
}
