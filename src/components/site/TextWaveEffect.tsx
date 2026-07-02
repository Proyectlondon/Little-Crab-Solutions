"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * TextWaveEffect — wraps text and applies an underwater wave distortion
 * + bright shimmer when the mouse hovers over it.
 *
 * Implementation:
 *  - Uses SVG feTurbulence + feDisplacementMap filter to create the wave.
 *  - The filter's scale animates from 0 → peak → 0 when the mouse enters,
 *    creating a "ripple passes through the text" effect.
 *  - A radial gradient overlay follows the mouse with a bright shimmer
 *    (screen blend mode) that fades out quickly.
 *  - The effect is subtle by default — scales up briefly then settles.
 *
 * Usage:
 *  <TextWaveEffect>My heading text</TextWaveEffect>
 *  <TextWaveEffect intensity="strong">Important text</TextWaveEffect>
 */

let filterIdCounter = 0;

export default function TextWaveEffect({
  children,
  intensity = "subtle",
  className,
  as: Component = "span",
}: {
  children: ReactNode;
  intensity?: "subtle" | "medium" | "strong";
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [filterId] = useState(() => `wave-filter-${filterIdCounter++}`);
  const [hovering, setHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [rippleKey, setRippleKey] = useState(0);

  // Scale values per intensity
  const maxScale = intensity === "subtle" ? 6 : intensity === "medium" ? 10 : 16;

  useEffect(() => {
    if (!hovering) return;
    // Auto-clear after the ripple animation
    const t = setTimeout(() => setHovering(false), 1200);
    return () => clearTimeout(t);
  }, [hovering, rippleKey]);

  const handleMouseEnter = () => {
    setRippleKey((k) => k + 1);
    setHovering(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <Component
      ref={ref as any}
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        cursor: "default",
        // Apply the SVG filter when hovering — animates via CSS
        filter: hovering ? `url(#${filterId})` : "none",
        transition: "filter 0.3s ease",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
    >
      {children}

      {/* Shimmer overlay — bright reflection that follows mouse and fades */}
      {hovering && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `radial-gradient(circle 80px at ${mousePos.x}px ${mousePos.y}px, rgba(180, 220, 255, 0.35) 0%, rgba(140, 200, 240, 0.15) 40%, transparent 70%)`,
            mixBlendMode: "screen",
            animation: "shimmerFade 1.2s ease-out forwards",
            borderRadius: "inherit",
          }}
        />
      )}

      {/* SVG filter definition — only rendered once, reused via id */}
      <svg
        width="0"
        height="0"
        style={{ position: "absolute", pointerEvents: "none" }}
        aria-hidden
      >
        <defs>
          <filter id={filterId} key={rippleKey}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.04"
              numOctaves="2"
              seed={rippleKey}
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.02 0.04;0.015 0.06;0.02 0.04"
                dur="1.2s"
                repeatCount="1"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={maxScale}
              xChannelSelector="R"
              yChannelSelector="G"
            >
              <animate
                attributeName="scale"
                values={`0;${maxScale};${maxScale * 0.5};0`}
                keyTimes="0;0.3;0.7;1"
                dur="1.2s"
                repeatCount="1"
              />
            </feDisplacementMap>
          </filter>
        </defs>
      </svg>

      <style>{`
        @keyframes shimmerFade {
          0% { opacity: 0; }
          20% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </Component>
  );
}
