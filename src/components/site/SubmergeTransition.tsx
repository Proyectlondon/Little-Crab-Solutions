"use client";

import { useEffect, useRef } from "react";

/**
 * SubmergeTransition — dramatic volumetric fog + ice particles that fully
 * occludes the seam between Hero (surface) and body (underwater).
 *
 * Inspired by igloo.inc's avalanche/ice transition. This version is much
 * denser than the previous one — it includes:
 *
 *  1. A SOLID GRADIENT BAND that matches both sections' colors, eliminating
 *     the brightness mismatch at the seam.
 *  2. DENSE FOG (80 particles, high opacity, large radius) drifting upward.
 *  3. ICE/SNOW PARTICLES — small white/teal specks floating in the fog,
 *     mimicking the "avalanche" feel the user described.
 *  4. God ray remnants (faint vertical light shafts through the fog).
 *
 * The container is taller (480px) with more overlap (200px each side) so
 * the fog has enough volume to fully hide any harsh edge.
 */
export default function SubmergeTransition() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const container = containerRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = container.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Dense fog particles — soft drifting blobs
    const FOG_COUNT = 80;
    const fog = Array.from({ length: FOG_COUNT }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 110 + 70, // 70-180px (large soft blobs)
      vx: (Math.random() - 0.5) * 0.2,
      vy: -(Math.random() * 0.18 + 0.05),
      alpha: Math.random() * 0.28 + 0.15, // 0.15-0.43 (dense)
      hue: Math.random(),
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: Math.random() * 0.008 + 0.002,
    }));

    // Ice/snow particles — small bright specks
    const ICE_COUNT = 60;
    const ice = Array.from({ length: ICE_COUNT }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.6, // 0.6-2.4px
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.5 + 0.2),
      alpha: Math.random() * 0.6 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.05 + 0.02,
    }));

    let t = 0;
    let raf = 0;
    let scrollIntensity = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Scroll intensity — fog is always at least 70% visible
      const rect = container.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const containerCenter = rect.top + rect.height / 2;
      const distance = Math.abs(containerCenter - viewportCenter);
      const targetIntensity = Math.max(0.7, 1 - distance / (window.innerHeight * 0.7));
      scrollIntensity += (targetIntensity - scrollIntensity) * 0.05;

      // ========== 1. DENSE FOG LAYER ==========
      ctx.globalCompositeOperation = "lighter";
      for (const p of fog) {
        p.phase += p.phaseSpeed;
        p.x += p.vx + Math.sin(p.phase) * 0.12;
        p.y += p.vy;

        if (p.y < -p.r) {
          p.y = h + p.r;
          p.x = Math.random() * w;
        }
        if (p.x < -p.r) p.x = w + p.r;
        if (p.x > w + p.r) p.x = -p.r;

        const pulseAlpha = p.alpha * (0.75 + Math.sin(p.phase * 0.8) * 0.25);
        const finalAlpha = pulseAlpha * (0.8 + scrollIntensity * 0.4);

        let color: string;
        if (p.hue < 0.65) {
          color = `rgba(160, 210, 235, ${finalAlpha})`;
        } else if (p.hue < 0.88) {
          color = `rgba(110, 170, 200, ${finalAlpha * 0.85})`;
        } else {
          color = `rgba(229, 75, 27, ${finalAlpha * 0.25})`;
        }

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, color);
        grad.addColorStop(0.55, color.replace(/[\d.]+\)$/, `${finalAlpha * 0.35})`));
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // ========== 2. ICE/SNOW PARTICLES ==========
      ctx.globalCompositeOperation = "screen";
      for (const p of ice) {
        p.x += p.vx;
        p.y += p.vy;
        p.twinkle += p.twinkleSpeed;

        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const twinkleAlpha = p.alpha * (0.5 + Math.sin(p.twinkle) * 0.5);
        ctx.beginPath();
        ctx.fillStyle = `rgba(230, 245, 255, ${twinkleAlpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        // Small glow around each ice particle
        ctx.beginPath();
        ctx.fillStyle = `rgba(180, 220, 240, ${twinkleAlpha * 0.3})`;
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // ========== 3. GOD RAY REMNANTS through fog ==========
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 4; i++) {
        const x = w * (0.15 + i * 0.24) + Math.sin(t * 0.0008 + i) * 35;
        const streakGrad = ctx.createLinearGradient(x, 0, x, h);
        const streakAlpha = 0.05 * scrollIntensity;
        streakGrad.addColorStop(0, `rgba(140, 200, 240, ${streakAlpha})`);
        streakGrad.addColorStop(0.5, `rgba(86, 160, 210, ${streakAlpha * 0.5})`);
        streakGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = streakGrad;
        ctx.fillRect(x - 50, 0, 100, h);
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
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="submerge-transition relative w-full"
      style={{
        height: "480px",
        marginTop: "-200px", // deep overlap with hero
        marginBottom: "-200px", // deep overlap with body
        pointerEvents: "none",
        zIndex: 6,
        // Solid gradient base that matches both sections' colors — eliminates brightness mismatch
        background:
          "linear-gradient(to bottom, rgba(7, 9, 12, 0) 0%, rgba(12, 17, 24, 0.5) 25%, rgba(15, 22, 32, 0.7) 50%, rgba(12, 17, 24, 0.5) 75%, rgba(7, 9, 12, 0) 100%)",
        // Feather the container edges
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
