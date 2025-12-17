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

export default function Index() {
  const { theme } = useOutletContext<OutletContext>();
  const isDark = theme === 'dark';

  return (
    <>
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
      <main className="relative z-20">
        <Header />

        {/* Sticky Hero Wrapper with Scroll Buffer */}
        <div className="relative" style={{ height: '250vh' }}>
          <div className="sticky top-0 h-screen overflow-hidden" style={{ zIndex: 1 }}>
            <Hero />
          </div>
        </div>

        {/* Scrolling Content Wrapper - Opaque to cover Hero */}
        <div className="relative z-30 bg-[#020202]">
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
