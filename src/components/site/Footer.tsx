"use client";

import Image from "next/image";

const COLS = [
  {
    title: "Servicios",
    links: [
      { l: "Ollama local", h: "#servicios" },
      { l: "n8n workflows", h: "#servicios" },
      { l: "ComfyUI difusión", h: "#servicios" },
      { l: "Swarm de agentes", h: "#swarm" },
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
      { l: "Qwen 2.5 Coder", h: "#servicios" },
      { l: "Llama 3", h: "#servicios" },
      { l: "Stable Diffusion / Flux", h: "#servicios" },
      { l: "Nvidia local", h: "#ecosistema" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-abyss/60 backdrop-blur-[1px]">
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
              Boutique de ingeniería en IA Local-First. Tu inteligencia,
              tu hardware, tus reglas.
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
            © {new Date().getFullYear()} Little Crab Solutions · Parte del
            ecosistema JJ Stack
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-crab shadow-[0_0_10px_#E54B1B]" />
              Local-First · 100% privado
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
