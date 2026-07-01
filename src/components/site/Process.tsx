"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    n: "01",
    t: "Diagnóstico de infraestructura",
    d: "Auditamos tu hardware (GPU Nvidia, VRAM, almacenamiento), tu stack actual de sistemas y los flujos de trabajo repetitivos que están consumiendo horas humanas. El output es un mapa de oportunidades priorizadas por ROI.",
    tags: ["Hardware audit", "Workflow mapping", "ROI scoring"],
  },
  {
    n: "02",
    t: "Diseño de arquitectura Swarm",
    d: "Modelamos el problema como un enjambre: definimos los roles (Orchestrator, Analyst, Coder, QA), las interfaces entre ellos, los puntos de validación y los bucles de retroalimentación. Todo documentado antes de escribir una línea de código.",
    tags: ["Role design", "Interface contracts", "Validation gates"],
  },
  {
    n: "03",
    t: "Despliegue local y privado",
    d: "Instalamos Ollama con los modelos seleccionados (Qwen 2.5 Coder, Llama 3, Hermes), configuramos n8n sobre tu infraestructura, y dejamos ComfyUI listo sobre tu GPU. Nada sale a la nube en ningún momento del proceso.",
    tags: ["Ollama setup", "n8n deploy", "ComfyUI on GPU"],
  },
  {
    n: "04",
    t: "Orquestación de pipelines",
    d: "Conectamos los flujos: webhooks entrantes, bases de datos internas, CRM, WhatsApp, generación multimedia. Cada pipeline queda versionado, monitoreable y reversible. Puedes pausar, editar o auditar cualquier paso.",
    tags: ["Webhooks", "CRM sync", "WhatsApp bots"],
  },
  {
    n: "05",
    t: "Bucle de QA y mejora continua",
    d: "El agente QA valida cada ejecución contra criterios de aceptación. Los fallos vuelven al Coder automáticamente. Tu equipo recibe reportes periódicos de cobertura, latencia y ahorro de horas.",
    tags: ["Auto-validation", "Coverage reports", "Time-saved metrics"],
  },
];

export default function Process() {
  return (
    <section
      id="proceso"
      className="relative overflow-hidden bg-deep/25 py-32 lg:py-44 backdrop-blur-[1px]"
    >
      <div className="absolute inset-0 grid-backdrop opacity-15" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* Header */}
        <div className="mb-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="kicker">Proceso</span>
            <h2 className="mt-6 font-display text-[clamp(2rem,5.5vw,5rem)] uppercase leading-[0.95] text-cream">
              Del audit
              <br />
              al <span className="text-gradient-coral">bucle vivo</span>
            </h2>
          </div>
          <p className="max-w-md text-mist leading-relaxed">
            Cinco fases, ninguna opcional. No entregamos un demo y
            desaparecemos: dejamos infraestructura funcionando, pipelines
            orquestados y un sistema que se mejora solo.
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
