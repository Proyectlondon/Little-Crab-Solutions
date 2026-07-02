"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/**
 * TriangleAccent — decorative blue triangle accents that float subtly.
 *
 * Placed at section boundaries as visual anchors. They:
 *  - Fade in when the section enters the viewport
 *  - Have a slow floating animation (bob up/down)
 *  - Use the ocean blue palette (#2E6E9E, #56A0D2)
 *  - Are semi-transparent so they don't overpower content
 *
 * Variants:
 *  - "up"    — triangle pointing up
 *  - "down"  — triangle pointing down
 *  - "left"  — triangle pointing left
 *  - "right" — triangle pointing right
 */
export default function TriangleAccent({
  position,
  variant = "up",
  size = 40,
  color = "#2E6E9E",
  opacity = 0.25,
  delay = 0,
  floatDelay = 0,
}: {
  position: { top?: string; bottom?: string; left?: string; right?: string };
  variant?: "up" | "down" | "left" | "right";
  size?: number;
  color?: string;
  opacity?: number;
  delay?: number;
  floatDelay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.3, margin: "-50px" });

  const rotation = {
    up: 0,
    right: 90,
    down: 180,
    left: 270,
  }[variant];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "absolute",
        ...position,
        pointerEvents: "none",
        zIndex: 1,
      }}
      aria-hidden
    >
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 3, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: floatDelay,
        }}
        style={{
          width: size,
          height: size,
          opacity,
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 4 L36 34 L4 34 Z"
            fill={color}
            fillOpacity={0.3}
            stroke={color}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M20 12 L30 30 L10 30 Z"
            fill={color}
            fillOpacity={0.15}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
