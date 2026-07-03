"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import RevealText from "./RevealText";
import TriangleAccent from "./TriangleAccent";

const MANIFESTO =
  "No vendemos suscripciones a la nube. Construimos soluciones de IA que son tuyas: las instalamos en tu infraestructura, las orquestamos para tu negocio, y te entregamos el control total. Sin fugas de datos, sin dependencias, sin ataduras.";

export default function Manifesto() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const offset = isMobile ? ["start 0.95", "end 0.15"] : ["start 0.8", "end 0.4"];

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
              Local-First.
              <br />
              <span className="text-gradient-coral">Siempre.</span>
            </RevealText>
          </div>
          <RevealText
            as="p"
            delay={0.2}
            className="max-w-md text-mist leading-relaxed"
          >
            Construimos soluciones de IA para PYMEs en Latam que{" "}
            <span className="text-cream">tú posees y controlas</span>. Más leads,
            contenido que escala, atención 24/7 — todo en tu infraestructura,
            sin depender de proveedores externos.
          </RevealText>
        </div>

        <div ref={ref} className="max-w-5xl">
          <p className="flex flex-wrap gap-x-[0.28em] gap-y-[0.1em] font-display text-[clamp(1.6rem,3.8vw,3.4rem)] uppercase leading-[1.15] tracking-tight">
            {words.map((word, i) => {
              const start = i / words.length;
              const end = start + 1 / words.length;
              return <Word key={i} progress={scrollYProgress} range={[start, end]}>{word}</Word>;
            })}
          </p>
        </div>

        {/* Three pillars */}
        <div className="mt-24 grid gap-8 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Tú posees todo",
              d: "El código, los workflows, los modelos y los datos viven en tu infraestructura. Nada alquilado, nada en la nube de terceros. Si mañana dejas de pagar, sigues teniendo todo funcionando.",
            },
            {
              n: "02",
              t: "Costo operativo cero",
              d: "Sin facturas mensuales de APIs. Sin sorpresas a fin de mes. Procesamiento ilimitado sobre tu hardware. Lo que inviertes es en construir, no en mantener suscripciones.",
            },
            {
              n: "03",
              t: "Soluciones a tu medida",
              d: "No vendemos cajas cerradas. Diseñamos pipelines que se adaptan a tu flujo de negocio: marketing, ventas, soporte, contenido. Cada pieza es reemplazable y escalable.",
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
}: {
  children: string;
  progress: any;
  range: [number, number];
}) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const opacity = useTransform(progress, range, [isMobile ? 0.4 : 0.15, 1]);
  const y = useTransform(progress, range, [isMobile ? 4 : 8, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block">
      {children}
    </motion.span>
  );
}
