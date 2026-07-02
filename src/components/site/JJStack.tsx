"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import RevealText from "./RevealText";

const ECOSYSTEM = [
  {
    t: "Orquestación · n8n",
    d: "Docker :5678. Workflows versionados en Git. 400+ nodos nativos: HubSpot, Notion, Slack, Meta Ads, GA4.",
  },
  {
    t: "Imágenes · ComfyUI",
    d: "RTX 4060 :8188. SDXL + LoRAs + ControlNet. Assets de marca con consistencia visual garantizada.",
  },
  {
    t: "Video · Hyperframes",
    d: "Python :5555. HTML/CSS → MP4 vertical 1080x1920. Reels y TikToks de script a publicación automática.",
  },
  {
    t: "LLM · Nemotron + Ollama",
    d: "NVIDIA API con fallback a Ollama local :11434. Modelos: Qwen3.5, Hermes3, Gemma4. Razonamiento en tu hardware.",
  },
  {
    t: "Voice · Chatterbox TTS",
    d: ":8888. Turbo (EN) + Multilingual V3 (ES). Voice cloning cross-lingual para avatares y agentes de voz.",
  },
  {
    t: "Interfaz · JARVIS HUD",
    d: ":8766 TLS. WebSocket + mic navegador + Whisper STT. Voice agents en tiempo real, 100% local.",
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
              Ecosistema JJ Stack
            </RevealText>
            <RevealText
              as="h2"
              delay={0.1}
              className="mt-6 font-display text-[clamp(2rem,5.5vw,5rem)] uppercase leading-[0.95] text-cream"
            >
              Stack técnico
              <br />
              <span className="text-gradient-ocean">100% local</span>
            </RevealText>
            <RevealText
              as="p"
              delay={0.2}
              className="mt-8 max-w-xl text-mist leading-relaxed"
            >
              Todo corre en LOCAL (Windows 10, RTX 4060 8GB). Cero dependencias
              de cloud para inferencia. Arquitectura Lego Bricks — cada pieza
              es un módulo &lt;200 líneas, desacoplado, reemplazable. Solo tú
              decides qué sale.
            </RevealText>

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
          <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {ECOSYSTEM.map((e, i) => (
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
      </div>
    </section>
  );
}
