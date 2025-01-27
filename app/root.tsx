import type { LinksFunction, MetaFunction } from "@remix-run/node";
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
import { LinesProvider } from './contexts/LinesContext';

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

export const meta: MetaFunction = () => {
  return [
    { title: "Seraf()" },
    { name: "description", content: "We are Seraf()" },
    {
      tagName: "link",
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@300;400;700&display=swap"
    },
    {
      tagName: "link",
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@300;400;500;600;700&display=swap"
    }
  ];
};

export default function App() {
  const [theme, setTheme] = useState<Theme>('light');

  // スムーズスクロール関数を修正
  const smoothScrollTo: ScrollFunction = (targetPosition: number, duration: number = 500) => {
    // 既存のスムーズスクロールを停止
    window.stopSmoothScroll?.();

    // 現在のスクロール位置を開始位置として使用
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;
    let animationFrameId: number;
    let currentPosition = startPosition;
    let isManualScrollDetected = false;

    function animation(currentTime: number) {
      // マニュアルスクロールが検出された場合、アニメーションを停止
      if (isManualScrollDetected) {
        cancelAnimationFrame(animationFrameId);
        return;
      }

      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // イージング関数を使用して現在位置を計算
      currentPosition = startPosition + distance * easeInOutQuad(progress);
      window.scrollTo(0, currentPosition);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animation);
      } else {
        currentPosition = targetPosition;
        window.scrollTo(0, currentPosition);

        if (window.smoothScrollState) {
          window.smoothScrollState.currentScroll = currentPosition;
          window.smoothScrollState.targetScroll = currentPosition;
          window.smoothScrollState.isAutoScrolling = false;
        }
      }
    }

    function easeInOutQuad(t: number): number {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    // ホイールイベントのハンドラー
    const handleWheelDuringAutoScroll = (e: WheelEvent) => {
      isManualScrollDetected = true;
      if (window.smoothScrollState) {
        window.smoothScrollState.isAutoScrolling = false;
        window.smoothScrollState.currentScroll = window.scrollY;
        window.smoothScrollState.targetScroll = window.scrollY;
      }
      window.removeEventListener('wheel', handleWheelDuringAutoScroll);
    };

    // 自動スクロール中のホイールイベントを監視
    window.addEventListener('wheel', handleWheelDuringAutoScroll);

    // アニメーションを開始
    if (window.smoothScrollState) {
      window.smoothScrollState.isAutoScrolling = true;
    }
    animationFrameId = requestAnimationFrame(animation);

    // クリーンアップ関数を更新
    window.stopSmoothScroll = () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('wheel', handleWheelDuringAutoScroll);
      if (window.smoothScrollState) {
        window.smoothScrollState.currentScroll = window.scrollY;
        window.smoothScrollState.targetScroll = window.scrollY;
        window.smoothScrollState.isAutoScrolling = false;
      }
    };
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
    window.smoothScrollState = {
      currentScroll: window.scrollY,
      targetScroll: window.scrollY,
      velocity: 0
    };

    let globalRequestId: number | null = null;

    const isTouchDevice = () => {
      return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    };

    if (isTouchDevice() || window.location.hash) {
      return;
    }

    const smoothScroll = (currentTime: number) => {
      const state = window.smoothScrollState;
      if (!state) return;

      const deltaTime = Math.min((currentTime - state.lastTime) / 1000, 0.1);
      state.lastTime = currentTime;

      const difference = state.targetScroll - state.currentScroll;
      const targetVelocity = difference * 0.03;
      state.velocity = targetVelocity;

      if ((state.velocity > 0 && difference < 0) || (state.velocity < 0 && difference > 0)) {
        state.velocity = 0;
      }

      if (Math.abs(state.velocity) < 0.02 && Math.abs(difference) < 0.1) {
        state.currentScroll = state.targetScroll;
        window.scrollTo(0, state.currentScroll);
        globalRequestId = null;
        state.velocity = 0;
        return;
      }

      state.currentScroll += state.velocity;
      window.scrollTo(0, state.currentScroll);
      globalRequestId = requestAnimationFrame(smoothScroll);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const state = window.smoothScrollState;
      if (!state) return;

      const scrollMultiplier = 1.5;
      const deltaY = e.deltaMode === 1 ? e.deltaY * 20 : e.deltaY;

      state.targetScroll = Math.max(
        0,
        Math.min(
          state.targetScroll + (deltaY * scrollMultiplier),
          document.documentElement.scrollHeight - window.innerHeight
        )
      );

      if (!globalRequestId) {
        state.lastTime = performance.now();
        globalRequestId = requestAnimationFrame(smoothScroll);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (globalRequestId) {
        cancelAnimationFrame(globalRequestId);
      }
      delete window.smoothScrollState;
    };
  }, []);

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@200;300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <LinesProvider>
          <Outlet context={{
            theme,
            setTheme,
            smoothScrollTo
          }} />
        </LinesProvider>
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
    smoothScrollState?: {
      currentScroll: number;
      targetScroll: number;
      velocity: number;
      lastTime?: number;
      isAutoScrolling: boolean;
    };
  }
}