"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import RevealText from "./RevealText";

const VALUES = [
  {
    t: "Escuchar antes de diseñar",
    d: "Las mejores decisiones aparecen cuando entendemos tu operación, tus usuarios y lo que quieres representar.",
  },
  {
    t: "Belleza que cumple una función",
    d: "Buscamos una identidad memorable y cuidamos que la experiencia siga siendo clara, rápida y accesible.",
  },
  {
    t: "Tecnología con criterio",
    d: "Elegimos herramientas por su aporte al proyecto. Verificamos, documentamos y evitamos complejidad que no genere valor.",
  },
  {
    t: "Evidencia antes que suposiciones",
    d: "Probamos lo importante y hablamos con claridad sobre capacidades, límites, costes y decisiones pendientes.",
  },
];

export default function JJStack() {
  return (
    <section
      id="ecosistema"
      className="relative py-32 lg:py-44"
    >
      <div className="glow-blob right-[-200px] top-[10%] h-[500px] w-[500px] bg-ocean/20" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          {/* Left: logo + headline */}
          <div>
            <RevealText as="span" className="kicker inline-block">
              Sobre Nosotros
            </RevealText>
            <RevealText
              as="h2"
              delay={0.1}
              className="mt-6 font-display text-[clamp(2rem,5.5vw,5rem)] uppercase leading-[0.95] text-cream"
            >
              Construido con
              <br />
              <span className="text-gradient-ocean">propósito</span>
            </RevealText>
            <RevealText
              as="p"
              delay={0.2}
              className="mt-8 max-w-xl text-mist leading-relaxed"
            >
              Little Crab Solutions nació de{" "}
              <span className="text-cream">John Esteban</span> y su esposa,
              con la convicción de que la tecnología también puede tener alma.
              Unimos diseño visual, desarrollo e IA para crear productos que
              resuelven una necesidad y expresan con honestidad quién es cada
              cliente.
            </RevealText>

            <RevealText
              as="p"
              delay={0.3}
              className="mt-4 max-w-xl text-mist leading-relaxed"
            >
              Esta empresa está construida sobre tres fundamentos:{" "}
              <span className="text-cream">Dios</span> como nuestro motor y
              guía, <span className="text-cream">la familia</span> como
              prioridad sobre cualquier negocio, y el trabajo bien hecho como una
              forma de servir. Por eso tratamos cada proyecto con cuidado,
              honestidad y respeto, desde la primera conversación hasta el último
              detalle.
            </RevealText>

            <div className="mt-8 flex items-center gap-6">
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl ring-1 ring-white/10 float-anim">
                <Image
                  src="/logo.png"
                  alt="Little Crab Solutions"
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div>
                <div className="font-display text-2xl text-cream">
                  Little Crab Solutions
                </div>
                <div className="text-sm text-mist">
                  Tocancipá, Cundinamarca · Atendemos Latam
                </div>
              </div>
            </div>
          </div>

          {/* Right: values grid */}
          <div className="grid gap-px bg-white/10 sm:grid-cols-2">
            {VALUES.map((e, i) => (
              <RevealText
                key={i}
                as="div"
                delay={i * 0.08}
                className="group bg-abyss p-8 transition-colors hover:bg-deep"
              >
                <div className="mb-6 font-display text-5xl text-crab/40 transition-colors group-hover:text-crab">
                  0{i + 1}
                </div>
                <h3 className="mb-3 font-display text-lg text-cream">{e.t}</h3>
                <p className="text-sm text-mist leading-relaxed">{e.d}</p>
              </RevealText>
            ))}
          </div>
        </div>

        {/* Faith line — subtle, at the bottom */}
        <RevealText
          as="div"
          delay={0.3}
          className="mt-20 border-t border-white/10 pt-8 text-center"
        >
          <p className="mx-auto max-w-2xl text-sm italic leading-relaxed text-mist">
            "No por fuerza, ni por poder, sino por mi Espíritu." —{" "}
            <span className="text-cream">Zacarías 4:6</span>
            <br />
            <span className="text-mist">
              Nuestra fe es el motor que nos impulsa, no lo que vendemos.
              Tratamos a cada cliente con honestidad, excelencia y respeto —
              porque es lo correcto, no porque sea buena estrategia.
            </span>
          </p>
        </RevealText>
      </div>
    </section>
  );
}
