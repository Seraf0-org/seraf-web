import type { MetaFunction } from "@remix-run/node";
import { Header } from "~/components/Header";
import { Hero } from "~/components/Hero";
import { About } from "~/components/About";
import { News } from "~/components/News";
import { Products } from "~/components/Products";
import { Members } from "~/components/Members";
import { Partnership } from "~/components/Partnership";
import { Footer } from "~/components/Footer";
import { Contact } from "~/components/Contact";
import { ThreeBackground } from "~/components/ThreeBackground";

export const meta: MetaFunction = () => {
  return [
    { title: "Seraf()" },
    { name: "description", content: "We are Seraf()" },
    { property: "og:title", content: "Seraf()" },
    { property: "og:description", content: "We are Seraf(), a creative studio focused on game development." },
    { property: "og:image", content: "https://Seraf0.com/images/namelogo-light.png" },
    { property: "og:url", content: "https://Seraf0.com" },
    { property: "og:type", content: "website" },
  ];
};

import { PortfolioCursorNodes } from "~/components/PortfolioCursorNodes";
import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "~/root";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { LoadingScreen } from "~/components/LoadingScreen";

export default function Index() {
  const { theme } = useOutletContext<OutletContext>();
  const isDark = theme === 'dark';
  const [isLoading, setIsLoading] = useState(true);
  const [startAnimation, setStartAnimation] = useState(false);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen
            isDark={isDark}
            onComplete={() => {
              setIsLoading(false);
              setTimeout(() => setStartAnimation(true), 500); // Wait for curtain to clear
            }}
          />
        )}
      </AnimatePresence>

      <div className="fixed inset-0 z-0 opacity-95" style={isDark
        ? {
          backgroundColor: "#050505",
          backgroundImage: `
              radial-gradient(65% 65% at 34% 46%, rgba(34, 211, 238, 0.34) 0%, rgba(34, 211, 238, 0.00) 68%),
              radial-gradient(55% 55% at 78% 18%, rgba(59, 130, 246, 0.26) 0%, rgba(59, 130, 246, 0.00) 64%),
              radial-gradient(60% 60% at 22% 86%, rgba(14, 165, 233, 0.22) 0%, rgba(14, 165, 233, 0.00) 62%),
              linear-gradient(135deg, rgba(34, 211, 238, 0.10) 0%, rgba(59, 130, 246, 0.06) 40%, rgba(0,0,0,0) 72%)
            `,
        }
        : {
          backgroundColor: "#f8fafc",
          backgroundImage: `
              radial-gradient(55% 55% at 18% 22%, rgba(14, 165, 233, 0.16) 0%, rgba(14, 165, 233, 0.00) 66%),
              radial-gradient(50% 50% at 88% 16%, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.00) 64%),
              radial-gradient(60% 60% at 70% 92%, rgba(34, 211, 238, 0.12) 0%, rgba(34, 211, 238, 0.00) 62%),
              linear-gradient(135deg, rgba(14, 165, 233, 0.06) 0%, rgba(59, 130, 246, 0.03) 45%, rgba(255,255,255,0) 75%)
            `,
        }
      } />
      <ThreeBackground isDark={isDark} />
      <main className="relative z-20">
        <Header startAnimation={startAnimation} />

        {/* Sticky Hero Wrapper with Scroll Buffer */}
        <div className="relative" style={{ height: '250vh' }}>
          <div className="sticky top-0 h-screen overflow-hidden" style={{ zIndex: 1 }}>
            <Hero startAnimation={startAnimation} />
          </div>
        </div>

        {/* Scrolling Content Wrapper - Semi-transparent gradient for readability */}
        <div
          className={`relative z-30 pt-32`}
          style={{
            background: isDark
              ? 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 5%, rgba(0,0,0,0.2) 100%)'
              : 'linear-gradient(to bottom, rgba(248,250,252,0) 0%, rgba(248,250,252,0.95) 20%, rgba(248,250,252,1) 100%)',
            backdropFilter: 'blur(2px)' // Optional: Adds slight blur to enhance text further
          }}
        >
          <PortfolioCursorNodes isDark={isDark} />
          <section id="about">
            <About />
          </section>
          <section id="news">
            <News />
          </section>
          <section id="products">
            <Products />
          </section>
          <section id="members">
            <Members />
          </section>
          <section id="partnership">
            <Partnership />
          </section>
          <section id="contact">
            <Contact />
          </section>
          <Footer />
        </div>
      </main >
    </>
  );
}
