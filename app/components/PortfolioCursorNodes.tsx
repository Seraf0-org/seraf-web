import { useEffect, useRef } from "react";

type Props = {
  isDark: boolean;
  className?: string;
};

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
};

export function PortfolioCursorNodes({ isDark, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const lastSpawn = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnCluster = (x: number, y: number) => {
      const count = 1; // さらに抑制
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.38 + Math.random() * 0.6;
        nodesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed * 1.2, // 少し広がりやすく
          vy: Math.sin(angle) * speed * 1.2,
          life: 0,
          maxLife: 2600 + Math.random() * 1400, // ほんの少し寿命延長
        });
      }
      if (nodesRef.current.length > 90) {
        nodesRef.current.splice(0, nodesRef.current.length - 90);
      }
    };

    const handleMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      lastPos.current = { x, y };

      const dx = x - lastSpawn.current.x;
      const dy = y - lastSpawn.current.y;
      const dist2 = dx * dx + dy * dy;
      // 距離しきい値のみで間引き：約28pxに拡大
      if (dist2 < 28 * 28) return;

      lastSpawn.current = { x, y };
      spawnCluster(x, y);
    };
    window.addEventListener("pointermove", handleMove);

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      // draw links
      ctx.lineWidth = 1;
      ctx.strokeStyle = isDark ? "rgba(80,170,255,0.5)" : "rgba(70,160,255,0.5)";
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < 36000) {
            const alpha = 1 - dist2 / 36000;
            ctx.globalAlpha = alpha * 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // draw nodes with smooth fade (ease)
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        n.life += 16;
        if (n.life > n.maxLife) {
          nodes.splice(i, 1);
          continue;
        }
        n.x += n.vx;
        n.y += n.vy;
        n.vx *= 0.99;
        n.vy *= 0.99;

        const t = n.life / n.maxLife;          // 0 → 1
        const alpha = Math.pow(1 - t, 2.2);    // ease-outで滑らかに消える
        const size = 2.6 + (1 - t) * 0.8;      // わずかに縮小

        ctx.fillStyle = isDark ? "rgba(80,170,255,0.8)" : "rgba(70,160,255,0.78)";
        ctx.beginPath();
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handleMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      // style={{ zIndex: 12 }} // Removed hardcoded zIndex to allow override via className
      aria-hidden
    />
  );
}

