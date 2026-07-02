"use client";

const ITEMS = [
  "Ollama",
  "Qwen 2.5 Coder",
  "Llama 3",
  "Hermes",
  "n8n",
  "ComfyUI",
  "Stable Diffusion",
  "Flux",
  "Swarm Architecture",
  "Local-First",
  "Nvidia GPU",
  "WhatsApp Webhooks",
  "CRM Pipelines",
  "Zero Cloud APIs",
];

export default function Marquee() {
  return (
    <section
      aria-hidden
      className="relative border-y border-white/10 bg-deep/25 py-6 overflow-hidden backdrop-blur-[1px]"
    >
      <div className="marquee-track">
        {[...ITEMS, ...ITEMS].map((it, i) => (
          <span key={i} className="mx-8 inline-flex items-center gap-8">
            <span className="font-display text-2xl text-cream/90 sm:text-3xl">
              {it}
            </span>
            <span className="text-crab text-2xl">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
