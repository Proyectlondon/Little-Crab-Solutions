"use client";

import { useEffect, useRef } from "react";

/**
 * OceanAmbient — fixed full-viewport canvas layered behind ALL content.
 *
 * Renders three effects:
 *  1. CAUSTICS — soft moving light pools on the "seabed" (the page bg).
 *     Implemented as sum of sine waves in a fragment shader-like approach
 *     using offscreen canvas + globalCompositeOperation.
 *  2. BUBBLES — small rising air bubbles from bottom to top, drifting
 *     sideways. Density is low to keep performance.
 *  3. RIPPLES — on pointer move, gentle radial waves emanate from the
 *     cursor position. Pointer "feels" like it's pushing through water.
 *
 * The canvas also reads pointer position and applies a subtle "magnetic"
 * pull to nearby bubbles — same vibe as the hero-only effect, but global.
 */
export default function OceanAmbient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Mouse position
    let mx = w / 2;
    let my = h / 2;
    let mxs = mx;
    let mys = my; // smoothed
    const ripples: { x: number; y: number; t: number }[] = [];

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (Math.random() < 0.04) {
        ripples.push({ x: mx, y: my, t: 0 });
        if (ripples.length > 8) ripples.shift();
      }
    };
    const onDown = (e: MouseEvent) => {
      ripples.push({ x: e.clientX, y: e.clientY, t: 0 });
      if (ripples.length > 8) ripples.shift();
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });

    // Bubbles — generated at bottom, rise to top
    const BUBBLE_COUNT = 28;
    const bubbles = Array.from({ length: BUBBLE_COUNT }).map(() => ({
      x: Math.random() * w,
      y: h + Math.random() * h,
      r: Math.random() * 4 + 1.5,
      vy: -(Math.random() * 0.7 + 0.35),
      vx: (Math.random() - 0.5) * 0.25,
      wob: Math.random() * Math.PI * 2,
      wobSpeed: Math.random() * 0.02 + 0.008,
    }));

    // Caustics parameters — sampled at low resolution for perf
    const CAUSTIC_RES = 1; // 1 = full size; we'll use larger cells via blur
    let t = 0;
    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Smooth mouse follow
      mxs += (mx - mxs) * 0.12;
      mys += (my - mys) * 0.12;

      // ========== CAUSTICS ==========
      // We render soft moving radial gradients as faux caustic light pools.
      ctx.globalCompositeOperation = "lighter";
      const causticCount = 6;
      for (let i = 0; i < causticCount; i++) {
        const phase = (i / causticCount) * Math.PI * 2;
        const cx =
          w * 0.5 +
          Math.cos(t * 0.0006 + phase) * w * 0.45 +
          Math.sin(t * 0.0009 + phase * 1.3) * w * 0.15;
        const cy =
          h * 0.5 +
          Math.sin(t * 0.0007 + phase * 1.1) * h * 0.45 +
          Math.cos(t * 0.0011 + phase * 0.7) * h * 0.12;
        const rad = 320 + Math.sin(t * 0.002 + phase) * 70;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        grad.addColorStop(0, "rgba(46, 110, 158, 0.32)");
        grad.addColorStop(0.4, "rgba(229, 75, 27, 0.14)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
      }

      // Soft caustic "lines" — sine-based overlay
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = "rgba(120, 180, 220, 0.10)";
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const yBase = (h / 5) * i + (h / 10);
        for (let x = 0; x <= w; x += 6) {
          const y =
            yBase +
            Math.sin(x * 0.008 + t * 0.0015 + i * 1.7) * 22 +
            Math.sin(x * 0.015 + t * 0.0022 + i) * 10;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Mouse "spotlight" caustic — pointer pushes light through water
      const mouseGrad = ctx.createRadialGradient(mxs, mys, 0, mxs, mys, 320);
      mouseGrad.addColorStop(0, "rgba(229, 75, 27, 0.28)");
      mouseGrad.addColorStop(0.4, "rgba(232, 185, 116, 0.10)");
      mouseGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = mouseGrad;
      ctx.fillRect(mxs - 320, mys - 320, 640, 640);

      // ========== RIPPLES ==========
      ctx.globalCompositeOperation = "lighter";
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.t += 1;
        const radius = r.t * 2.4;
        const alpha = Math.max(0, 0.55 - r.t * 0.012);
        if (alpha <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(180, 220, 240, ${alpha})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        // Inner softer ring
        ctx.strokeStyle = `rgba(229, 75, 27, ${alpha * 0.6})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius * 0.65, 0, Math.PI * 2);
        ctx.stroke();
      }

      // ========== BUBBLES ==========
      ctx.globalCompositeOperation = "lighter";
      for (const b of bubbles) {
        // Wobble + rise
        b.wob += b.wobSpeed;
        b.x += b.vx + Math.sin(b.wob) * 0.35;
        b.y += b.vy;

        // Magnetic attraction to mouse (subtle)
        const dx = mxs - b.x;
        const dy = mys - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 22000) {
          const f = 0.0012;
          b.vx += dx * f;
          b.vy += dy * f * 0.6;
        }
        // Damping
        b.vx *= 0.985;
        b.vy = b.vy * 0.99 - 0.0008;

        // Wrap
        if (b.y < -20) {
          b.y = h + 20;
          b.x = Math.random() * w;
          b.vy = -(Math.random() * 0.7 + 0.35);
          b.vx = (Math.random() - 0.5) * 0.25;
        }
        if (b.x < -20) b.x = w + 20;
        if (b.x > w + 20) b.x = -20;

        // Draw bubble — brighter for visibility on dark
        ctx.beginPath();
        ctx.fillStyle = "rgba(180, 220, 240, 0.18)";
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(220, 240, 250, 0.55)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
        // Highlight
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.arc(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.35, 0, Math.PI * 2);
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
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="ocean-ambient-canvas"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        // Behind all section content. Sections use semi-transparent backgrounds
        // so the ocean shows through subtly.
        zIndex: 0,
        opacity: 1,
      }}
    />
  );
}
