"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Crab-shaped custom cursor.
 * - Body follows pointer with slight lag
 * - Eyes blink occasionally
 * - Claws SNAP (close) on mousedown, reopen on mouseup
 * - Tiny air bubbles trail the crab
 * - Rotates slightly based on movement direction
 */
export default function CrabCursor() {
  const crabRef = useRef<HTMLDivElement | null>(null);
  const [snapping, setSnapping] = useState(false);

  // Detect touch / coarse pointer synchronously on first render
  const [hidden, setHidden] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: none), (pointer: coarse)").matches;
  });

  useEffect(() => {
    if (hidden) return;
    document.body.classList.add("has-custom-cursor");

    const crab = crabRef.current!;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;
    let prevX = mx;
    let prevY = my;
    let angle = 0;
    let raf = 0;
    let lastBubble = 0;

    const bubbles: { x: number; y: number; r: number; vy: number; life: number }[] = [];

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const tick = (t: number) => {
      // Smooth follow
      cx += (mx - cx) * 0.22;
      cy += (my - cy) * 0.22;

      // Direction-based rotation (subtle)
      const dx = mx - prevX;
      const dy = my - prevY;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        const target = Math.atan2(dy, dx) * (180 / Math.PI);
        // Crab faces right by default; rotate body to face movement
        // We clamp rotation to avoid flipping upside-down
        angle = target;
      }
      prevX = mx;
      prevY = my;

      // Emit bubble trail occasionally
      if (t - lastBubble > 90 && Math.hypot(dx, dy) > 1.5) {
        bubbles.push({
          x: cx + (Math.random() - 0.5) * 12,
          y: cy + 4,
          r: Math.random() * 3 + 1.2,
          vy: -(Math.random() * 0.6 + 0.4),
          life: 1,
        });
        lastBubble = t;
        if (bubbles.length > 14) bubbles.shift();
      }

      // Update + render bubbles via CSS variables on the container
      const container = crab.parentElement!;
      // Use a single data attribute for the bubble layer to render
      const bubbleHtml = bubbles
        .map((b, i) => {
          b.y += b.vy;
          b.life -= 0.012;
          if (b.life <= 0) return "";
          const left = b.x;
          const top = b.y;
          return `<div data-bubble="${i}" style="position:fixed;left:${left}px;top:${top}px;width:${b.r * 2}px;height:${b.r * 2}px;border-radius:50%;background:radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85), rgba(180,210,230,0.25));pointer-events:none;opacity:${b.life * 0.7};transform:translate(-50%,-50%);z-index:9997;mix-blend-mode:screen;"></div>`;
        })
        .join("");
      const existingLayer = document.getElementById("crab-bubble-layer");
      if (existingLayer) {
        existingLayer.innerHTML = bubbleHtml;
      }
      // Prune dead bubbles
      for (let i = bubbles.length - 1; i >= 0; i--) {
        if (bubbles[i].life <= 0) bubbles.splice(i, 1);
      }

      // Apply transform — clamp rotation to ±35deg so the crab never flips
      const clampedAngle = Math.max(-35, Math.min(35, angle));
      crab.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%) rotate(${clampedAngle}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Bubble layer
    const layer = document.createElement("div");
    layer.id = "crab-bubble-layer";
    layer.style.position = "fixed";
    layer.style.inset = "0";
    layer.style.pointerEvents = "none";
    layer.style.zIndex = "9997";
    document.body.appendChild(layer);

    const onDown = () => setSnapping(true);
    const onUp = () => setSnapping(false);
    const onLeave = () => { crab.style.opacity = "0"; };
    const onEnter = () => { crab.style.opacity = "1"; };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      layer.remove();
      document.body.classList.remove("has-custom-cursor");
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <div
      ref={crabRef}
      className="crab-cursor"
      style={{ opacity: hidden ? 0 : 1 }}
      aria-hidden
    >
      <CrabSVG snapping={snapping} />
    </div>
  );
}

function CrabSVG({ snapping }: { snapping: boolean }) {
  return (
    <svg
      width="44"
      height="40"
      viewBox="0 0 64 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left claw */}
      <g
        className="crab-claw crab-claw-left"
        style={{ transformOrigin: "16px 22px" }}
      >
        <path
          d="M6 22 Q2 14 8 10 Q14 6 20 12 L18 18 Q14 16 12 20 Z"
          fill="#E54B1B"
          stroke="#7A1E0A"
          strokeWidth="1.2"
        />
        {/* Claw pincer — closes on snap */}
        <path
          className="crab-pincer-left"
          d={
            snapping
              ? "M8 10 Q14 10 18 18"
              : "M8 10 Q10 4 18 6"
          }
          stroke="#7A1E0A"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          style={{ transition: "d 0.18s ease" }}
        />
      </g>

      {/* Right claw */}
      <g
        className="crab-claw crab-claw-right"
        style={{ transformOrigin: "48px 22px" }}
      >
        <path
          d="M58 22 Q62 14 56 10 Q50 6 44 12 L46 18 Q50 16 52 20 Z"
          fill="#E54B1B"
          stroke="#7A1E0A"
          strokeWidth="1.2"
        />
        <path
          className="crab-pincer-right"
          d={
            snapping
              ? "M56 10 Q50 10 46 18"
              : "M56 10 Q54 4 46 6"
          }
          stroke="#7A1E0A"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          style={{ transition: "d 0.18s ease" }}
        />
      </g>

      {/* Body */}
      <ellipse
        cx="32"
        cy="30"
        rx="18"
        ry="13"
        fill="#E54B1B"
        stroke="#7A1E0A"
        strokeWidth="1.5"
      />
      {/* Body highlight */}
      <ellipse
        cx="28"
        cy="26"
        rx="6"
        ry="3"
        fill="#FF8866"
        opacity="0.7"
      />

      {/* Legs (3 each side) */}
      <g stroke="#7A1E0A" strokeWidth="1.5" strokeLinecap="round" fill="none">
        <path d="M18 36 Q14 42 16 48" />
        <path d="M24 40 Q22 46 22 52" />
        <path d="M32 42 Q32 48 30 54" />
        <path d="M46 36 Q50 42 48 48" />
        <path d="M40 40 Q42 46 42 52" />
      </g>

      {/* Eyes */}
      <g className="crab-eyes">
        <line x1="28" y1="20" x2="26" y2="14" stroke="#7A1E0A" strokeWidth="1.4" />
        <line x1="36" y1="20" x2="38" y2="14" stroke="#7A1E0A" strokeWidth="1.4" />
        <circle cx="26" cy="13" r="2.5" fill="#0C1116" />
        <circle cx="38" cy="13" r="2.5" fill="#0C1116" />
        <circle cx="26.6" cy="12.4" r="0.8" fill="#fff" />
        <circle cx="38.6" cy="12.4" r="0.8" fill="#fff" />
      </g>

      {/* Mouth — smiles when snapping (snapping = happy) */}
      <path
        d={snapping ? "M28 34 Q32 38 36 34" : "M29 34 Q32 36 35 34"}
        stroke="#7A1E0A"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        style={{ transition: "d 0.2s ease" }}
      />
    </svg>
  );
}
