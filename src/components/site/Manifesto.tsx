"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import RevealText from "./RevealText";
import TriangleAccent from "./TriangleAccent";

const MANIFESTO =
  "Cada empresa tiene una forma propia de trabajar, hablar y crecer. La entendemos antes de diseñar. Después convertimos esa esencia en una experiencia, una automatización o un sistema de IA que encaja de verdad: útil, bello, medible y tuyo.";

export default function Manifesto() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: isMobile ? ["start 1", "end 0.3"] : ["start 0.8", "end 0.4"],
  });

  const words = MANIFESTO.split(" ");

  return (
    <section
      id="filosofia"
      className="relative py-32 lg:py-44 overflow-hidden"
    >
      <div className="glow-blob right-[-200px] top-[-100px] h-[400px] w-[400px] bg-ocean/20" />

      {/* Decorative blue triangle accents */}
      <TriangleAccent
        position={{ top: "15%", left: "5%" }}
        variant="up"
        size={36}
        opacity={0.3}
        floatDelay={0}
      />
      <TriangleAccent
        position={{ top: "60%", right: "8%" }}
        variant="down"
        size={48}
        color="#56A0D2"
        opacity={0.22}
        delay={0.2}
        floatDelay={1.5}
      />
      <TriangleAccent
        position={{ bottom: "10%", left: "12%" }}
        variant="right"
        size={28}
        color="#2E6E9E"
        opacity={0.2}
        delay={0.4}
        floatDelay={3}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <RevealText as="span" className="kicker inline-block">
              Filosofía
            </RevealText>
            <RevealText
              as="h2"
              delay={0.1}
              className="mt-6 font-display text-[clamp(2rem,5vw,4.5rem)] uppercase leading-[0.95] text-cream"
            >
              Hecho a tu medida.
              <br />
              <span className="text-gradient-coral">Pensado para durar.</span>
            </RevealText>
          </div>
          <RevealText
            as="p"
            delay={0.2}
            className="max-w-md text-mist leading-relaxed"
          >
            Tu identidad no es una capa decorativa. Es parte de la arquitectura.
            Diseñamos desde tu contexto para que el resultado{" "}
            <span className="text-cream">se vea, se sienta y funcione como tuyo</span>.
          </RevealText>
        </div>

        <div ref={ref} className="relative max-w-5xl">
          <p className="flex flex-wrap gap-x-[0.28em] gap-y-[0.1em] font-display text-[clamp(1.6rem,3.8vw,3.4rem)] uppercase leading-[1.15] tracking-tight">
            {words.map((word, i) => {
              const start = i / words.length;
              const end = start + 1 / words.length;
              return (
                <Word
                  key={i}
                  progress={scrollYProgress}
                  range={[start, end]}
                  isMobile={isMobile}
                >
                  {word}
                </Word>
              );
            })}
          </p>
        </div>

        {/* Three pillars */}
        <div className="mt-24 grid gap-8 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Partimos de tu realidad",
              d: "Primero entendemos tu negocio, tus usuarios, tu lenguaje y tus límites. La solución nace del problema correcto, no de una herramienta de moda.",
            },
            {
              n: "02",
              t: "Diseño con intención",
              d: "La estrategia, la experiencia, el movimiento y cada detalle visual trabajan juntos para comunicar quién eres y guiar a las personas hacia una acción clara.",
            },
            {
              n: "03",
              t: "Propiedad y evolución",
              d: "Entregamos código, documentación y criterio para que puedas operar, mantener y hacer crecer el producto. Cuando conviene, priorizamos una arquitectura local y abierta.",
            },
          ].map((p, i) => (
            <RevealText
              key={i}
              as="div"
              delay={i * 0.12}
              className="group relative border-t border-white/10 pt-8"
            >
              <div className="mb-4 font-mono text-xs tracking-[0.3em] text-crab">
                — {p.n}
              </div>
              <h3 className="mb-3 font-display text-2xl text-cream">{p.t}</h3>
              <p className="text-mist leading-relaxed">{p.d}</p>
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
  isMobile,
}: {
  children: string;
  progress: any;
  range: [number, number];
  isMobile: boolean;
}) {
  const opacity = useTransform(progress, range, [isMobile ? 0.4 : 0.15, 1]);
  const y = useTransform(progress, range, [isMobile ? 4 : 8, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block">
      {children}
    </motion.span>
  );
}
