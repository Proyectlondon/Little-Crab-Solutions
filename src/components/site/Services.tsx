"use client";

import { motion } from "framer-motion";
import { LayoutTemplate, Workflow, Palette, MessagesSquare, Sparkles } from "lucide-react";
import RevealText from "./RevealText";
import TriangleAccent from "./TriangleAccent";

const SERVICES = [
  {
    n: "01",
    icon: LayoutTemplate,
    title: "Productos Digitales con Identidad",
    stack: ["Web", "Landings", "Aplicaciones", "UX/UI"],
    description:
      "Diseñamos y construimos experiencias digitales que expresan la personalidad de tu marca y facilitan una acción concreta. La estética, el contenido y la tecnología se resuelven como un solo producto.",
    detail:
      "Partimos de la historia que quieres contar y de la acción que debe poder realizar tu visitante. Definimos la estructura, el lenguaje visual y los estados de la interfaz antes de convertirlos en un producto que tu equipo pueda mantener.",
    benefits: [
      "Dirección visual creada para tu proyecto",
      "Arquitectura de contenido y recorrido del usuario",
      "Desarrollo responsive y accesible",
      "SEO y rendimiento medidos antes de entregar",
    ],
  },
  {
    n: "02",
    icon: Workflow,
    title: "Automatización que Encaja",
    stack: ["Procesos", "Agentes", "Integraciones", "Datos"],
    description:
      "Conectamos las herramientas que ya usas y automatizamos tareas repetitivas sin imponer una operación ajena. Cada flujo incluye controles, trazabilidad y una salida comprensible para tu equipo.",
    detail:
      "Observamos cómo trabaja hoy tu equipo, detectamos dónde se pierde tiempo y diseñamos el flujo con las herramientas que ya forman parte de la operación. La automatización se entrega documentada, con puntos de revisión y una forma clara de corregirla.",
    benefits: [
      "Captura, clasificación y seguimiento de oportunidades",
      "Flujos entre formularios, CRM y mensajería",
      "Agentes con revisión humana cuando importa",
      "Paneles y alertas para entender qué ocurre",
    ],
  },
  {
    n: "03",
    icon: Palette,
    title: "Sistemas de Contenido Visual",
    stack: ["Imagen", "Video", "Marca", "IA Generativa"],
    description:
      "Creamos sistemas para producir imágenes, piezas y video sin perder la identidad de marca. Combinamos dirección de arte, plantillas y modelos generativos según el nivel de control que necesites.",
    detail:
      "Construimos una dirección visual utilizable: referencias, reglas, plantillas y ejemplos que ayudan a producir nuevas piezas sin empezar desde cero. La IA entra solo donde mejora el ritmo de trabajo y conserva el criterio de tu marca.",
    benefits: [
      "Lenguaje visual y reglas de consistencia",
      "Piezas de producto, campañas y redes",
      "Video vertical, demos y contenido educativo",
      "Flujos reutilizables para crecer con orden",
    ],
  },
  {
    n: "04",
    icon: MessagesSquare,
    title: "Experiencias Conversacionales",
    stack: ["Chat", "Voz", "WhatsApp", "Soporte"],
    description:
      "Diseñamos asistentes que responden con el conocimiento y el tono de tu organización. Pueden orientar, recopilar información, agendar y escalar a una persona cuando el caso lo requiere.",
    detail:
      "Definimos qué puede responder el asistente, qué fuentes puede consultar y cuándo debe pasar la conversación a una persona. Probamos las rutas principales con lenguaje real para que la experiencia sea útil y reconocible.",
    benefits: [
      "Conversaciones alineadas con tu voz de marca",
      "Base de conocimiento con fuentes controladas",
      "Integración con tus canales y procesos",
      "Límites, registro y transferencia a humano",
    ],
  },
  {
    n: "05",
    icon: Sparkles,
    title: "IA Aplicada a Tu Contexto",
    stack: ["RAG", "Fine-tuning", "Local", "Cloud"],
    description:
      "Elegimos la arquitectura y el modelo a partir de tus datos, privacidad, presupuesto y objetivo. Puede ser local, en la nube o híbrido; justificamos la decisión y evitamos dependencias innecesarias.",
    detail:
      "Comparamos las opciones con casos de uso concretos y dejamos claros sus costes, límites y responsabilidades. El resultado es una base que puedes entender, evaluar y hacer evolucionar sin quedar atado a una única herramienta.",
    benefits: [
      "Búsqueda y respuestas sobre tu conocimiento",
      "Modelos visuales adaptados cuando aportan valor",
      "Privacidad y costes definidos desde el diseño",
      "Evaluación con casos reales antes de producción",
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

      {/* Decorative blue triangle accents */}
      <TriangleAccent
        position={{ top: "8%", right: "10%" }}
        variant="up"
        size={42}
        opacity={0.22}
        floatDelay={0.5}
      />
      <TriangleAccent
        position={{ bottom: "15%", left: "6%" }}
        variant="left"
        size={32}
        color="#56A0D2"
        opacity={0.2}
        delay={0.3}
        floatDelay={2}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* Header */}
        <div className="mb-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <RevealText as="span" className="kicker inline-block">
              Servicios
            </RevealText>
            <RevealText
              as="h2"
              delay={0.1}
              className="mt-6 font-display text-[clamp(2rem,5.5vw,5rem)] uppercase leading-[0.95] text-cream"
            >
              Lo que podemos
              <br />
              <span className="text-gradient-coral">crear contigo</span>
            </RevealText>
          </div>
          <RevealText
            as="p"
            delay={0.2}
            className="max-w-md text-mist leading-relaxed"
          >
            El alcance cambia con cada cliente. Estas son capacidades que
            combinamos para construir la respuesta adecuada, desde una landing
            singular hasta un sistema de automatización completo.
          </RevealText>
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
                    {s.n} / 05
                  </span>
                </div>

                {/* Title */}
                <RevealText
                  as="h3"
                  delay={0.15}
                  className="mb-4 font-display text-3xl text-cream lg:text-4xl"
                >
                  {s.title}
                </RevealText>

                {/* Stack pills */}
                <RevealText as="div" delay={0.25} className="mb-6 flex flex-wrap gap-2">
                  {s.stack.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-mist"
                    >
                      {t}
                    </span>
                  ))}
                </RevealText>

                {/* Description */}
                <RevealText
                  as="p"
                  delay={0.35}
                  className="mb-8 max-w-xl text-mist leading-relaxed"
                >
                  {s.description}
                </RevealText>

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

                {/* Expandable detail */}
                <details className="group/details mt-10">
                  <summary className="flex cursor-pointer list-none items-center gap-3 text-sm text-mist transition-colors hover:text-crab [&::-webkit-details-marker]:hidden">
                    <span className="link-underline">Conocer más</span>
                    <span aria-hidden className="text-lg leading-none">+</span>
                  </summary>
                  <div className="mt-6 border-t border-white/10 pt-5">
                    <div className="mb-2 text-xs uppercase tracking-[0.22em] text-mist">
                      Cómo lo abordamos
                    </div>
                    <p className="max-w-xl text-sm leading-relaxed text-cream/80">
                      {s.detail}
                    </p>
                  </div>
                </details>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
