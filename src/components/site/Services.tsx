"use client";

import { motion } from "framer-motion";
import { Cpu, Workflow, Image as ImageIcon, Network } from "lucide-react";

const SERVICES = [
  {
    n: "01",
    icon: Cpu,
    title: "Modelos Locales con Ollama",
    stack: ["Qwen 2.5 Coder", "Llama 3", "Hermes"],
    description:
      "Desplegamos modelos avanzados de lenguaje que corren de forma nativa en tu propio hardware Nvidia. Procesamiento ilimitado de documentos corporativos, correos y código sin costo de tokens.",
    benefits: [
      "Cero fuga de información confidencial",
      "Sin suscripción a APIs externas",
      "Procesamiento ilimitado de documentos",
      "Latencia local, respuestas inmediatas",
    ],
  },
  {
    n: "02",
    icon: Workflow,
    title: "Automatización con n8n",
    stack: ["Workflows", "CRM", "WhatsApp", "Webhooks"],
    description:
      "Diseñamos e implementamos flujos de automatización locales seguros que conectan bases de datos, sistemas internos, CRM, envíos de WhatsApp y webhooks en pipelines autónomos de bucle cerrado.",
    benefits: [
      "Reemplazo de tareas repetitivas humanas",
      "Pipelines lógicos en bucle cerrado",
      "Integración nativa con tu stack interno",
      "Orquestación visual y monitoreable",
    ],
  },
  {
    n: "03",
    icon: ImageIcon,
    title: "Generación Multimedia · ComfyUI",
    stack: ["Stable Diffusion", "Flux", "8GB+ VRAM"],
    description:
      "Configuramos flujos automatizados de generación y edición de imágenes y videos sobre tu GPU local. Assets de marketing y diseño web a demanda, sin depender de servicios externos.",
    benefits: [
      "Assets instantáneos a demanda",
      "Edición y variación automatizada",
      "Sin costos por imagen generada",
      "Modelos fine-tuned a tu marca",
    ],
  },
  {
    n: "04",
    icon: Network,
    title: "Arquitectura Swarm de Agentes",
    stack: ["Orchestrator", "Analyst", "Coder", "QA"],
    description:
      "Aunque las ejecuciones son locales por restricciones de hardware, estructuramos tus flujos con la lógica de un enjambre: un Orchestrator que analiza la meta, un Analyst que estructura subtareas, un Coder que escribe scripts, y un QA que valida en bucles lógicos.",
    benefits: [
      "Separación clara de responsabilidades",
      "Bucles de validación automáticos",
      "Trazabilidad de cada decisión",
      "Escalable a futuro multi-agente",
    ],
  },
];

export default function Services() {
  return (
    <section
      id="servicios"
      className="relative py-32 lg:py-44"
    >
      <div className="absolute inset-0 grid-backdrop opacity-15" />
      <div className="glow-blob left-[-200px] top-[20%] h-[400px] w-[400px] bg-crab/10" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* Header */}
        <div className="mb-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="kicker">Servicios</span>
            <h2 className="mt-6 font-display text-[clamp(2rem,5.5vw,5rem)] uppercase leading-[0.95] text-cream">
              Cuatro capas
              <br />
              de <span className="text-gradient-coral">ingeniería</span>
            </h2>
          </div>
          <p className="max-w-md text-mist leading-relaxed">
            Una stack completa de IA privada, modular y desplegable sobre
            infraestructura local. Cada capa resuelve un problema de negocio
            concreto, sin renunciar a la soberanía de tus datos.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-px bg-white/10 lg:grid-cols-2">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.article
                key={i}
                initial={{ opacity: 1, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: (i % 2) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty(
                    "--mx",
                    `${((e.clientX - r.left) / r.width) * 100}%`
                  );
                  e.currentTarget.style.setProperty(
                    "--my",
                    `${((e.clientY - r.top) / r.height) * 100}%`
                  );
                }}
                className="service-card group relative bg-deep/80 p-8 lg:p-12 backdrop-blur-sm"
                data-hover
              >
                {/* Top row */}
                <div className="mb-10 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-crab transition-all duration-500 group-hover:border-crab group-hover:bg-crab group-hover:text-abyss">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <span className="font-mono text-xs tracking-[0.3em] text-mist">
                    {s.n} / 04
                  </span>
                </div>

                {/* Title */}
                <h3 className="mb-4 font-display text-3xl text-cream lg:text-4xl">
                  {s.title}
                </h3>

                {/* Stack pills */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {s.stack.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-mist"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="mb-8 max-w-xl text-mist leading-relaxed">
                  {s.description}
                </p>

                {/* Benefits */}
                <ul className="grid gap-2 sm:grid-cols-2">
                  {s.benefits.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-sm text-cream/80"
                    >
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-crab" />
                      {b}
                    </li>
                  ))}
                </ul>

                {/* Hover arrow */}
                <div className="mt-10 flex items-center gap-3 text-sm text-mist transition-colors group-hover:text-crab">
                  <span className="link-underline">Conocer más</span>
                  <span className="transition-transform duration-500 group-hover:translate-x-2">
                    →
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
