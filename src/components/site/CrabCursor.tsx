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
 * The SVG viewBox has generous padding around the crab so that
 * rotations, tilts, and walk animations never clip the artwork.
 */

// SVG dimensions — larger than the crab artwork to prevent clipping
const SVG_W = 56;
const SVG_H = 52;
// Offset to center the crab in the larger viewBox (crab was designed for 48x44)
const OX = 4;
const OY = 4;

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

      // Subtle body tilt on vertical movement (reduced to avoid clipping)
      const tilt = Math.max(-6, Math.min(6, dy * 0.4));

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
        width: SVG_W,
        height: SVG_H,
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
  const OUTLINE = "#0A2E38";      // dark outline
  const EYE = "#0A0E14";          // eye black
  const EYE_WHITE = "#FFFFFF";    // eye highlight

  // All crab coordinates are offset by (OX, OY) to center in the larger viewBox
  const o = (n: number) => n + OX;
  const oy = (n: number) => n + OY;

  return (
    <svg
      width={SVG_W}
      height={SVG_H}
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left claw group - rotates on snap */}
      <g ref={leftClawRef} className="claw-left" style={{ transformOrigin: `${o(11)}px ${oy(18)}px` }}>
        {/* Claw arm */}
        <path
          d={`M${o(11)} ${oy(18)} Q${o(6)} ${oy(16)} ${o(4)} ${oy(12)} Q${o(2)} ${oy(8)} ${o(6)} ${oy(6)} Q${o(10)} ${oy(4)} ${o(13)} ${oy(8)}`}
          stroke={OUTLINE}
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Claw pincer (upper) */}
        <path
          d={`M${o(4)} ${oy(8)} Q${o(2)} ${oy(4)} ${o(6)} ${oy(3)} Q${o(10)} ${oy(3)} ${o(11)} ${oy(7)} Q${o(10)} ${oy(9)} ${o(7)} ${oy(9)} Q${o(5)} ${oy(9)} ${o(4)} ${oy(8)} Z`}
          fill={CLAW}
          stroke={OUTLINE}
          strokeWidth="1.1"
        />
        {/* Claw pincer (lower) */}
        <path
          d={`M${o(6)} ${oy(10)} Q${o(4)} ${oy(13)} ${o(8)} ${oy(14)} Q${o(12)} ${oy(14)} ${o(12)} ${oy(11)} Q${o(11)} ${oy(9)} ${o(9)} ${oy(9)} Q${o(7)} ${oy(9)} ${o(6)} ${oy(10)} Z`}
          fill={CLAW}
          stroke={OUTLINE}
          strokeWidth="1.1"
        />
        {/* Claw highlight */}
        <ellipse cx={o(7)} cy={oy(6)} rx="1.5" ry="0.8" fill={CLAW_LIGHT} opacity="0.7" />
      </g>

      {/* Right claw group - mirrors left */}
      <g ref={rightClawRef} className="claw-right" style={{ transformOrigin: `${o(37)}px ${oy(18)}px` }}>
        <path
          d={`M${o(37)} ${oy(18)} Q${o(42)} ${oy(16)} ${o(44)} ${oy(12)} Q${o(46)} ${oy(8)} ${o(42)} ${oy(6)} Q${o(38)} ${oy(4)} ${o(35)} ${oy(8)}`}
          stroke={OUTLINE}
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={`M${o(44)} ${oy(8)} Q${o(46)} ${oy(4)} ${o(42)} ${oy(3)} Q${o(38)} ${oy(3)} ${o(37)} ${oy(7)} Q${o(38)} ${oy(9)} ${o(41)} ${oy(9)} Q${o(43)} ${oy(9)} ${o(44)} ${oy(8)} Z`}
          fill={CLAW}
          stroke={OUTLINE}
          strokeWidth="1.1"
        />
        <path
          d={`M${o(42)} ${oy(10)} Q${o(44)} ${oy(13)} ${o(40)} ${oy(14)} Q${o(36)} ${oy(14)} ${o(36)} ${oy(11)} Q${o(37)} ${oy(9)} ${o(39)} ${oy(9)} Q${o(41)} ${oy(9)} ${o(42)} ${oy(10)} Z`}
          fill={CLAW}
          stroke={OUTLINE}
          strokeWidth="1.1"
        />
        <ellipse cx={o(41)} cy={oy(6)} rx="1.5" ry="0.8" fill={CLAW_LIGHT} opacity="0.7" />
      </g>

      {/* Legs group - wiggles when walking */}
      <g ref={legsRef} className="legs" style={{ transformOrigin: `${o(24)}px ${oy(28)}px` }}>
        <g className="leg-left" style={{ transformOrigin: `${o(24)}px ${oy(28)}px` }}>
          <path d={`M${o(16)} ${oy(28)} Q${o(12)} ${oy(32)} ${o(10)} ${oy(38)}`} stroke={OUTLINE} strokeWidth="1.3" strokeLinecap="round" fill="none" />
          <path d={`M${o(19)} ${oy(30)} Q${o(15)} ${oy(34)} ${o(13)} ${oy(40)}`} stroke={OUTLINE} strokeWidth="1.3" strokeLinecap="round" fill="none" />
          <path d={`M${o(22)} ${oy(31)} Q${o(19)} ${oy(35)} ${o(17)} ${oy(41)}`} stroke={OUTLINE} strokeWidth="1.3" strokeLinecap="round" fill="none" />
        </g>
        <g className="leg-right" style={{ transformOrigin: `${o(24)}px ${oy(28)}px` }}>
          <path d={`M${o(32)} ${oy(28)} Q${o(36)} ${oy(32)} ${o(38)} ${oy(38)}`} stroke={OUTLINE} strokeWidth="1.3" strokeLinecap="round" fill="none" />
          <path d={`M${o(29)} ${oy(30)} Q${o(33)} ${oy(34)} ${o(35)} ${oy(40)}`} stroke={OUTLINE} strokeWidth="1.3" strokeLinecap="round" fill="none" />
          <path d={`M${o(26)} ${oy(31)} Q${o(29)} ${oy(35)} ${o(31)} ${oy(41)}`} stroke={OUTLINE} strokeWidth="1.3" strokeLinecap="round" fill="none" />
        </g>
      </g>

      {/* Body / shell */}
      <g ref={bodyRef} className="body">
        {/* Main shell */}
        <ellipse
          cx={o(24)}
          cy={oy(24)}
          rx="13"
          ry="10"
          fill={SHELL}
          stroke={OUTLINE}
          strokeWidth="1.4"
        />
        {/* Shell highlight (top) */}
        <ellipse
          cx={o(21)}
          cy={oy(20)}
          rx="5"
          ry="3"
          fill={SHELL_LIGHT}
          opacity="0.7"
        />
        {/* Shell shadow (bottom) */}
        <path
          d={`M${o(13)} ${oy(26)} Q${o(24)} ${oy(32)} ${o(35)} ${oy(26)} Q${o(33)} ${oy(30)} ${o(24)} ${oy(31)} Q${o(15)} ${oy(30)} ${o(13)} ${oy(26)} Z`}
          fill={SHELL_DARK}
          opacity="0.5"
        />
        {/* Shell texture lines */}
        <path d={`M${o(18)} ${oy(18)} Q${o(20)} ${oy(16)} ${o(22)} ${oy(18)}`} stroke={SHELL_DARK} strokeWidth="0.6" fill="none" opacity="0.4" />
        <path d={`M${o(26)} ${oy(18)} Q${o(28)} ${oy(16)} ${o(30)} ${oy(18)}`} stroke={SHELL_DARK} strokeWidth="0.6" fill="none" opacity="0.4" />
      </g>

      {/* Eyes on stalks */}
      <g className="eyes">
        {/* Left eye stalk */}
        <line x1={o(20)} y1={oy(16)} x2={o(18)} y2={oy(11)} stroke={OUTLINE} strokeWidth="1.3" strokeLinecap="round" />
        <circle cx={o(18)} cy={oy(10)} r="2.2" fill={EYE} stroke={OUTLINE} strokeWidth="0.8" />
        <circle cx={o(18.6)} cy={oy(9.4)} r="0.7" fill={EYE_WHITE} />

        {/* Right eye stalk */}
        <line x1={o(28)} y1={oy(16)} x2={o(30)} y2={oy(11)} stroke={OUTLINE} strokeWidth="1.3" strokeLinecap="round" />
        <circle cx={o(30)} cy={oy(10)} r="2.2" fill={EYE} stroke={OUTLINE} strokeWidth="0.8" />
        <circle cx={o(30.6)} cy={oy(9.4)} r="0.7" fill={EYE_WHITE} />
      </g>

      {/* Mouth — smiles when snapping */}
      <path
        className="mouth"
        d={snapping ? `M${o(21)} ${oy(27)} Q${o(24)} ${oy(30)} ${o(27)} ${oy(27)}` : `M${o(22)} ${oy(27)} Q${o(24)} ${oy(28)} ${o(26)} ${oy(27)}`}
        stroke={OUTLINE}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        style={{ transition: "d 0.2s ease" }}
      />
    </svg>
  );
}
