"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import RevealText from "./RevealText";

const STEPS = [
  {
    n: "01",
    t: "Descubrimiento",
    d: "Escuchamos tu visión, estudiamos a las personas que usarán el producto y revisamos el contexto técnico. Acordamos el problema, el alcance y los criterios con los que evaluaremos el resultado.",
    tags: ["Contexto", "Usuarios", "Objetivos", "Criterios claros"],
  },
  {
    n: "02",
    t: "Dirección & Arquitectura",
    d: "Definimos el concepto visual, el recorrido y la arquitectura del sistema. Prototipamos las decisiones importantes para que puedas ver y cuestionar la solución antes de invertir en construirla completa.",
    tags: ["Concepto visual", "Prototipo", "Arquitectura", "Decisiones compartidas"],
  },
  {
    n: "03",
    t: "Construcción & Validación",
    d: "Desarrollamos por entregas revisables. Probamos el comportamiento, el contenido, la accesibilidad, el rendimiento y las integraciones con casos cercanos al uso real.",
    tags: ["Iteraciones", "Pruebas reales", "Accesibilidad", "Rendimiento"],
  },
  {
    n: "04",
    t: "Entrega & Evolución",
    d: "Entregamos el producto, el código y la documentación acordada. Tu equipo entiende cómo operarlo y decidimos juntos si conviene acompañar el lanzamiento o continuar con nuevas etapas.",
    tags: ["Propiedad clara", "Documentación", "Transferencia", "Acompañamiento opcional"],
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.6", "end 0.4"],
  });
  // Line illumination — grows from 0% to 100% as user scrolls through the section
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="proceso"
      ref={sectionRef}
      className="relative py-32 lg:py-44"
    >
      <div className="absolute inset-0 grid-backdrop opacity-15" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* Header */}
        <div className="mb-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <RevealText as="span" className="kicker inline-block">
              Proceso
            </RevealText>
            <RevealText
              as="h2"
              delay={0.1}
              className="mt-6 font-display text-[clamp(2rem,5.5vw,5rem)] uppercase leading-[0.95] text-cream"
            >
              Del diagnóstico
              <br />
              al <span className="text-gradient-coral">resultado</span>
            </RevealText>
          </div>
          <RevealText
            as="p"
            delay={0.2}
            className="max-w-md text-mist leading-relaxed"
          >
            El tiempo y el equipo dependen del alcance. El recorrido se mantiene:
            entender antes de diseñar, validar antes de construir de más y
            entregar algo que puedas usar y hacer crecer.
          </RevealText>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line — base (dim) */}
          <div className="absolute left-0 top-0 h-full w-px bg-white/10 md:left-1/2" />
          {/* Vertical line — illuminated overlay that grows with scroll */}
          <motion.div
            style={{ scaleY: lineScale, transformOrigin: "top" }}
            className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-crab via-crab/60 to-crab/20 md:left-1/2 shadow-[0_0_12px_rgba(229,75,27,0.6)]"
          />

          <div className="space-y-16">
            {STEPS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`relative grid gap-6 md:grid-cols-2 ${
                  i % 2 === 0 ? "" : "md:[direction:rtl]"
                }`}
              >
                {/* Node dot */}
                <div className="absolute left-0 top-2 z-10 -translate-x-1/2 md:left-1/2">
                  <div className="relative flex h-4 w-4 items-center justify-center rounded-full bg-crab">
                    <div className="absolute h-8 w-8 rounded-full border border-crab/40 animate-ping" />
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`pl-8 md:pl-0 [direction:ltr] ${
                    i % 2 === 0 ? "md:pr-16 md:text-right" : "md:col-start-2 md:pl-16"
                  }`}
                >
                  <div
                    className={`mb-3 font-mono text-xs tracking-[0.3em] text-crab ${
                      i % 2 === 0 ? "md:text-right" : ""
                    }`}
                  >
                    — Fase {s.n}
                  </div>
                  <h3 className="mb-4 font-display text-3xl text-cream lg:text-4xl">
                    {s.t}
                  </h3>
                  <p className="text-mist leading-relaxed">{s.d}</p>
                  <div
                    className={`mt-5 flex flex-wrap gap-2 ${
                      i % 2 === 0 ? "md:justify-end" : ""
                    }`}
                  >
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-mist"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
