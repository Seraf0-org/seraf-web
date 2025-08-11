import { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "@remix-run/react";
import { animate, stagger } from "motion";
import type { OutletContext } from "~/root";

export function Hero() {
  const japaneseText = "何者にもなれる。何者でもないから。";
  const englishText1 = "Become anything,";
  const englishText2 = "from being nothing.";
  const [scrollY, setScrollY] = useState(0);
  const { theme } = useOutletContext<OutletContext>();

  const handleScroll = useCallback(() => {
    requestAnimationFrame(() => {
      setScrollY(window.scrollY);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Motionアニメーションを初期化
  useEffect(() => {
    // 日本語テキストの文字アニメーション - y軸移動付き
    (animate as any)(
      ".japanese-letter",
      { opacity: [0, 1], y: [30, 0] },
      { 
        duration: 1, 
        delay: stagger(0.08),
        easing: [0.25, 0.46, 0.45, 0.94]
      }
    );

    // 英語テキストのアニメーション - y軸移動付き
    (animate as any)(
      ".english-text",
      { opacity: [0, 1], y: [40, 0] },
      { 
        duration: 1.2, 
        delay: stagger(0.3, { startDelay: 1.8 }),
        easing: [0.25, 0.46, 0.45, 0.94]
      }
    );

    // 装飾線のアニメーション
    (animate as any)(
      ".decorative-line",
      { strokeDashoffset: [800, 0] },
      { 
        duration: 1.5, 
        delay: 0.5, 
        easing: [0.25, 0.46, 0.45, 0.94] 
      }
    );
  }, []);

  // ホバーアニメーションの設定
  useEffect(() => {
    // 日本語文字のホバーアニメーション
    const japaneseLetters = document.querySelectorAll('.japanese-letter');
    japaneseLetters.forEach(letter => {
      letter.addEventListener('mouseenter', () => {
        (animate as any)(
          letter,
          { 
            scale: [1, 1.1], 
            y: [0, -5],
            textShadow: ['0 0 20px rgba(255, 255, 255, 0.3)', '0 0 30px rgba(103, 232, 249, 0.8)']
          },
          { duration: 0.3, easing: [0.25, 0.46, 0.45, 0.94] }
        );
      });

      letter.addEventListener('mouseleave', () => {
        (animate as any)(
          letter,
          { 
            scale: [1.1, 1], 
            y: [-5, 0],
            textShadow: ['0 0 30px rgba(103, 232, 249, 0.8)', '0 0 20px rgba(255, 255, 255, 0.3)']
          },
          { duration: 0.3, easing: [0.25, 0.46, 0.45, 0.94] }
        );
      });
    });

    // 英語テキストのホバーアニメーション
    const englishTexts = document.querySelectorAll('.english-text');
    englishTexts.forEach(text => {
      text.addEventListener('mouseenter', () => {
        (animate as any)(
          text,
          { 
            scale: [1, 1.05], 
            y: [0, -3],
            textShadow: ['0 0 20px rgba(255, 255, 255, 0.3)', '0 0 25px rgba(236, 72, 153, 0.8)']
          },
          { duration: 0.3, easing: [0.25, 0.46, 0.45, 0.94] }
        );
      });

      text.addEventListener('mouseleave', () => {
        (animate as any)(
          text,
          { 
            scale: [1.05, 1], 
            y: [-3, 0],
            textShadow: ['0 0 25px rgba(236, 72, 153, 0.8)', '0 0 20px rgba(255, 255, 255, 0.3)']
          },
          { duration: 0.3, easing: [0.25, 0.46, 0.45, 0.94] }
        );
      });
    });
  }, []);

  // スクロール連動アニメーション
  useEffect(() => {
    const handleScrollAnimation = () => {
      const scrolled = window.scrollY;
      const rate = scrolled * -0.5;
      
      // 背景の視差効果を強化
      (animate as any)(
        ".hero-background",
        { y: [0, rate] },
        { duration: 0.1, easing: [0.25, 0.46, 0.45, 0.94] }
      );

      // テキストの視差効果
      (animate as any)(
        ".hero-content",
        { y: [0, rate * 0.3] },
        { duration: 0.1, easing: [0.25, 0.46, 0.45, 0.94] }
      );

      // スクロールに応じた透明度変化
      const opacity = Math.max(0, 1 - scrolled / 800);
      (animate as any)(
        ".hero-text",
        { opacity: [1, opacity] },
        { duration: 0.1, easing: [0.25, 0.46, 0.45, 0.94] }
      );
    };

    window.addEventListener('scroll', handleScrollAnimation, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollAnimation);
  }, []);

  const parallaxTransform = {
    background: `scale(1.1) translate3d(0, ${scrollY * 1}px, 0)`,
    content: `translate3d(0, ${scrollY * 0.5}px, 0)`
  };

  const createLetterSpans = (text: string, baseDelay: number, className: string = "") => {
    const sentences = text.split('。').filter(Boolean);

    return sentences.map((sentence, sentenceIndex) => (
      <span
        key={sentenceIndex}
        className={`inline-block group ${className}`}
      >
        {sentence.split('').map((letter, letterIndex) => {
          // 「何者」の部分は通常サイズ、それ以外のひらがなは小さく
          const isKanji = sentenceIndex === 0 && letterIndex < 2 || sentenceIndex === 1 && letterIndex < 2;

          return (
            <span
              key={letterIndex}
              className={`japanese-letter inline-block opacity-0 group-hover:text-cyan-300 transition-colors duration-300 ${!isKanji ? 'text-[85%]' : ''}`}
              style={{
                textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
              }}
            >
              {letter}
            </span>
          );
        })}
        {sentenceIndex < sentences.length - 1 && (
          <span
            className="japanese-letter inline-block opacity-0 group-hover:text-cyan-300 transition-colors duration-300 text-[85%]"
            style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
            }}
          >
            。
          </span>
        )}
      </span>
    ));
  };

  return (
    <section className="relative h-screen overflow-hidden">
      <div
        className="hero-background absolute inset-0 z-0 will-change-transform"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: parallaxTransform.background,
        }}
      >
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/50' : 'bg-black/30'} transition-colors duration-200`} />
      </div>

      <div
        className="hero-content relative z-10 h-full flex items-center justify-center will-change-transform"
        style={{
          transform: parallaxTransform.content,
        }}
      >
        <div className="text-center hero-text">
          <h1
            className="font-light text-white tracking-[.25em] relative font-mincho leading-loose px-4"
            style={{ lineHeight: '1.8em' }}
          >
            <div className="block font-mincho text-4xl md:text-6xl font-light relative mb-3 md:mb-8">
              <div className="decorative-line absolute -left-4 top-1/2 w-8 h-[1px] bg-white/30 origin-left" style={{ strokeDasharray: '32' }} />
              <div className="decorative-line absolute -right-4 top-1/2 w-8 h-[1px] bg-white/30 origin-right" style={{ strokeDasharray: '32' }} />
              <span className="block md:hidden leading-snug">{createLetterSpans(japaneseText, 0, "relative")}</span>
              <span className="hidden md:block">{createLetterSpans(japaneseText, 0, "relative")}</span>
            </div>

            <div className="font-mincho text-3xl md:text-4xl block font-light tracking-tight md:tracking-[.25em] relative leading-normal md:leading-loose">
              <div className="decorative-line absolute left-1/2 -translate-x-1/2 -top-4 w-24 h-[1px] bg-white/30 origin-center" style={{ strokeDasharray: '96' }} />
              <span
                className="english-text inline-block opacity-0 hover:text-fuchsia-300 transition-colors duration-300 text-lg md:text-3xl"
              >
                {englishText1}
              </span>
              <span
                className="english-text inline-block opacity-0 hover:text-fuchsia-300 transition-colors duration-300 text-lg md:text-3xl ml-1 md:ml-2"
              >
                {englishText2}
              </span>
              <div className="decorative-line absolute left-1/2 -translate-x-1/2 -bottom-4 w-24 h-[1px] bg-white/30 origin-center" style={{ strokeDasharray: '96' }} />
            </div>
          </h1>
        </div>
      </div>
    </section>
  );
}