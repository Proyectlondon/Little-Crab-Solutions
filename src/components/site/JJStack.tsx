"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const ECOSYSTEM = [
  {
    t: "Stack de IA privado",
    d: "Cuatro capas — modelos, workflows, multimedia, agentes — corriendo sobre tu hardware.",
  },
  {
    t: "Infraestructura Nvidia",
    d: "GPUs locales con 8GB+ VRAM listas para difusión y para inferencia de LLMs sin latencia de red.",
  },
  {
    t: "Integración con tu negocio",
    d: "WhatsApp, CRM, bases de datos internas y webhooks conectados por n8n en pipelines de bucle cerrado.",
  },
  {
    t: "Soberanía operativa",
    d: "Sin suscripciones a APIs externas. Sin costo por token. Sin depender de la disponibilidad de un proveedor.",
  },
];

export default function JJStack() {
  return (
    <section
      id="ecosistema"
      className="relative overflow-hidden bg-abyss/25 py-32 lg:py-44 backdrop-blur-[1px]"
    >
      <div className="glow-blob right-[-200px] top-[10%] h-[500px] w-[500px] bg-ocean/20" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          {/* Left: logo + headline */}
          <div>
            <span className="kicker">Ecosistema JJ Stack</span>
            <h2 className="mt-6 font-display text-[clamp(2rem,5.5vw,5rem)] uppercase leading-[0.95] text-cream">
              Una pieza
              <br />
              de un <span className="text-gradient-ocean">sistema mayor</span>
            </h2>
            <p className="mt-8 max-w-xl text-mist leading-relaxed">
              Little Crab Solutions es la boutique de IA del ecosistema JJ
              Stack. Donde el resto del ecosistema construye producto, Little
              Crab construye la infraestructura de inteligencia que lo
              alimenta — privada, local y sin ataduras a la nube.
            </p>

            <div className="mt-12 flex items-center gap-6">
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
                  · Parte del ecosistema JJ Stack
                </div>
              </div>
            </div>
          </div>

          {/* Right: ecosystem grid */}
          <div className="grid gap-px bg-white/10 sm:grid-cols-2">
            {ECOSYSTEM.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="group bg-abyss p-8 transition-colors hover:bg-deep"
              >
                <div className="mb-6 font-display text-5xl text-crab/40 transition-colors group-hover:text-crab">
                  0{i + 1}
                </div>
                <h3 className="mb-3 font-display text-lg text-cream">{e.t}</h3>
                <p className="text-sm text-mist leading-relaxed">{e.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
