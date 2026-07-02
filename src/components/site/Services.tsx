"use client";

import { motion } from "framer-motion";
import { Cpu, Workflow, Image as ImageIcon, Network } from "lucide-react";
import RevealText from "./RevealText";
import TriangleAccent from "./TriangleAccent";

const SERVICES = [
  {
    n: "01",
    icon: Workflow,
    title: "Marketing & Ventas que Convierten",
    stack: ["Automatización", "Lead Gen", "Funnels", "CRM"],
    description:
      "Más leads cualificados, menos tareas manuales. Diseñamos pipelines que captan, califican y nutren prospectos automáticamente — desde el primer contacto hasta la venta, con seguimientos que ningún equipo humano podría sostener 24/7.",
    benefits: [
      "Captación automática de leads con scoring inteligente",
      "Funnels completos: formulario → CRM → email/SMS → cierre",
      "Social Media Autopilot: contenido programado sin horas manuales",
      "Dashboards de conversión que entiende cualquier dueño de negocio",
    ],
  },
  {
    n: "02",
    icon: ImageIcon,
    title: "Contenido Visual que Escala",
    stack: ["Imágenes", "Video", "Brand", "Avatares"],
    description:
      "Assets de marca consistentes a demanda: imágenes de producto, videos verticales para Reels y TikTok, avatares parlantes para demos y onboarding. Tu marca con presencia profesional en cada canal, sin dependencias de diseñadores externos.",
    benefits: [
      "Imágenes de producto y lifestyle con estilo de marca consistente",
      "Videos verticales listos para Reels, TikTok y Shorts",
      "Avatares parlantes para demos, onboarding y FAQs",
      "Calidad de agencia, velocidad de IA, costo de cero",
    ],
  },
  {
    n: "03",
    icon: Network,
    title: "Atención al Cliente 24/7",
    stack: ["Chatbots", "Voice Agents", "WhatsApp", "Soporte"],
    description:
      "Chatbots y agentes de voz que atienden a tus clientes en cualquier momento, en su idioma, conociendo tu negocio. Resuelven consultas comunes, agendan citas y escalan a humano solo cuando es necesario — tus clientes nunca esperan.",
    benefits: [
      "Chatbots que conocen tu negocio y tu tono de marca",
      "Agentes de voz que atienden WhatsApp y llamadas 24/7",
      "Integración con Discord, Telegram y Slack",
      "Los modelos se entrenan con tu conocimiento, no genéricos",
    ],
  },
  {
    n: "04",
    icon: Cpu,
    title: "Sitios Web que Venden",
    stack: ["Landings", "E-commerce", "PWA", "SEO"],
    description:
      "Landing pages y sitios web de alta conversión, optimizados para velocidad y SEO. Diseñamos experiencias que cargan rápido, se ven increíbles y guían al visitante hacia la acción. Performance first: Core Web Vitals verdes desde el día uno.",
    benefits: [
      "Landings optimizadas para conversión desde el diseño",
      "Carga ultrarrápida: Core Web Vitals en verde",
      "SEO técnico: schema, sitemap, robots configurados",
      "PWA: tu sitio funciona incluso offline",
    ],
  },
  {
    n: "05",
    icon: ImageIcon,
    title: "Modelos Entrenados para Tu Nicho",
    stack: ["LoRA", "Fine-tuning", "Dominio", "Marca"],
    description:
      "No usamos modelos genéricos. Entrenamos IA especializada en tu industria — legal, inmobiliario, contable, SaaS — para que entienda tu jerga, tus procesos y tus clientes. La IA trabaja para ti, no para todos.",
    benefits: [
      "Modelos que hablan el lenguaje de tu industria",
      "Consistencia visual de marca en cada asset generado",
      "Conocimiento empresarial que no se va a la competencia",
      "Los pesos y modelos son tuyos, para siempre",
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
              Soluciones
              <br />
              de <span className="text-gradient-coral">impacto real</span>
            </RevealText>
          </div>
          <RevealText
            as="p"
            delay={0.2}
            className="max-w-md text-mist leading-relaxed"
          >
            No vendemos tecnología, vendemos resultados. Cada solución está
            diseñada para resolver un problema concreto de tu negocio — y tú
            posees todo al final. Sin cajas cerradas, sin dependencias.
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
