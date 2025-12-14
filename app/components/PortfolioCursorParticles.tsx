import { useEffect, useRef } from "react";

type Props = {
  isDark: boolean;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
};

export function PortfolioCursorParticles({ isDark }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastSpawnRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    ctx.globalCompositeOperation = isDark ? "screen" : "lighter";

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", resize);

    const spawnParticles = (x: number, y: number) => {
      const now = performance.now();
      if (now - lastSpawnRef.current < 16) return; // throttle
      lastSpawnRef.current = now;
      const count = 10;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.6 + Math.random() * 1.8;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 900 + Math.random() * 400,
          size: 2 + Math.random() * 2.5,
          hue: isDark ? 185 + Math.random() * 80 : 190 + Math.random() * 70,
        });
      }

      // cap particles to avoid runaway
      if (particlesRef.current.length > 500) {
        particlesRef.current.splice(0, particlesRef.current.length - 500);
      }
    };

    const handleMove = (e: PointerEvent) => {
      spawnParticles(e.clientX, e.clientY);
    };
    const handleClick = (e: PointerEvent) => {
      spawnParticles(e.clientX, e.clientY);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerdown", handleClick);

    const animate = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += 16;
        if (p.life > p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        const progress = p.life / p.maxLife;
        const alpha = (1 - progress) * 0.7;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.004; // slight gravity

        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 90%, ${isDark ? 70 : 55}%, ${alpha})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleClick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-30 pointer-events-none"
      aria-hidden
    />
  );
}

