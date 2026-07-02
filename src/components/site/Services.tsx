"use client";

import { motion } from "framer-motion";
import { Cpu, Workflow, Image as ImageIcon, Network } from "lucide-react";
import RevealText from "./RevealText";
import TriangleAccent from "./TriangleAccent";

const SERVICES = [
  {
    n: "01",
    icon: Workflow,
    title: "Automatización de Marketing & Ventas",
    stack: ["n8n", "Lead Gen V5", "CRM", "WhatsApp"],
    description:
      "Lead Gen V5 con scoring determinista, funnels completos de formularios a secuencias email/SMS con notificación voz (Chatterbox TTS), y Social Media Autopilot que publica en LinkedIn, Twitter e IG sin horas manuales.",
    benefits: [
      "Lead Gen: Google Alerts → Scoring JS → Outreach",
      "Funnels: Form → Enriquecimiento → CRM → Email/SMS",
      "Social Autopilot: Calendar → Copy + Imagen → Video → Buffer",
      "Reporting: GA4 + Meta Ads → Dashboard cada lunes 9am",
    ],
  },
  {
    n: "02",
    icon: ImageIcon,
    title: "Contenido Visual · ComfyUI + Hyperframes",
    stack: ["SDXL", "LoRAs", "ControlNet", "Hyperframes"],
    description:
      "Imágenes de marca con estilo consistente vía LoRAs entrenadas a tu negocio, video vertical (Reels/TikTok/Shorts) de script a MP4 1080x1920 con TTS local y subtítulos animados, y avatares parlantes para demos y onboarding.",
    benefits: [
      "Product shots, lifestyle, hero sections — LoRA de marca",
      "Video vertical: Script → Hyperframes → TTS → Subtítulos",
      "Avatares parlantes con voice cloning",
      "Consistencia visual garantizada en cada asset",
    ],
  },
  {
    n: "03",
    icon: Network,
    title: "IA Conversacional & Voice",
    stack: ["Ollama", "Chatterbox", "JARVIS HUD", "Whisper"],
    description:
      "Chatbots especializados fine-tuned en tu dominio, voice agents con JARVIS HUD (WebSocket TLS + mic navegador) que van de STT a LLM a TTS en bucle, e integración con Discord/Telegram/Slack vía MCP.",
    benefits: [
      "Chatbots fine-tuned (LoRA) en tu nicho",
      "Voice agents: Whisper → Nemotron/Ollama → Chatterbox",
      "JARVIS HUD con WebSocket TLS seguro",
      "Bots en Discord/Telegram/Slack con acceso a tu FS",
    ],
  },
  {
    n: "04",
    icon: Cpu,
    title: "Desarrollo Web & Landing Pages",
    stack: ["Next.js", "Tailwind", "Shadcn", "PWA"],
    description:
      "Landing pages de alta conversión con estructura Hero → Beneficios → Prueba social → FAQ → CTA sticky. Design System propio con 67 estilos visuales y 161 industrias. Performance first: Core Web Vitals verdes, PWA, SEO técnico.",
    benefits: [
      "Landings de alta conversión listas para producción",
      "Design System: 67 estilos, 161 industrias",
      "Core Web Vitals verdes, PWA, SEO técnico",
      "Schema.org, sitemap, robots — todo configurado",
    ],
  },
  {
    n: "05",
    icon: ImageIcon,
    title: "Entrenamiento & Fine-tuning",
    stack: ["Kohya", "LoRA", "QLoRA 4-bit", "Qwen3.5"],
    description:
      "LoRAs de marca con 50-100 imágenes para consistencia visual garantizada en ComfyUI, y modelos de dominio con QLoRA 4-bit en Qwen3.5/Hermes3 para especialistas en tu nicho: legal, inmobiliario, contable, SaaS.",
    benefits: [
      "LoRA de marca: 50-100 imgs → 1.5-3GB → consistencia total",
      "Modelos de dominio: QLoRA 4-bit en Qwen3.5/Hermes3",
      "Especialistas en legal, inmobiliario, contable, SaaS",
      "Pesos y modelos son tuyos para siempre",
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
              Cinco capas
              <br />
              de <span className="text-gradient-coral">ingeniería</span>
            </RevealText>
          </div>
          <RevealText
            as="p"
            delay={0.2}
            className="max-w-md text-mist leading-relaxed"
          >
            Stack propio: n8n + ComfyUI + Hyperframes + Ollama. Cada servicio
            entrega código, workflows y modelos que tú posees. Arquitectura
            Lego Bricks — cada pieza reemplazable, nada te ata a un vendor.
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
