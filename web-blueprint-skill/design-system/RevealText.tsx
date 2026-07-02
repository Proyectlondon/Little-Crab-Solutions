"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

/**
 * RevealText — animates content IN as it enters the viewport (one-time).
 *
 * Animation:
 *  - opacity 0→1, y 30→0, filter blur(8px)→blur(0)
 *  - Once revealed, stays visible (does NOT animate back out).
 *
 * Uses whileInView with once:true so the content remains readable after
 * the initial reveal (no flicker on scroll back).
 */
export default function RevealText({
  children,
  delay = 0,
  duration = 0.7,
  className,
  as = "div",
  amount = 0.2,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  amount?: number;
  as?: "div" | "span" | "h2" | "h3" | "p" | "li" | "section";
}) {
  const motionProps = {
    initial: { opacity: 0, y: 30, filter: "blur(8px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, amount, margin: "-60px 0px -60px 0px" },
    transition: {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
    className,
  };

  switch (as) {
    case "span":
      return <motion.span {...motionProps}>{children}</motion.span>;
    case "h2":
      return <motion.h2 {...motionProps}>{children}</motion.h2>;
    case "h3":
      return <motion.h3 {...motionProps}>{children}</motion.h3>;
    case "p":
      return <motion.p {...motionProps}>{children}</motion.p>;
    case "li":
      return <motion.li {...motionProps}>{children}</motion.li>;
    case "section":
      return <motion.section {...motionProps}>{children}</motion.section>;
    default:
      return <motion.div {...motionProps}>{children}</motion.div>;
  }
}
