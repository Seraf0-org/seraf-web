import { useEffect, useRef } from "react";
import { useOutletContext } from "@remix-run/react";
import { gsap } from "gsap";
import type { OutletContext } from "~/root";
import { ThreeBackground } from "./ThreeBackground";

export function Hero() {
  const { theme } = useOutletContext<OutletContext>();
  const heroRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";

  useEffect(() => {
    if (!textContainerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Entry Animation: Staggered slide-up reveal
      tl.from(".hero-line", {
        y: 120,
        opacity: 0,
        duration: 1.4,
        stagger: 0.15,
        ease: "power4.out",
        delay: 0.2
      });

      // Floating animation for the "()" 
      // Request: "Lower reference position. Less up, more down."
      // Previous: 0 -> -6 (All up).
      // New: +3 -> -3 (Centered). Reference lowered by 3px.
      gsap.fromTo(".brackets",
        { y: 3 },
        {
          y: -3,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        }
      );

    }, textContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-center">
      {/* 3D Background Layer */}
      <ThreeBackground isDark={isDark} />

      {/* Content Layer - Left aligned */}
      <div
        ref={textContainerRef}
        className="relative z-10 w-full max-w-[90rem] mx-auto px-6 md:px-16 lg:px-24"
      >
        <div className="flex flex-col items-start text-left select-none text-white drop-shadow-[0_1px_18px_rgba(0,0,0,0.35)]">

          {/* Small Label */}
          <div className="overflow-hidden mb-2">
            <p className="hero-line text-sm md:text-base font-medium tracking-[0.2em] uppercase opacity-80">
              Creative Collective
            </p>
          </div>

          {/* Main Typography */}
          <div className="flex flex-col font-black tracking-tighter leading-[0.9]">

            {/* Line 1: WE ARE */}
            <div className="overflow-hidden">
              <h1 className="hero-line text-[5rem] md:text-[9rem] lg:text-[11rem]">
                We are
              </h1>
            </div>

            {/* Line 2: SERAF() */}
            <div className="overflow-hidden">
              <h1 className="hero-line text-[5rem] md:text-[9rem] lg:text-[11rem] flex items-center gap-2 md:gap-4">
                <span>Seraf</span>
                {/* tracking-[0.2em] adds spacing between ( and ) */}
                <span className="brackets font-bbh tracking-[0.2em] font-light text-cyan-400 bg-clip-text text-transparent bg-gradient-to-tr from-cyan-400 to-pink-500">
                  ()
                </span>
              </h1>
            </div>

          </div>

          {/* Description / CTA area */}
          <div className="overflow-hidden mt-8 md:mt-12 max-w-lg">
            <p className="hero-line text-lg md:text-xl font-light opacity-70 leading-relaxed">
              Become anything from being nothing.
            </p>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 mix-blend-difference text-white animate-bounce opacity-50">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

    </section>
  );
}