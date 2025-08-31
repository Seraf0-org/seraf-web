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

export default function Index() {
  return (
    <main>
      <Header />
      <Hero />
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
    </main>
  );
}
