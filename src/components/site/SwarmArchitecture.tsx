"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Brain, ListTree, Code2, ShieldCheck } from "lucide-react";

const NODES = [
  {
    id: "orchestrator",
    label: "Orchestrator",
    role: "Analiza la meta",
    icon: Brain,
    desc: "Recibe el objetivo de negocio, lo descompone en fases ejecutables y asigna responsabilidades al resto del enjambre.",
    color: "#E54B1B",
  },
  {
    id: "analyst",
    label: "Analyst",
    role: "Estructura subtareas",
    icon: ListTree,
    desc: "Convierte cada fase en un plan técnico concreto: define inputs, outputs, dependencias y criterios de aceptación.",
    color: "#E8B974",
  },
  {
    id: "coder",
    label: "Coder",
    role: "Escribe scripts",
    icon: Code2,
    desc: "Genera el código, los prompts y las configuraciones de los flujos n8n / ComfyUI necesarios para ejecutar el plan.",
    color: "#2E6E9E",
  },
  {
    id: "qa",
    label: "QA",
    role: "Valida resultados",
    icon: ShieldCheck,
    desc: "Inspecciona outputs contra los criterios de aceptación. Si algo falla, devuelve la tarea al Coder en bucle cerrado.",
    color: "#7BC4A4",
  },
];

export default function SwarmArchitecture() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.2"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 90]);

  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveIdx((i) => (i + 1) % NODES.length), 2200);
    return () => clearInterval(t);
  }, []);

  // Position around a circle (radius in %)
  const R = 38;
  const positions = NODES.map((_, i) => {
    const angle = (i / NODES.length) * Math.PI * 2 - Math.PI / 2;
    return {
      x: 50 + R * Math.cos(angle),
      y: 50 + R * Math.sin(angle),
    };
  });

  return (
    <section
      id="swarm"
      className="relative overflow-hidden bg-abyss/25 py-32 lg:py-44 backdrop-blur-[1px]"
    >
      <div className="glow-blob left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 bg-crab/8" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* Header */}
        <div className="mb-20 text-center">
          <span className="kicker justify-center">Arquitectura Swarm</span>
          <h2 className="mx-auto mt-6 max-w-4xl font-display text-[clamp(2rem,5.5vw,5rem)] uppercase leading-[0.95] text-cream">
            Un enjambre
            <br />
            <span className="text-gradient-coral">de especialistas</span>
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-mist leading-relaxed">
            No un único modelo monolítico. Cuatro roles con responsabilidades
            claras, orquestados en bucle cerrado. Hoy corren en tu hardware
            local; mañana, cuando tu infraestructura crezca, escalarán a un
            enjambre distribuido sin reescribir una sola línea de lógica.
          </p>
        </div>

        {/* Diagram + Side panel */}
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_1fr]">
          {/* Diagram */}
          <div ref={ref} className="relative aspect-square w-full">
            {/* Rotating outer ring */}
            <motion.div
              style={{ rotate }}
              className="absolute inset-[8%] rounded-full border border-dashed border-white/10"
            />
            <div className="absolute inset-[18%] rounded-full border border-white/[0.06]" />
            <div className="absolute inset-[28%] rounded-full border border-white/[0.04]" />

            {/* Center node */}
            <div className="absolute left-1/2 top-1/2 z-20 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-crab/40 bg-deep/90 text-center backdrop-blur">
              <div className="h-2 w-2 rounded-full bg-crab shadow-[0_0_18px_#E54B1B] animate-pulse" />
              <div className="mt-2 font-display text-sm uppercase tracking-[0.15em] text-cream">
                Swarm
              </div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-mist">
                Loop
              </div>
            </div>

            {/* SVG connectors */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              {positions.map((p, i) => {
                const next = positions[(i + 1) % positions.length];
                const isActive = activeIdx === i;
                return (
                  <line
                    key={i}
                    x1={p.x}
                    y1={p.y}
                    x2={next.x}
                    y2={next.y}
                    stroke={isActive ? "#E54B1B" : "rgba(245, 239, 230, 0.12)"}
                    strokeWidth={isActive ? 0.6 : 0.3}
                    strokeDasharray={isActive ? "0" : "2 2"}
                    style={{
                      transition: "stroke 0.5s ease, stroke-width 0.5s ease",
                      filter: isActive
                        ? "drop-shadow(0 0 4px #E54B1B)"
                        : "none",
                    }}
                  />
                );
              })}
              {/* Spokes to center */}
              {positions.map((p, i) => (
                <line
                  key={`spoke-${i}`}
                  x1={50}
                  y1={50}
                  x2={p.x}
                  y2={p.y}
                  stroke="rgba(245, 239, 230, 0.06)"
                  strokeWidth={0.2}
                />
              ))}
            </svg>

            {/* Nodes */}
            {NODES.map((n, i) => {
              const Icon = n.icon;
              const isActive = activeIdx === i;
              return (
                <div
                  key={n.id}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${positions[i].x}%`, top: `${positions[i].y}%` }}
                >
                  <motion.div
                    animate={{
                      scale: isActive ? 1.12 : 1,
                      boxShadow: isActive
                        ? `0 0 30px ${n.color}80`
                        : "0 0 0 rgba(0,0,0,0)",
                    }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex h-20 w-20 flex-col items-center justify-center rounded-2xl border bg-deep/90 backdrop-blur sm:h-24 sm:w-24"
                    style={{
                      borderColor: isActive ? n.color : "rgba(245, 239, 230, 0.12)",
                    }}
                  >
                    {isActive && <span className="pulse-ring" />}
                    <Icon
                      className="h-5 w-5 sm:h-6 sm:w-6"
                      strokeWidth={1.5}
                      style={{ color: isActive ? n.color : "#A8B4BE" }}
                    />
                    <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-cream sm:text-[10px]">
                      {n.label}
                    </span>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Side panel: active node details */}
          <div>
            <div className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-mist">
              <span className="h-px w-8 bg-crab" />
              Rol activo
            </div>
            {NODES.map((n, i) => {
              const Icon = n.icon;
              const isActive = activeIdx === i;
              return (
                <motion.div
                  key={n.id}
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0.35,
                    x: isActive ? 0 : -10,
                  }}
                  transition={{ duration: 0.4 }}
                  className="border-t border-white/10 py-6"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-lg border"
                      style={{
                        borderColor: isActive ? n.color : "rgba(245,239,230,0.1)",
                        color: isActive ? n.color : "#A8B4BE",
                      }}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="font-display text-xl text-cream">
                        {n.label}
                      </div>
                      <div className="text-sm text-mist">{n.role}</div>
                    </div>
                  </div>
                  {isActive && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.5 }}
                      className="mt-4 overflow-hidden text-mist leading-relaxed"
                    >
                      {n.desc}
                    </motion.p>
                  )}
                </motion.div>
              );
            })}

            <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <div className="mb-2 text-xs uppercase tracking-[0.22em] text-mist">
                Bucle cerrado
              </div>
              <p className="text-sm leading-relaxed text-cream/80">
                Cada ejecución regresa al Orchestrator para verificar si la meta
                fue alcanzada. Si no, se reinicia el ciclo con una nueva
                descomposición de tareas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
