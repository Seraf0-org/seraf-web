import { useEffect, useState, useCallback, useRef } from "react";
import { useOutletContext } from "@remix-run/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { OutletContext } from "~/root";

// GSAPプラグインを登録
gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const japaneseText = "何者にもなれる。何者でもないから。";
  const englishText1 = "Become anything,";
  const englishText2 = "from being nothing.";
  const { theme } = useOutletContext<OutletContext>();

  // GSAP用のrefs
  const heroRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // 初期アニメーションとパララックス効果の設定
  useEffect(() => {
    if (!heroRef.current || !backgroundRef.current || !contentRef.current || !textRef.current) return;

    // 初期状態を設定
    gsap.set(".japanese-letter", { opacity: 0, y: 30 });
    gsap.set(".english-text", { opacity: 0, y: 40 });
    gsap.set(".decorative-line", { strokeDashoffset: 800 });

    // 文字アニメーションのタイムライン
    const tl = gsap.timeline();

    // 日本語テキストのアニメーション
    tl.to(".japanese-letter", {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.08,
      ease: "power2.out"
    });

    // 英語テキストのアニメーション
    tl.to(".english-text", {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.3,
      ease: "power2.out"
    }, 1.8);

    // 装飾線のアニメーション
    tl.to(".decorative-line", {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: "power2.out"
    }, 0.5);

    // パララックス効果の設定
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const yPos = progress * 100;

        // 背景のパララックス効果
        gsap.set(backgroundRef.current, {
          y: yPos,
          scale: 1.1
        });

        // コンテンツのパララックス効果
        gsap.set(contentRef.current, {
          y: yPos * 0.5
        });

        // テキストの透明度変化
        gsap.set(textRef.current, {
          opacity: Math.max(0, 1 - progress * 2)
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // ホバーアニメーションの設定
  useEffect(() => {
    // 日本語文字のホバーアニメーション
    const japaneseLetters = document.querySelectorAll('.japanese-letter');
    japaneseLetters.forEach(letter => {
      letter.addEventListener('mouseenter', () => {
        gsap.to(letter, {
          scale: 1.1,
          y: -5,
          textShadow: '0 0 30px rgba(103, 232, 249, 0.8)',
          duration: 0.3,
          ease: "power2.out"
        });
      });

      letter.addEventListener('mouseleave', () => {
        gsap.to(letter, {
          scale: 1,
          y: 0,
          textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });

    // 英語テキストのホバーアニメーション
    const englishTexts = document.querySelectorAll('.english-text');
    englishTexts.forEach(text => {
      text.addEventListener('mouseenter', () => {
        gsap.to(text, {
          scale: 1.05,
          y: -3,
          textShadow: '0 0 25px rgba(236, 72, 153, 0.8)',
          duration: 0.3,
          ease: "power2.out"
        });
      });

      text.addEventListener('mouseleave', () => {
        gsap.to(text, {
          scale: 1,
          y: 0,
          textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });
  }, []);


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
    <section ref={heroRef} className="relative h-screen overflow-hidden">
      <div
        ref={backgroundRef}
        className="hero-background absolute inset-0 z-0 will-change-transform"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/50' : 'bg-black/30'} transition-colors duration-200`} />
      </div>

      <div
        ref={contentRef}
        className="hero-content relative z-10 h-full flex items-center justify-center will-change-transform"
      >
        <div ref={textRef} className="text-center hero-text">
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