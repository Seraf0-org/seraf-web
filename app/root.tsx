import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/build/tailwind.css" },
  { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
];

// テーマの型を他のコンポーネントでも使えるように
export type Theme = 'light' | 'dark';

export default function App() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);

    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // スムーズスクロールの実装
  useEffect(() => {
    // タッチデバイスの判定
    const isTouchDevice = () => {
      return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    };

    // タッチデバイスの場合は、カスタムスクロールを適用しない
    if (isTouchDevice()) {
      return;
    }

    let currentScroll = window.scrollY;
    let targetScroll = currentScroll;
    let requestId: number | null = null;
    let lastTime = performance.now();
    let velocity = 0;

    const easeOutSine = (x: number): number => {
      return Math.sin((x * Math.PI) / 2);
    };

    const smoothScroll = (currentTime: number) => {
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const difference = targetScroll - currentScroll;

      const progress = Math.min(Math.abs(difference) / 3500, 1);
      const easeFactor = easeOutSine(1 - progress);

      const endingFactor = Math.max(0.15, Math.min(Math.abs(difference) / 350, 1));

      const deceleration = Math.pow(endingFactor, 1.8);
      const targetVelocity = difference * (0.045 + easeFactor * 0.018) * deceleration;

      const followFactor = 0.025 + (1 - endingFactor) * 0.01;
      velocity += (targetVelocity - velocity) * followFactor;

      const maxVelocity = Math.min(Math.abs(difference) * 0.35, 160) * deceleration;
      velocity = Math.max(Math.min(velocity, maxVelocity), -maxVelocity);

      if (Math.abs(difference) < 0.01 && Math.abs(velocity) < 0.01) {
        currentScroll = targetScroll;
        window.scrollTo(0, currentScroll);
        requestId = null;
        velocity = 0;
        return;
      }

      currentScroll += velocity;
      window.scrollTo(0, currentScroll);
      requestId = requestAnimationFrame(smoothScroll);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const scrollMultiplier = 1.3;
      const deltaY = e.deltaMode === 1 ? e.deltaY * 20 : e.deltaY;

      const newTarget = Math.max(
        0,
        Math.min(
          targetScroll + (deltaY * scrollMultiplier),
          document.documentElement.scrollHeight - window.innerHeight
        )
      );

      if ((targetScroll - newTarget) * velocity > 0) {
        velocity *= 0.92;
      }

      targetScroll = newTarget;

      if (!requestId) {
        lastTime = performance.now();
        requestId = requestAnimationFrame(smoothScroll);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      if (requestId) {
        cancelAnimationFrame(requestId);
      }
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Outlet context={{ theme, setTheme }} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}