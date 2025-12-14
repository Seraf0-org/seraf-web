import { useEffect, useRef, useState } from "react";

type Props = {
  isDark: boolean;
};

export function PortfolioCursorGlow({ isDark }: Props) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePointerMove = (e: PointerEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          setPos(targetRef.current);
          rafRef.current = null;
        });
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30" aria-hidden>
      <div
        className="absolute w-64 h-64 rounded-full blur-3xl opacity-50 transition-transform duration-75"
        style={{
          transform: `translate(${pos.x - 128}px, ${pos.y - 128}px)`,
          background: isDark
            ? "radial-gradient(circle at center, rgba(103,232,249,0.35), rgba(124,58,237,0.12) 60%, transparent 75%)"
            : "radial-gradient(circle at center, rgba(14,165,233,0.28), rgba(236,72,153,0.14) 60%, transparent 75%)",
          mixBlendMode: isDark ? "screen" : "multiply",
        }}
      />
    </div>
  );
}

