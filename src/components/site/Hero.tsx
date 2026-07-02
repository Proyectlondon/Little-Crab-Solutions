"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ParticleBackground from "./ParticleBackground";

const TITLE_LINES = [
  ["IA", "privada."],
  ["Automatización", "que"],
  ["no", "se va", "a la nube."],
];

export default function Hero() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Gentle parallax — content moves up only slightly and stays mostly visible
  // until the user has scrolled well past the hero.
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative min-h-[100svh] w-full overflow-hidden bg-transparent"
    >
      {/* Background canvas — local particles, behind global ocean ambient */}
      <div className="absolute inset-0 z-0 opacity-70">
        <ParticleBackground variant="hero" />
      </div>

      {/* Glow blobs — soft ambient color, no hard edges */}
      <div className="glow-blob -left-32 top-24 h-[420px] w-[420px] bg-crab/25" />
      <div className="glow-blob -right-32 bottom-0 h-[520px] w-[520px] bg-ocean/30" />

      {/* Subtle top vignette only — NO bottom gradient, so the hero blends
          seamlessly into the next section without a shadow band */}
      <div className="absolute inset-0 bg-gradient-to-b from-abyss/30 via-transparent to-transparent" />

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-center px-6 pt-24 pb-12 lg:px-10"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex flex-wrap items-center gap-3"
        >
          <span className="tag-pill">
            <span className="dot" />
            Boutique de Ingeniería IA · Local-First
          </span>
          <span className="tag-pill">Parte del ecosistema JJ Stack</span>
        </motion.div>

        {/* Title */}
        <h1 className="font-display text-[clamp(2.2rem,7vw,7rem)] uppercase">
          {TITLE_LINES.map((line, li) => (
            <div key={li} className="overflow-hidden">
              <motion.div
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 1,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.15 + li * 0.12,
                }}
                className="flex flex-wrap gap-x-[0.25em] gap-y-[0.05em]"
              >
                {line.map((word, wi) => (
                  <span
                    key={wi}
                    className={
                      word === "privada." || word === "nube."
                        ? "text-gradient-coral"
                        : "text-cream"
                    }
                  >
                    {word}
                  </span>
                ))}
              </motion.div>
            </div>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-mist sm:text-lg"
        >
          Desplegamos modelos de lenguaje, automatización de workflows y generación
          multimedia sobre tu propio hardware. Cero costo de tokens, cero fuga de
          datos, cero dependencia de la nube.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <a href="#contacto" className="magnetic-btn" data-hover>
            Iniciar proyecto
            <span aria-hidden>→</span>
          </a>
          <a href="#servicios" className="magnetic-btn outline" data-hover>
            Explorar servicios
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4"
        >
          {[
            { k: "0", l: "Tokens facturados" },
            { k: "100%", l: "Datos en tu hardware" },
            { k: "4", l: "Roles Swarm orquestados" },
            { k: "8GB+", l: "VRAM mínimo para difusión" },
          ].map((s, i) => (
            <div key={i} className="flex flex-col">
              <span className="font-display text-4xl text-cream sm:text-5xl">
                {s.k}
              </span>
              <span className="mt-1 text-xs uppercase tracking-[0.18em] text-mist">
                {s.l}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 text-mist"
        aria-hidden
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="h-10 w-[1px] bg-gradient-to-b from-crab to-transparent" />
      </motion.div>
    </section>
  );
}
