import { useRef, useEffect } from "react";
import { useOutletContext } from "@remix-run/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { OutletContext } from "~/root";

gsap.registerPlugin(ScrollTrigger);

export function Hero({ startAnimation }: { startAnimation: boolean }) {
  const { theme } = useOutletContext<OutletContext>();
  const heroRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";

  useEffect(() => {
    if (!startAnimation) return;
    if (!textContainerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Entry Animation: Staggered slide-up reveal
      tl.fromTo(".hero-line",
        {
          y: 120,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
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

      // Scroll Exit Animation
      // Fade out, blur, and move up GRADUALLY
      gsap.to(".hero-line", {
        scrollTrigger: {
          trigger: document.body,
          // Start: "200px top".
          // Compromise: Solid for ~200px.
          start: "200px top",
          // End: "+=2000".
          // Compromise: 1500 (Too fast gap) < 2000 < 2500 (Too loose).
          // Finishes slightly before the section ends, creating a small nice clear beat before content arrives.
          end: "+=2000",
          scrub: 1.2,         // Balanced smoothing
          snap: {
            // One scroll moves to next step.
            snapTo: 1 / 3,
            duration: { min: 0.8, max: 1.8 }, // Brisk but smooth glide
            delay: 0.0,
            ease: "power2.inOut"
          }
        },
        y: -150,
        opacity: 0,
        filter: "blur(15px)",
        stagger: 0.2,    // Faster sequence
        ease: "none",
        immediateRender: false
      });

    }, textContainerRef);

    return () => ctx.revert();
  }, [startAnimation]);

  return (
    <section ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-center">
      {/* 3D Background Layer */}
      {/* Moved to _index.tsx for global sticking */}

      {/* Content Layer - Left aligned */}
      <div
        ref={textContainerRef}
        className="relative z-10 w-full max-w-[90rem] mx-auto px-6 md:px-16 lg:px-24"
      >
        <div className="flex flex-col items-start text-left select-none text-white drop-shadow-[0_1px_18px_rgba(0,0,0,0.35)]">

          {/* Small Label */}
          <div className="overflow-hidden mb-2">
            <p className="hero-line text-sm md:text-base font-medium tracking-[0.2em] uppercase opacity-0">
              Creative Collective
            </p>
          </div>

          {/* Main Typography */}
          <div className="flex flex-col font-black tracking-tighter leading-[0.9]">

            {/* Line 1: WE ARE */}
            <div className="overflow-hidden">
              <h1 className="hero-line text-[5rem] md:text-[9rem] lg:text-[9rem] xl:text-[10rem] 2xl:text-[11em] opacity-0">
                We are
              </h1>
            </div>

            {/* Line 2: SERAF() */}
            <div className="overflow-hidden">
              <h1 className="hero-line text-[5rem] md:text-[9rem] lg:text-[9rem] xl:text-[10rem] 2xl:text-[11rem] flex items-center gap-2 md:gap-4 opacity-0">
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
            <p className="hero-line text-lg md:text-xl font-light opacity-0 leading-relaxed">
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