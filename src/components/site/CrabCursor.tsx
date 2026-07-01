"use client";

import { useEffect, useRef, useState } from "react";

type Frame = "idle-1" | "idle-2" | "walk-1" | "walk-2" | "rest" | "click-1" | "click-2";

/**
 * Sprite-based CrabCursor.
 *
 * Uses the actual crab cursor spritesheet the user provided.
 * States:
 *  - IDLE    → cycles idle-1 ↔ idle-2 slowly (breathing)
 *  - WALKING → cycles walk-1 ↔ walk-2 fast (legs moving)
 *  - CLICK   → click-1 (snap mid) → click-2 (snap closed) → back to idle
 *
 * The crab flips horizontally based on the direction of horizontal movement,
 * so it always "faces" the way it's walking.
 *
 * Sprite sheet layout (7 frames, 80px wide each):
 *  [0] idle-1  [1] walk-1  [2] rest  [3] walk-2  [4] idle-2  [5] click-1  [6] click-2
 */
const FRAME_INDEX: Record<Frame, number> = {
  "idle-1": 0,
  "walk-1": 1,
  rest: 2,
  "walk-2": 3,
  "idle-2": 4,
  "click-1": 5,
  "click-2": 6,
};

const FRAME_W = 80;
const FRAME_H = 75;

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
    let frame: Frame = "idle-1";
    let facing: 1 | -1 = 1; // 1 = right, -1 = left
    let lastMoveTime = performance.now();
    let isClicking = false;
    let clickFrameTime = 0;
    let walkFrameTime = 0;
    let idleFrameTime = 0;
    let lastBubbleTime = 0;

    // Bubble trail
    const bubbles: { x: number; y: number; r: number; vy: number; life: number }[] = [];

    const applyFrame = (f: Frame, flip: 1 | -1) => {
      const idx = FRAME_INDEX[f];
      img.style.transform = `translateX(${-idx * FRAME_W}px) scaleX(${flip})`;
      img.style.width = `${FRAME_W * 7}px`;
      img.style.height = `${FRAME_H}px`;
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
      frame = "click-1";
      applyFrame(frame, facing);
    };

    const onUp = () => {
      isClicking = false;
      // Brief delay then return to idle
      setTimeout(() => {
        if (!isClicking) {
          frame = "idle-1";
          idleFrameTime = performance.now();
          applyFrame(frame, facing);
        }
      }, 180);
    };

    const onLeave = () => { container.style.opacity = "0"; };
    const onEnter = () => { container.style.opacity = "1"; };

    const tick = (t: number) => {
      // Smooth follow
      cx += (mx - cx) * 0.28;
      cy += (my - cy) * 0.28;

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
        // Click animation: click-1 for 80ms, then click-2 for 200ms
        const elapsed = now - clickFrameTime;
        if (elapsed > 80 && frame !== "click-2") {
          frame = "click-2";
          applyFrame(frame, facing);
        }
      } else {
        // Walking vs idle
        const timeSinceMove = now - lastMoveTime;
        if (speed > 1.2 && timeSinceMove < 100) {
          // Walking — cycle walk frames every 140ms
          if (now - walkFrameTime > 140) {
            walkFrameTime = now;
            frame = frame === "walk-1" ? "walk-2" : "walk-1";
            applyFrame(frame, facing);
          }
        } else {
          // Idle — slow cycle between idle-1 and idle-2 every 900ms (breathing)
          if (now - idleFrameTime > 900) {
            idleFrameTime = now;
            if (frame !== "idle-1" && frame !== "idle-2") {
              frame = "idle-1";
            } else {
              frame = frame === "idle-1" ? "idle-2" : "idle-1";
            }
            applyFrame(frame, facing);
          }
        }
      }

      prevX = mx;
      prevY = my;

      // Emit bubble trail when moving
      if (now - lastBubbleTime > 110 && speed > 1.8) {
        bubbles.push({
          x: cx + (Math.random() - 0.5) * 14,
          y: cy + 6,
          r: Math.random() * 2.5 + 1.2,
          vy: -(Math.random() * 0.5 + 0.35),
          life: 1,
        });
        lastBubbleTime = now;
        if (bubbles.length > 12) bubbles.shift();
      }

      // Render bubbles
      const layer = document.getElementById("crab-bubble-layer");
      if (layer) {
        let html = "";
        for (const b of bubbles) {
          b.y += b.vy;
          b.life -= 0.014;
          if (b.life <= 0) continue;
          html += `<div style="position:fixed;left:${b.x}px;top:${b.y}px;width:${b.r * 2}px;height:${b.r * 2}px;border-radius:50%;background:radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(180,210,230,0.25));pointer-events:none;opacity:${b.life * 0.7};transform:translate(-50%,-50%);z-index:9997;mix-blend-mode:screen;"></div>`;
        }
        layer.innerHTML = html;
        // Prune dead
        for (let i = bubbles.length - 1; i >= 0; i--) {
          if (bubbles[i].life <= 0) bubbles.splice(i, 1);
        }
      }

      // Apply container transform (position). Slight rotation toward movement direction.
      const tilt = Math.max(-12, Math.min(12, dy * 0.8));
      container.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%) rotate(${tilt}deg)`;
      container.style.setProperty("--facing", facing.toString());

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
        pointerEvents: "none",
        zIndex: 9999,
        willChange: "transform",
        filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 8px rgba(229, 75, 27, 0.25))",
        transition: "opacity 0.3s ease",
      }}
      aria-hidden
    >
      <img
        ref={imgRef}
        src="/crab/sprite-sheet.png"
        alt=""
        width={FRAME_W * 7}
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
