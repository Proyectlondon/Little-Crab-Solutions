"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CrabCursor — hand-drawn SVG crab (teal body + orange claws).
 *
 * No external sprite assets. All animation is done via:
 *  - CSS transforms on SVG groups (claw snap, leg wiggle)
 *  - State machine: idle / walking / clicking
 *  - Horizontal flip based on movement direction
 *
 * Smaller, cleaner, more professional than the sprite version.
 */

export default function CrabCursor() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftClawRef = useRef<SVGGElement | null>(null);
  const rightClawRef = useRef<SVGGElement | null>(null);
  const legsRef = useRef<SVGGElement | null>(null);
  const bodyRef = useRef<SVGGElement | null>(null);

  const [hidden, setHidden] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: none), (pointer: coarse)").matches;
  });

  const [snapping, setSnapping] = useState(false);
  const [walking, setWalking] = useState(false);

  useEffect(() => {
    if (hidden) return;
    document.body.classList.add("has-custom-cursor");

    const container = containerRef.current!;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;
    let prevX = mx;
    let prevY = my;
    let raf = 0;
    let lastMoveTime = performance.now();
    let lastBubbleTime = 0;
    let walkTimeout: ReturnType<typeof setTimeout> | null = null;

    const bubbles: { x: number; y: number; r: number; vy: number; life: number }[] = [];

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      lastMoveTime = performance.now();
      setWalking(true);
      if (walkTimeout) clearTimeout(walkTimeout);
      walkTimeout = setTimeout(() => setWalking(false), 120);
    };

    const onDown = () => {
      setSnapping(true);
      // Create a ripple at click position
      if (leftClawRef.current && rightClawRef.current) {
        // Animation handled by CSS via state class
      }
    };

    const onUp = () => {
      setTimeout(() => setSnapping(false), 200);
    };

    const onLeave = () => { container.style.opacity = "0"; };
    const onEnter = () => { container.style.opacity = "1"; };

    const tick = (t: number) => {
      cx += (mx - cx) * 0.32;
      cy += (my - cy) * 0.32;

      const dx = mx - prevX;
      const dy = my - prevY;
      const speed = Math.hypot(dx, dy);

      // Flip based on horizontal direction
      if (Math.abs(dx) > 0.6) {
        const facing = dx > 0 ? 1 : -1;
        container.style.setProperty("--facing", facing.toString());
      }

      // Subtle body tilt on vertical movement
      const tilt = Math.max(-10, Math.min(10, dy * 0.6));

      prevX = mx;
      prevY = my;

      // Bubble trail
      if (t - lastBubbleTime > 140 && speed > 2.5) {
        bubbles.push({
          x: cx + (Math.random() - 0.5) * 8,
          y: cy + 4,
          r: Math.random() * 1.8 + 0.8,
          vy: -(Math.random() * 0.4 + 0.3),
          life: 1,
        });
        lastBubbleTime = t;
        if (bubbles.length > 8) bubbles.shift();
      }

      const layer = document.getElementById("crab-bubble-layer");
      if (layer) {
        let html = "";
        for (const b of bubbles) {
          b.y += b.vy;
          b.life -= 0.016;
          if (b.life <= 0) continue;
          html += `<div style="position:fixed;left:${b.x}px;top:${b.y}px;width:${b.r * 2}px;height:${b.r * 2}px;border-radius:50%;background:radial-gradient(circle at 30% 30%, rgba(220,240,255,0.9), rgba(140,200,240,0.2));pointer-events:none;opacity:${b.life * 0.6};transform:translate(-50%,-50%);z-index:9997;mix-blend-mode:screen;"></div>`;
        }
        layer.innerHTML = html;
        for (let i = bubbles.length - 1; i >= 0; i--) {
          if (bubbles[i].life <= 0) bubbles.splice(i, 1);
        }
      }

      container.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%) rotate(${tilt}deg) scaleX(var(--facing, 1))`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const layer = document.createElement("div");
    layer.id = "crab-bubble-layer";
    layer.style.position = "fixed";
    layer.style.inset = "0";
    layer.style.pointerEvents = "none";
    layer.style.zIndex = "9997";
    document.body.appendChild(layer);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      if (walkTimeout) clearTimeout(walkTimeout);
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
      ref={containerRef}
      className={`crab-cursor-svg ${snapping ? "snapping" : ""} ${walking ? "walking" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 48,
        height: 44,
        pointerEvents: "none",
        zIndex: 9999,
        willChange: "transform",
        filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 4px rgba(46, 110, 158, 0.25))",
        transition: "opacity 0.3s ease",
        "--facing": "1",
      } as React.CSSProperties}
      aria-hidden
    >
      <CrabSVG
        leftClawRef={leftClawRef}
        rightClawRef={rightClawRef}
        legsRef={legsRef}
        bodyRef={bodyRef}
        snapping={snapping}
      />
    </div>
  );
}

