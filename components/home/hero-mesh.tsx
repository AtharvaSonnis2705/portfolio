"use client";

import { useEffect, useRef } from "react";

/**
 * Slow gradient mesh: cyan → deep teal → transparent.
 * Canvas is rendered at 1/6 resolution and upscaled with CSS blur, capped at ~30fps,
 * paused when off-screen or the tab is hidden, and static under reduced motion.
 */
const BLOBS = [
  { color: [34, 211, 238], alpha: 0.5, r: 0.55, x: 0.72, y: 0.28, sx: 0.07, sy: 0.05, speed: 0.09 },
  {
    color: [14, 116, 144],
    alpha: 0.65,
    r: 0.65,
    x: 0.88,
    y: 0.62,
    sx: 0.06,
    sy: 0.08,
    speed: 0.07,
  },
  { color: [8, 145, 178], alpha: 0.35, r: 0.5, x: 0.45, y: 0.12, sx: 0.08, sy: 0.04, speed: 0.11 },
  { color: [21, 94, 117], alpha: 0.45, r: 0.45, x: 0.2, y: 0.85, sx: 0.05, sy: 0.06, speed: 0.08 },
] as const;

const SCALE = 1 / 6;
const FRAME_MS = 1000 / 30;

export function HeroMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let last = 0;
    let visible = true;
    let t0 = performance.now();

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * SCALE));
      canvas.height = Math.max(1, Math.round(height * SCALE));
    };

    const draw = (time: number) => {
      const w = canvas.width;
      const h = canvas.height;
      const s = (time - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const b of BLOBS) {
        const cx = (b.x + Math.sin(s * b.speed * 2 * Math.PI) * b.sx) * w;
        const cy = (b.y + Math.cos(s * b.speed * 1.7 * Math.PI) * b.sy) * h;
        const r = b.r * Math.max(w, h);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        const [cr, cg, cb] = b.color;
        g.addColorStop(0, `rgba(${cr},${cg},${cb},${b.alpha})`);
        g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
    };

    const loop = (time: number) => {
      raf = requestAnimationFrame(loop);
      if (time - last < FRAME_MS) return;
      last = time;
      draw(time);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reduce.matches) {
        draw(t0);
        return;
      }
      if (visible && document.visibilityState === "visible") raf = requestAnimationFrame(loop);
    };
    const stop = () => cancelAnimationFrame(raf);

    resize();
    draw(t0);
    start();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const onVisibility = () => (document.visibilityState === "visible" ? start() : stop());
    const onResize = () => {
      resize();
      draw(performance.now());
    };
    const onReduce = () => {
      t0 = performance.now();
      start();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);
    reduce.addEventListener("change", onReduce);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      reduce.removeEventListener("change", onReduce);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full [mask-image:radial-gradient(ellipse_80%_70%_at_70%_35%,#000_30%,transparent_80%)] opacity-70 blur-2xl"
    />
  );
}
