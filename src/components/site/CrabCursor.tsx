"use client";

import { useEffect, useRef, useState } from "react";

type Frame = "idle" | "walk" | "click-mid" | "click-snap";

/**
 * Sprite-based CrabCursor — professional version.
 *
 * Uses 4 hand-picked, cleanly-cropped, defringed crab sprites.
 * Smaller size (52×48) for a refined, non-intrusive cursor.
 *
 * States:
 *  - IDLE    → static idle frame (claws open, neutral)
 *  - WALKING → cycles idle ↔ walk every 130ms (subtle claw shimmer)
 *  - CLICK   → click-mid (claws mid-closing) → click-snap (claws closed)
 *
 * The crab flips horizontally based on movement direction.
 *
 * Sprite sheet layout (4 frames, 52px wide each):
 *  [0] idle  [1] walk  [2] click-mid  [3] click-snap
 */
const FRAME_INDEX: Record<Frame, number> = {
  idle: 0,
  walk: 1,
  "click-mid": 2,
  "click-snap": 3,
};

const FRAME_W = 50;
const FRAME_H = 54;
const FRAME_COUNT = 4;

export default function CrabCursor() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [hidden, setHidden] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: none), (pointer: coarse)").matches;
  });

  useEffect(() => {
    if (hidden) return;
    document.body.classList.add("has-custom-cursor");

    const container = containerRef.current!;
    const img = imgRef.current!;

    // Pointer tracking
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;
    let prevX = mx;
    let prevY = my;
    let raf = 0;

    // State machine
    let frame: Frame = "idle";
    let facing: 1 | -1 = 1;
    let lastMoveTime = performance.now();
    let isClicking = false;
    let clickFrameTime = 0;
    let walkFrameTime = 0;
    let lastBubbleTime = 0;

    // Bubble trail
    const bubbles: { x: number; y: number; r: number; vy: number; life: number }[] = [];

    const applyFrame = (f: Frame, flip: 1 | -1) => {
      const idx = FRAME_INDEX[f];
      img.style.transform = `translateX(${-idx * FRAME_W}px) scaleX(${flip})`;
    };

    applyFrame(frame, facing);

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      lastMoveTime = performance.now();
    };

    const onDown = () => {
      isClicking = true;
      clickFrameTime = performance.now();
      frame = "click-mid";
      applyFrame(frame, facing);
    };

    const onUp = () => {
      isClicking = false;
      setTimeout(() => {
        if (!isClicking) {
          frame = "idle";
          applyFrame(frame, facing);
        }
      }, 150);
    };

    const onLeave = () => { container.style.opacity = "0"; };
    const onEnter = () => { container.style.opacity = "1"; };

    const tick = (t: number) => {
      // Smooth follow
      cx += (mx - cx) * 0.32;
      cy += (my - cy) * 0.32;

      const dx = mx - prevX;
      const dy = my - prevY;
      const speed = Math.hypot(dx, dy);
      const now = t;

      // Determine facing based on horizontal movement
      if (Math.abs(dx) > 0.6) {
        facing = dx > 0 ? 1 : -1;
      }

      // State transitions
      if (isClicking) {
        // Click animation: click-mid for 70ms, then click-snap for 180ms
        const elapsed = now - clickFrameTime;
        if (elapsed > 70 && frame !== "click-snap") {
          frame = "click-snap";
          applyFrame(frame, facing);
        }
      } else {
        // Walking vs idle
        const timeSinceMove = now - lastMoveTime;
        if (speed > 1.2 && timeSinceMove < 90) {
          // Walking — cycle idle/walk every 130ms
          if (now - walkFrameTime > 130) {
            walkFrameTime = now;
            frame = frame === "idle" ? "walk" : "idle";
            applyFrame(frame, facing);
          }
        } else {
          // Idle
          if (frame !== "idle") {
            frame = "idle";
            applyFrame(frame, facing);
          }
        }
      }

      prevX = mx;
      prevY = my;

      // Emit bubble trail when moving (less frequent, smaller)
      if (now - lastBubbleTime > 140 && speed > 2.5) {
        bubbles.push({
          x: cx + (Math.random() - 0.5) * 8,
          y: cy + 4,
          r: Math.random() * 1.8 + 0.8,
          vy: -(Math.random() * 0.4 + 0.3),
          life: 1,
        });
        lastBubbleTime = now;
        if (bubbles.length > 8) bubbles.shift();
      }

      // Render bubbles
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

      // Apply container transform
      const tilt = Math.max(-8, Math.min(8, dy * 0.6));
      container.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%) rotate(${tilt}deg)`;

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
      ref={containerRef}
      className="crab-cursor"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: FRAME_W,
        height: FRAME_H,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 9999,
        willChange: "transform",
        filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 4px rgba(229, 75, 27, 0.2))",
        transition: "opacity 0.3s ease",
      }}
      aria-hidden
    >
      <img
        ref={imgRef}
        src="/crab/sprite-sheet.png"
        alt=""
        width={FRAME_W * FRAME_COUNT}
        height={FRAME_H}
        style={{
          display: "block",
          imageRendering: "auto",
          maxWidth: "none",
        }}
        draggable={false}
      />
    </div>
  );
}
