"use client";

import { useEffect, useRef } from "react";

/**
 * SubmergeTransition — a volumetric fog/smoke layer that hides the hard seam
 * between the Hero ("surface") and the body of the page ("underwater").
 *
 * Inspired by igloo.inc's avalanche/ice transition: as the user scrolls from
 * the hero into the main content, a drifting fog of soft particles occludes
 * the section boundary, creating a "submerging" feel.
 *
 * Implementation:
 *  - A canvas the width of the viewport, ~320px tall, positioned right at the
 *    hero/body boundary.
 *  - 40-50 soft particle blobs (radial gradients) that drift slowly upward
 *    and sideways, with varying opacity and blur — mimicking volumetric smoke.
 *  - A linear gradient mask on the top and bottom edges of the container so
 *    the fog itself has no hard edges.
 *  - Tied to scroll: when the transition enters the viewport, fog density
 *    increases slightly (feels like "passing through" the surface).
 *
 * Color palette: pale blue, muted teal, and faint coral accents — to match
 * the ocean ambient without overpowering it.
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

    // Fog particles — soft drifting blobs
    const PARTICLE_COUNT = 60;
    const particles = Array.from({ length: PARTICLE_COUNT }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 90 + 60, // 60-150px radius (larger = softer)
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.2 + 0.06), // drift upward slowly
      alpha: Math.random() * 0.22 + 0.10, // 0.10-0.32 (denser baseline)
      hue: Math.random(), // determines color
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: Math.random() * 0.01 + 0.003,
    }));

    let t = 0;
    let raf = 0;
    let scrollIntensity = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Smooth scroll intensity (0 when far away, 1 when in view)
      const rect = container.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const containerCenter = rect.top + rect.height / 2;
      const distance = Math.abs(containerCenter - viewportCenter);
      // Wider influence range so fog is visible earlier (0.8 of viewport height)
      const targetIntensity = Math.max(0.3, 1 - distance / (window.innerHeight * 0.8));
      scrollIntensity += (targetIntensity - scrollIntensity) * 0.05;

      ctx.globalCompositeOperation = "lighter";

      for (const p of particles) {
        // Drift
        p.phase += p.phaseSpeed;
        p.x += p.vx + Math.sin(p.phase) * 0.15;
        p.y += p.vy;

        // Wrap around
        if (p.y < -p.r) {
          p.y = h + p.r;
          p.x = Math.random() * w;
        }
        if (p.x < -p.r) p.x = w + p.r;
        if (p.x > w + p.r) p.x = -p.r;

        // Pulsing alpha
        const pulseAlpha = p.alpha * (0.7 + Math.sin(p.phase * 0.8) * 0.3);
        const finalAlpha = pulseAlpha * (0.7 + scrollIntensity * 0.5);

        // Color: mostly pale blue/teal, occasional coral accent
        let color: string;
        if (p.hue < 0.7) {
          // Pale blue / teal
          color = `rgba(180, 220, 240, ${finalAlpha})`;
        } else if (p.hue < 0.9) {
          // Muted teal
          color = `rgba(120, 180, 200, ${finalAlpha * 0.8})`;
        } else {
          // Faint coral accent
          color = `rgba(229, 75, 27, ${finalAlpha * 0.3})`;
        }

        // Soft radial gradient blob
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, color);
        grad.addColorStop(0.6, color.replace(/[\d.]+\)$/, `${finalAlpha * 0.3})`));
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Additional: faint vertical light streaks (god ray remnants through fog)
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 3; i++) {
        const x = w * (0.2 + i * 0.3) + Math.sin(t * 0.001 + i) * 30;
        const streakGrad = ctx.createLinearGradient(x, 0, x, h);
        const streakAlpha = 0.04 * scrollIntensity;
        streakGrad.addColorStop(0, `rgba(140, 200, 240, ${streakAlpha})`);
        streakGrad.addColorStop(0.5, `rgba(86, 160, 210, ${streakAlpha * 0.6})`);
        streakGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = streakGrad;
        ctx.fillRect(x - 40, 0, 80, h);
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
        height: "320px",
        marginTop: "-160px", // overlap with hero above
        marginBottom: "-160px", // overlap with content below
        pointerEvents: "none",
        zIndex: 5,
        // Feather the top and bottom edges so the fog container itself has no hard edges
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