function CrabSVG({
  leftClawRef,
  rightClawRef,
  legsRef,
  bodyRef,
  snapping,
}: {
  leftClawRef: React.RefObject<SVGGElement | null>;
  rightClawRef: React.RefObject<SVGGElement | null>;
  legsRef: React.RefObject<SVGGElement | null>;
  bodyRef: React.RefObject<SVGGElement | null>;
  snapping: boolean;
}) {
  // Color palette matching the user's logo
  const SHELL = "#1E8B9F";        // teal body
  const SHELL_LIGHT = "#3FB3C7";  // highlight
  const SHELL_DARK = "#0F5A6B";   // shadow
  const CLAW = "#E54B1B";         // orange claws
  const CLAW_LIGHT = "#FF7A4D";   // claw highlight
  const CLAW_DARK = "#9C2A0E";    // claw shadow
  const OUTLINE = "#0A2E38";      // dark outline
  const EYE = "#0A0E14";          // eye black
  const EYE_WHITE = "#FFFFFF";    // eye highlight

  return (
    <svg
      width="48"
      height="44"
      viewBox="0 0 48 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left claw group - rotates on snap */}
      <g ref={leftClawRef} className="claw-left" style={{ transformOrigin: "11px 18px" }}>
        {/* Claw arm */}
        <path
          d="M11 18 Q6 16 4 12 Q2 8 6 6 Q10 4 13 8"
          stroke={OUTLINE}
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Claw pincer (upper) */}
        <path
          d="M4 8 Q2 4 6 3 Q10 3 11 7 Q10 9 7 9 Q5 9 4 8 Z"
          fill={CLAW}
          stroke={OUTLINE}
          strokeWidth="1.1"
        />
        {/* Claw pincer (lower) */}
        <path
          d="M6 10 Q4 13 8 14 Q12 14 12 11 Q11 9 9 9 Q7 9 6 10 Z"
          fill={CLAW}
          stroke={OUTLINE}
          strokeWidth="1.1"
        />
        {/* Claw highlight */}
        <ellipse cx="7" cy="6" rx="1.5" ry="0.8" fill={CLAW_LIGHT} opacity="0.7" />
      </g>

      {/* Right claw group - mirrors left */}
      <g ref={rightClawRef} className="claw-right" style={{ transformOrigin: "37px 18px" }}>
        <path
          d="M37 18 Q42 16 44 12 Q46 8 42 6 Q38 4 35 8"
          stroke={OUTLINE}
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M44 8 Q46 4 42 3 Q38 3 37 7 Q38 9 41 9 Q43 9 44 8 Z"
          fill={CLAW}
          stroke={OUTLINE}
          strokeWidth="1.1"
        />
        <path
          d="M42 10 Q44 13 40 14 Q36 14 36 11 Q37 9 39 9 Q41 9 42 10 Z"
          fill={CLAW}
          stroke={OUTLINE}
          strokeWidth="1.1"
        />
        <ellipse cx="41" cy="6" rx="1.5" ry="0.8" fill={CLAW_LIGHT} opacity="0.7" />
      </g>

      {/* Legs group - wiggles when walking */}
      <g ref={legsRef} className="legs" style={{ transformOrigin: "24px 28px" }}>
        <g className="leg-left" style={{ transformOrigin: "24px 28px" }}>
          <path d="M16 28 Q12 32 10 38" stroke={OUTLINE} strokeWidth="1.3" strokeLinecap="round" fill="none" />
          <path d="M19 30 Q15 34 13 40" stroke={OUTLINE} strokeWidth="1.3" strokeLinecap="round" fill="none" />
          <path d="M22 31 Q19 35 17 41" stroke={OUTLINE} strokeWidth="1.3" strokeLinecap="round" fill="none" />
        </g>
        <g className="leg-right" style={{ transformOrigin: "24px 28px" }}>
          <path d="M32 28 Q36 32 38 38" stroke={OUTLINE} strokeWidth="1.3" strokeLinecap="round" fill="none" />
          <path d="M29 30 Q33 34 35 40" stroke={OUTLINE} strokeWidth="1.3" strokeLinecap="round" fill="none" />
          <path d="M26 31 Q29 35 31 41" stroke={OUTLINE} strokeWidth="1.3" strokeLinecap="round" fill="none" />
        </g>
      </g>

      {/* Body / shell */}
      <g ref={bodyRef} className="body">
        {/* Main shell */}
        <ellipse
          cx="24"
          cy="24"
          rx="13"
          ry="10"
          fill={SHELL}
          stroke={OUTLINE}
          strokeWidth="1.4"
        />
        {/* Shell highlight (top) */}
        <ellipse
          cx="21"
          cy="20"
          rx="5"
          ry="3"
          fill={SHELL_LIGHT}
          opacity="0.7"
        />
        {/* Shell shadow (bottom) */}
        <path
          d="M13 26 Q24 32 35 26 Q33 30 24 31 Q15 30 13 26 Z"
          fill={SHELL_DARK}
          opacity="0.5"
        />
        {/* Shell texture lines */}
        <path d="M18 18 Q20 16 22 18" stroke={SHELL_DARK} strokeWidth="0.6" fill="none" opacity="0.4" />
        <path d="M26 18 Q28 16 30 18" stroke={SHELL_DARK} strokeWidth="0.6" fill="none" opacity="0.4" />
      </g>

      {/* Eyes on stalks */}
      <g className="eyes">
        {/* Left eye stalk */}
        <line x1="20" y1="16" x2="18" y2="11" stroke={OUTLINE} strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="18" cy="10" r="2.2" fill={EYE} stroke={OUTLINE} strokeWidth="0.8" />
        <circle cx="18.6" cy="9.4" r="0.7" fill={EYE_WHITE} />

        {/* Right eye stalk */}
        <line x1="28" y1="16" x2="30" y2="11" stroke={OUTLINE} strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="30" cy="10" r="2.2" fill={EYE} stroke={OUTLINE} strokeWidth="0.8" />
        <circle cx="30.6" cy="9.4" r="0.7" fill={EYE_WHITE} />
      </g>

      {/* Mouth — smiles when snapping */}
      <path
        className="mouth"
        d={snapping ? "M21 27 Q24 30 27 27" : "M22 27 Q24 28 26 27"}
        stroke={OUTLINE}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        style={{ transition: "d 0.2s ease" }}
      />
    </svg>
  );
}
