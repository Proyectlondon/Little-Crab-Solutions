"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const MANIFESTO =
  "No alquilamos tu inteligencia a la nube. La instalamos en tu propio hardware, la orquestamos como un enjambre de agentes especializados, y la dejamos correr sin límite de tokens ni ojos externos sobre tus datos.";

export default function Manifesto() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.4"],
  });

  const words = MANIFESTO.split(" ");

  return (
    <section
      id="filosofia"
      className="relative overflow-hidden bg-abyss/25 py-32 lg:py-44 backdrop-blur-[1px]"
    >
      <div className="glow-blob right-[-200px] top-[-100px] h-[400px] w-[400px] bg-ocean/20" />

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="kicker">Filosofía</span>
            <h2 className="mt-6 font-display text-[clamp(2rem,5vw,4.5rem)] uppercase leading-[0.95] text-cream">
              Local-First.
              <br />
              <span className="text-gradient-coral">Siempre.</span>
            </h2>
          </div>
          <p className="max-w-md text-mist leading-relaxed">
            Little Crab Solutions es la boutique de ingeniería del ecosistema{" "}
            <span className="text-cream">JJ Stack</span>. Construimos
            infraestructura de IA que pertenece al cliente, no a un proveedor.
          </p>
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
              t: "Privacidad por diseño",
              d: "Tus documentos, correos y código nunca salen de tus servidores. Cero APIs externas, cero fugas de información confidencial.",
            },
            {
              n: "02",
              t: "Costo cero en tokens",
              d: "Procesamiento ilimitado sobre tu propia GPU. Sin facturación por uso, sin sorpresas a fin de mes, sin depender del humor de un proveedor.",
            },
            {
              n: "03",
              t: "Soberanía operativa",
              d: "El modelo, los pesos, los datos y la lógica viven dentro de tu perímetro. Si apagas el internet, la IA sigue funcionando.",
            },
          ].map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative border-t border-white/10 pt-8"
            >
              <div className="mb-4 font-mono text-xs tracking-[0.3em] text-crab">
                — {p.n}
              </div>
              <h3 className="mb-3 font-display text-2xl text-cream">{p.t}</h3>
              <p className="text-mist leading-relaxed">{p.d}</p>
            </motion.div>
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
  const opacity = useTransform(progress, range, [0.15, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block">
      {children}
    </motion.span>
  );
}
