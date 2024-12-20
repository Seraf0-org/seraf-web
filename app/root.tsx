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

// スクロール関連の型定義を追加
type ScrollFunction = (targetPosition: number, duration?: number) => void;

// コンテキストの型を更新
export type OutletContext = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  smoothScrollTo: ScrollFunction;
};

export default function App() {
  const [theme, setTheme] = useState<Theme>('light');

  // スムーズスクロール関数
  const smoothScrollTo: ScrollFunction = (targetPosition: number, duration: number = 500) => {
    window.stopSmoothScroll?.();

    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    function animation(currentTime: number) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t: number, b: number, c: number, d: number) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);

    // スクロール完了後に履歴を更新
    setTimeout(() => {
      const state = window.history.state || {};
      window.history.replaceState(
        {
          ...state,
          scroll: targetPosition,
          key: location.pathname + new Date().getTime()
        },
        '',
        window.location.pathname
      );
    }, duration);
  };

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
    // グローバルに現在のアニメーションフレームIDを保存
    let globalRequestId: number | null = null;

    // タッチデバイスの判定
    const isTouchDevice = () => {
      return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    };

    if (isTouchDevice() || window.location.hash) {
      return;
    }

    let currentScroll = window.scrollY;
    let targetScroll = currentScroll;
    let lastTime = performance.now();
    let velocity = 0;

    const smoothScroll = (currentTime: number) => {
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const difference = targetScroll - currentScroll;

      // より小さな加速度（0.1 → 0.05）
      const targetVelocity = difference * 0.03;

      // 現在の速度を減衰させながら目標速度に近づける
      velocity = targetVelocity;

      // 速度の符号が目標への方向と逆になった場合は速度をゼロにする
      if ((velocity > 0 && difference < 0) || (velocity < 0 && difference > 0)) {
        velocity = 0;
      }

      // より小さな停止判定のしきい値（0.5 → 0.1）
      if (Math.abs(velocity) < 0.02) {
        currentScroll = targetScroll;
        window.scrollTo(0, currentScroll);
        globalRequestId = null;
        velocity = 0;
        return;
      }

      currentScroll += velocity;
      window.scrollTo(0, currentScroll);
      globalRequestId = requestAnimationFrame(smoothScroll);
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

      if (!globalRequestId) {
        lastTime = performance.now();
        globalRequestId = requestAnimationFrame(smoothScroll);
      }
    };

    window.stopSmoothScroll = () => {
      if (globalRequestId) {
        cancelAnimationFrame(globalRequestId);
        globalRequestId = null;
        velocity = 0;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      if (globalRequestId) {
        cancelAnimationFrame(globalRequestId);
      }
      window.removeEventListener("wheel", handleWheel);
      // クリーンアップ時にグローバル関数を削除
      delete window.stopSmoothScroll;
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
        <Outlet context={{
          theme,
          setTheme,
          smoothScrollTo
        }} />
        <ScrollRestoration
          getKey={location => location.pathname + new Date().getTime()}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

// TypeScriptのグローバル型定義を追加
declare global {
  interface Window {
    stopSmoothScroll?: () => void;
  }
}