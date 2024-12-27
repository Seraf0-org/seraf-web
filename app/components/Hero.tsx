import { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "~/root";

export function Hero() {
  const japaneseText = "何者にもなれる。何者でもないから。";
  const englishText1 = "Become anything,";
  const englishText2 = "　from being nothing.";
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

  const createLetterSpans = (text: string, baseDelay: number, className: string = "") => {
    return text.split('').map((letter, index) => (
      <span
        key={index}
        className={`inline-block animate-fade-in-down opacity-0 ${className}`}
        style={{ 
          animationDelay: `${baseDelay + (index * 0.1)}s`,
          textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
        }}
      >
        {letter}
      </span>
    ));
  };

  return (
    <section className="relative h-screen overflow-hidden">
      <div
        className="absolute inset-0 z-0 scale-110 will-change-transform"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: `translate3d(0, ${scrollY * 0.5}px, 0)`,
        }}
      >
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/50' : 'bg-black/30'} transition-colors duration-200`} />
      </div>

      <div
        className="relative z-10 h-full flex items-center justify-center will-change-transform"
        style={{
          transform: `translate3d(0, ${scrollY * 0.2}px, 0)`,
        }}
      >
        <div className="text-center">
          <h1
            className="font-light text-white tracking-[.25em] relative font-mincho"
            style={{ lineHeight: '2em' }}
          >
            <div className="block font-mincho text-4xl md:text-6xl font-light relative mb-8">
              <div className="absolute -left-4 top-1/2 w-8 h-[1px] bg-white/30" />
              <div className="absolute -right-4 top-1/2 w-8 h-[1px] bg-white/30" />
              {createLetterSpans(japaneseText, 0, "relative hover:text-cyan-300 transition-colors duration-300")}
            </div>

            <div className="font-mincho text-3xl md:text-4xl block font-light tracking-[.5em] relative">
              <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-24 h-[1px] bg-white/30" />
              <span
                className="inline-block animate-fade-in-down opacity-0 hover:text-fuchsia-300 transition-colors duration-300"
                style={{ animationDelay: '2s' }}
              >
                {englishText1}
              </span>
              <span
                className="inline-block animate-fade-in-down opacity-0 hover:text-fuchsia-300 transition-colors duration-300"
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