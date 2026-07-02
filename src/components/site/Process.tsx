"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    n: "01",
    t: "Diagnóstico & Arquitectura",
    d: "Auditoría técnica de tu stack actual, definición de KPIs (CAC, LTV, ROAS, velocidad de lead), y diseño de la arquitectura Lego Bricks — qué piezas activar y en qué orden de prioridad. Entregable: documento ARCHITECTURE.md + diagrama C4 + backlog.",
    tags: ["Auditoría técnica", "KPIs: CAC, LTV, ROAS", "Arquitectura Lego", "ARCHITECTURE.md"],
  },
  {
    n: "02",
    t: "Build & Integración",
    d: "Setup de infraestructura local (n8n Docker, ComfyUI en RTX 4060, Ollama), integración con tus herramientas vía 400+ nodos nativos de n8n (HubSpot, Notion, Slack, Meta Ads, GA4), y primer workflow prioritario en producción.",
    tags: ["n8n Docker :5678", "ComfyUI :8188", "400+ nodos nativos", "Workflow en producción"],
  },
  {
    n: "03",
    t: "Escalamiento & Autonomía",
    d: "Automatización completa de todos los workflows prioritarios, entrenamiento de tu equipo en 3 sesiones hands-on (n8n, ComfyUI, prompting), y handover total: código, credenciales (Bitwarden), docs, runbooks. Soporte 30 días post-lanzamiento.",
    tags: ["Workflows en producción", "3 sesiones hands-on", "Handover total", "Soporte 30d"],
  },
  {
    n: "04",
    t: "Partner Continuo",
    d: "Retainer mensual opcional: nuevos workflows, LoRAs estacionales, optimización de modelos, monitoreo y soporte prioritario. Seguimos mejorando tu ejército de micro-agentes que trabajan 24/7 en tu infraestructura.",
    tags: ["Retainer mensual", "Nuevos workflows", "LoRAs estacionales", "Monitoreo 24/7"],
  },
];

export default function Process() {
  return (
    <section
      id="proceso"
      className="relative py-32 lg:py-44"
    >
      <div className="absolute inset-0 grid-backdrop opacity-15" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* Header */}
        <div className="mb-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="kicker">Proceso</span>
            <h2 className="mt-6 font-display text-[clamp(2rem,5.5vw,5rem)] uppercase leading-[0.95] text-cream">
              Del diagnóstico
              <br />
              al <span className="text-gradient-coral">ejército vivo</span>
            </h2>
          </div>
          <p className="max-w-md text-mist leading-relaxed">
            Cuatro fases en 12 semanas. No entregamos un demo y desaparecemos:
            dejamos infraestructura funcionando, equipo entrenado, y un
            ejército de micro-agentes que trabajan 24/7 en tu infraestructura.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-crab via-white/10 to-transparent md:left-1/2" />

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
