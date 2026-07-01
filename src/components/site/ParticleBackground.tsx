"use client";

import { useEffect, useRef } from "react";

/**
 * Particle / wave background inspired by igloo.inc's immersive hero.
 * - Layer 1: drifting connected particles (the "swarm")
 * - Layer 2: soft animated wave at the bottom (the "tide")
 * Colors pulled from Little Crab palette: coral, ocean, sand.
 */
export default function ParticleBackground({
  variant = "hero",
}: {
  variant?: "hero" | "subtle";
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Particle swarm
    const COUNT = variant === "hero" ? 60 : 28;
    const particles = Array.from({ length: COUNT }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.6,
      hue: Math.random(),
    }));

    // Mouse influence
    let mx = w / 2;
    let my = h / 2;
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    // Wave layers
    const waves = [
      { amp: 22, len: 0.008, speed: 0.012, yOff: 0.65, color: "rgba(229, 75, 27, 0.10)" },
      { amp: 16, len: 0.011, speed: 0.018, yOff: 0.72, color: "rgba(46, 110, 158, 0.12)" },
      { amp: 12, len: 0.014, speed: 0.024, yOff: 0.80, color: "rgba(232, 185, 116, 0.08)" },
    ];
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Subtle radial glow following mouse
      const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 360);
      grad.addColorStop(0, "rgba(229, 75, 27, 0.10)");
      grad.addColorStop(1, "rgba(229, 75, 27, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Update + draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Slight attraction to mouse
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 22500) {
          const f = 0.0006;
          p.vx += dx * f;
          p.vy += dy * f;
        }
        // Damping
        p.vx *= 0.99;
        p.vy *= 0.99;

        const color =
          p.hue < 0.5
            ? "rgba(229, 75, 27, 0.85)"
            : p.hue < 0.8
            ? "rgba(232, 185, 116, 0.7)"
            : "rgba(46, 110, 158, 0.7)";

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Connect nearby particles
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 14000) {
            const o = (1 - d2 / 14000) * 0.18;
            ctx.strokeStyle = `rgba(229, 75, 27, ${o})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Wave layers at bottom
      for (const wv of waves) {
        ctx.beginPath();
        const baseY = h * wv.yOff;
        ctx.moveTo(0, baseY);
        for (let x = 0; x <= w; x += 4) {
          const y =
            baseY +
            Math.sin(x * wv.len + t * wv.speed * 60) * wv.amp +
            Math.sin(x * wv.len * 2.3 + t * wv.speed * 90) * wv.amp * 0.4;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fillStyle = wv.color;
        ctx.fill();
      }

      t += 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
