import { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "@remix-run/react";
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
              className={`inline-block animate-fade-in-down opacity-0 group-hover:text-cyan-300 transition-colors duration-300 ${!isKanji ? 'text-[85%]' : ''}`}
              style={{
                animationDelay: `${baseDelay + ((sentenceIndex * sentence.length + letterIndex) * 0.1)}s`,
                textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
              }}
            >
              {letter}
            </span>
          );
        })}
        {sentenceIndex < sentences.length - 1 && (
          <span
            className="inline-block animate-fade-in-down opacity-0 group-hover:text-cyan-300 transition-colors duration-300 text-[85%]"
            style={{
              animationDelay: `${baseDelay + ((sentenceIndex + 1) * sentence.length * 0.1)}s`,
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
        className="absolute inset-0 z-0 will-change-transform"
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
        className="relative z-10 h-full flex items-center justify-center will-change-transform"
        style={{
          transform: parallaxTransform.content,
        }}
      >
        <div className="text-center">
          <h1
            className="font-light text-white tracking-[.25em] relative font-mincho leading-loose px-4"
            style={{ lineHeight: '1.8em' }}
          >
            <div className="block font-mincho text-4xl md:text-6xl font-light relative mb-3 md:mb-8">
              <div className="absolute -left-4 top-1/2 w-8 h-[1px] bg-white/30" />
              <div className="absolute -right-4 top-1/2 w-8 h-[1px] bg-white/30" />
              <span className="block md:hidden leading-snug">{createLetterSpans(japaneseText, 0, "relative")}</span>
              <span className="hidden md:block">{createLetterSpans(japaneseText, 0, "relative")}</span>
            </div>

            <div className="font-mincho text-3xl md:text-4xl block font-light tracking-tight md:tracking-[.25em] relative leading-normal md:leading-loose">
              <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-24 h-[1px] bg-white/30" />
              <span
                className="inline-block animate-fade-in-down opacity-0 hover:text-fuchsia-300 transition-colors duration-300 text-lg md:text-3xl"
                style={{ animationDelay: '2s' }}
              >
                {englishText1}
              </span>
              <span
                className="inline-block animate-fade-in-down opacity-0 hover:text-fuchsia-300 transition-colors duration-300 text-lg md:text-3xl ml-1 md:ml-2"
                style={{ animationDelay: '2.5s' }}
              >
                {englishText2}
              </span>
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-24 h-[1px] bg-white/30" />
            </div>
          </h1>
        </div>
      </div>
    </section>
  );
}