"use client";

import { useEffect, useRef } from "react";

/**
 * OceanAmbient — fixed full-viewport canvas layered behind ALL content.
 *
 * Effects (in render order):
 *  1. DEPTH GRADIENT — vertical blue gradient suggesting water depth (lighter top, darker bottom)
 *  2. GOD RAYS — soft vertical light shafts descending from the surface (volumetric)
 *  3. CAUSTICS — soft moving radial light pools on the "seabed"
 *  4. WAVE LINES — sine-based horizontal wave overlays
 *  5. MOUSE SPOTLIGHT — coral+blue glow following cursor
 *  6. RIPPLES — concentric rings emanating from clicks/mouse moves
 *  7. BUBBLES — rising air bubbles with mouse attraction
 *
 * Color palette leans blue (ocean) with subtle coral accents (Little Crab brand).
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
    let mys = my;
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
    const BUBBLE_COUNT = 24;
    const bubbles = Array.from({ length: BUBBLE_COUNT }).map(() => ({
      x: Math.random() * w,
      y: h + Math.random() * h,
      r: Math.random() * 3.5 + 1.2,
      vy: -(Math.random() * 0.6 + 0.3),
      vx: (Math.random() - 0.5) * 0.2,
      wob: Math.random() * Math.PI * 2,
      wobSpeed: Math.random() * 0.02 + 0.008,
    }));

    // God ray sources (fixed positions at the top, with subtle sway)
    const RAY_COUNT = 7;
    const rays = Array.from({ length: RAY_COUNT }).map((_, i) => ({
      xRatio: 0.1 + (i / (RAY_COUNT - 1)) * 0.8, // spread across width
      widthBase: 80 + Math.random() * 60,
      phase: Math.random() * Math.PI * 2,
      swaySpeed: 0.0003 + Math.random() * 0.0002,
      intensity: 0.06 + Math.random() * 0.05,
    }));

    let t = 0;
    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Smooth mouse follow
      mxs += (mx - mxs) * 0.12;
      mys += (my - mys) * 0.12;

      // ========== 1. DEPTH GRADIENT (vertical blue gradient for depth) ==========
      // Lighter blue at top (surface), darker at bottom (deep)
      ctx.globalCompositeOperation = "source-over";
      const depthGrad = ctx.createLinearGradient(0, 0, 0, h);
      depthGrad.addColorStop(0, "rgba(20, 54, 79, 0.45)");     // ocean-deep blue at top
      depthGrad.addColorStop(0.4, "rgba(12, 38, 58, 0.25)");   // mid
      depthGrad.addColorStop(0.7, "rgba(7, 20, 32, 0.15)");    // darker
      depthGrad.addColorStop(1, "rgba(3, 10, 18, 0.4)");       // abyss at bottom
      ctx.fillStyle = depthGrad;
      ctx.fillRect(0, 0, w, h);

      // ========== 2. GOD RAYS (volumetric light shafts from surface) ==========
      ctx.globalCompositeOperation = "lighter";
      for (const ray of rays) {
        const swayX = Math.sin(t * ray.swaySpeed + ray.phase) * 40;
        const rayX = w * ray.xRatio + swayX;
        const rayWidth = ray.widthBase + Math.sin(t * 0.001 + ray.phase) * 20;
        // Taper: wider at top, narrower at bottom
        const topW = rayWidth * 1.2;
        const bottomW = rayWidth * 0.4;

        // Draw the ray as a vertical gradient trapezoid
        const rayGrad = ctx.createLinearGradient(0, 0, 0, h);
        rayGrad.addColorStop(0, `rgba(140, 200, 240, ${ray.intensity})`);     // bright at surface
        rayGrad.addColorStop(0.5, `rgba(86, 160, 210, ${ray.intensity * 0.5})`);
        rayGrad.addColorStop(1, "rgba(46, 110, 158, 0)");                      // fade at bottom

        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(rayX - topW / 2, 0);
        ctx.lineTo(rayX + topW / 2, 0);
        ctx.lineTo(rayX + bottomW / 2, h);
        ctx.lineTo(rayX - bottomW / 2, h);
        ctx.closePath();
        ctx.fill();
      }

      // ========== 3. CAUSTICS (soft moving radial light pools) ==========
      ctx.globalCompositeOperation = "lighter";
      const causticCount = 5;
      for (let i = 0; i < causticCount; i++) {
        const phase = (i / causticCount) * Math.PI * 2;
        const cx =
          w * 0.5 +
          Math.cos(t * 0.0006 + phase) * w * 0.45 +
          Math.sin(t * 0.0009 + phase * 1.3) * w * 0.15;
        const cy =
          h * 0.4 +
          Math.sin(t * 0.0007 + phase * 1.1) * h * 0.35 +
          Math.cos(t * 0.0011 + phase * 0.7) * h * 0.1;
        const rad = 280 + Math.sin(t * 0.002 + phase) * 60;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        // More blue, less coral — subtle accent only
        const isBlue = i % 2 === 0;
        grad.addColorStop(0, isBlue ? "rgba(46, 110, 158, 0.32)" : "rgba(86, 160, 210, 0.28)");
        grad.addColorStop(0.5, "rgba(229, 75, 27, 0.06)"); // very subtle coral accent
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
      }

      // ========== 4. WAVE LINES (sine-based horizontal overlays) ==========
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = "rgba(120, 180, 220, 0.08)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const yBase = (h / 5) * i + (h / 10);
        for (let x = 0; x <= w; x += 8) {
          const y =
            yBase +
            Math.sin(x * 0.006 + t * 0.0012 + i * 1.7) * 20 +
            Math.sin(x * 0.013 + t * 0.0018 + i) * 8;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // ========== 5. MOUSE SPOTLIGHT (coral + blue glow) ==========
      const mouseGrad = ctx.createRadialGradient(mxs, mys, 0, mxs, mys, 300);
      mouseGrad.addColorStop(0, "rgba(229, 75, 27, 0.22)");
      mouseGrad.addColorStop(0.35, "rgba(86, 160, 210, 0.16)");
      mouseGrad.addColorStop(0.7, "rgba(46, 110, 158, 0.06)");
      mouseGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = mouseGrad;
      ctx.fillRect(mxs - 300, mys - 300, 600, 600);

      // ========== 6. RIPPLES ==========
      ctx.globalCompositeOperation = "lighter";
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.t += 1;
        const radius = r.t * 2.2;
        const alpha = Math.max(0, 0.45 - r.t * 0.011);
        if (alpha <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(140, 200, 240, ${alpha})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        // Inner softer ring with coral tint
        ctx.strokeStyle = `rgba(229, 75, 27, ${alpha * 0.4})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius * 0.6, 0, Math.PI * 2);
        ctx.stroke();
      }

      // ========== 7. BUBBLES ==========
      ctx.globalCompositeOperation = "lighter";
      for (const b of bubbles) {
        b.wob += b.wobSpeed;
        b.x += b.vx + Math.sin(b.wob) * 0.3;
        b.y += b.vy;

        // Magnetic attraction to mouse (subtle)
        const dx = mxs - b.x;
        const dy = mys - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 20000) {
          const f = 0.001;
          b.vx += dx * f;
          b.vy += dy * f * 0.5;
        }
        b.vx *= 0.985;
        b.vy = b.vy * 0.99 - 0.0006;

        // Wrap
        if (b.y < -20) {
          b.y = h + 20;
          b.x = Math.random() * w;
          b.vy = -(Math.random() * 0.6 + 0.3);
          b.vx = (Math.random() - 0.5) * 0.2;
        }
        if (b.x < -20) b.x = w + 20;
        if (b.x > w + 20) b.x = -20;

        // Draw bubble — ocean blue tint
        ctx.beginPath();
        ctx.fillStyle = "rgba(140, 200, 240, 0.18)";
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(180, 220, 250, 0.55)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
        // Highlight
        ctx.beginPath();
        ctx.fillStyle = "rgba(220, 240, 255, 0.7)";
        ctx.arc(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.3, 0, Math.PI * 2);
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
        // z-index 0, no blend mode — the canvas paints directly on top of the body bg.
        // Sections are transparent so the ocean shows through.
        zIndex: 0,
        opacity: 1,
      }}
    />
  );
}
