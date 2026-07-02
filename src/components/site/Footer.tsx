"use client";

import Image from "next/image";

const COLS = [
  {
    title: "Servicios",
    links: [
      { l: "Automatización Marketing", h: "#servicios" },
      { l: "Contenido Visual", h: "#servicios" },
      { l: "IA Conversacional & Voice", h: "#servicios" },
      { l: "Desarrollo Web", h: "#servicios" },
      { l: "Fine-tuning & LoRAs", h: "#servicios" },
    ],
  },
  {
    title: "Compañía",
    links: [
      { l: "Filosofía Local-First", h: "#filosofia" },
      { l: "Proceso", h: "#proceso" },
      { l: "Ecosistema JJ Stack", h: "#ecosistema" },
      { l: "Contacto", h: "#contacto" },
    ],
  },
  {
    title: "Stack técnico",
    links: [
      { l: "n8n (Docker :5678)", h: "#servicios" },
      { l: "ComfyUI (RTX 4060 :8188)", h: "#servicios" },
      { l: "Ollama / Nemotron", h: "#servicios" },
      { l: "Chatterbox TTS", h: "#servicios" },
      { l: "Hyperframes", h: "#servicios" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10">
      <div className="absolute inset-0 grid-backdrop opacity-30" />
      <div className="glow-blob left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 bg-crab/10" />

      <div className="relative mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        {/* Top: brand + giant tagline */}
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-md ring-1 ring-white/10">
                <Image
                  src="/logo.png"
                  alt="Little Crab Solutions"
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold tracking-tight text-cream">
                  Little Crab Solutions
                </span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-mist">
                  JJ Stack Ecosystem
                </span>
              </div>
            </div>
            <p className="mt-6 max-w-xs text-sm text-mist leading-relaxed">
              Agencia boutique de IA para PYMEs en Latam. Stack propio local:
              tu inteligencia, tu hardware, tus reglas.
            </p>
          </div>

          {COLS.map((c) => (
            <div key={c.title}>
              <h4 className="mb-4 text-xs uppercase tracking-[0.22em] text-crab">
                {c.title}
              </h4>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.l}>
                    <a
                      href={l.h}
                      className="link-underline text-sm text-mist hover:text-cream"
                    >
                      {l.l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Big wordmark */}
        <div className="my-16 overflow-hidden border-y border-white/10 py-12">
          <div className="font-display text-[clamp(2.5rem,11vw,11rem)] uppercase leading-[0.85] tracking-tight text-cream/90">
            Little Crab
            <span className="text-crab">.</span>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col items-start justify-between gap-4 text-xs text-mist md:flex-row md:items-center">
          <div>
            © {new Date().getFullYear()} Little Crab Solutions · Hecho en Medellín para Latam
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-crab shadow-[0_0_10px_#E54B1B]" />
              100% local · Sin vendor lock-in · Garantía 30d
            </span>
            <a href="#top" className="link-underline hover:text-cream">
              Volver arriba ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
