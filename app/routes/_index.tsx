import type { MetaFunction } from "@remix-run/node";
import { Header } from "~/components/Header";
import { Hero } from "~/components/Hero";
import { About } from "~/components/About";
import { News } from "~/components/News";
import { Products } from "~/components/Products";
import { Members } from "~/components/Members";
import { Footer } from "~/components/Footer";

export const meta: MetaFunction = () => {
  return [
    { title: "Seraf()" },
    { name: "description", content: "We are Seraf()" },
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
      <section id="contact">
        <Footer />
      </section>
    </main>
  );
}
