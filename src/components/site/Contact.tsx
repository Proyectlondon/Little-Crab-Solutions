"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import RevealText from "./RevealText";

const SCOPES = [
  "Automatización Marketing (n8n)",
  "Contenido Visual (ComfyUI)",
  "IA Conversacional & Voice",
  "Desarrollo Web & Landings",
  "Fine-tuning & LoRAs",
];

export default function Contact() {
  const [scope, setScope] = useState<string[]>(["Automatización Marketing (n8n)"]);
  const [sending, setSending] = useState(false);

  const toggleScope = (s: string) => {
    setScope((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      company: fd.get("company"),
      message: fd.get("message"),
      scopes: scope,
    };
    // Simulate async — no backend required for this deliverable
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    toast.success("Solicitud recibida", {
      description:
        "Te contactaremos en menos de 24h hábiles para agendar el diagnóstico.",
    });
    (e.target as HTMLFormElement).reset();
    setScope([]);
  };

  return (
    <section
      id="contacto"
      className="relative py-32 lg:py-44"
    >
      <div className="glow-blob left-[-150px] bottom-[-150px] h-[500px] w-[500px] bg-crab/20" />
      <div className="absolute inset-0 grid-backdrop opacity-30" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr]">
          {/* Left: pitch */}
          <div>
            <RevealText as="span" className="kicker inline-block">
              Contacto
            </RevealText>
            <RevealText
              as="h2"
              delay={0.1}
              className="mt-6 font-display text-[clamp(2.2rem,6vw,5.5rem)] uppercase leading-[0.92] text-cream"
            >
              ¿Listo para tu
              <br />
              <span className="text-gradient-coral">ejército de IA</span>
              <br />
              local?
            </RevealText>
            <RevealText
              as="p"
              delay={0.2}
              className="mt-8 max-w-md text-mist leading-relaxed"
            >
              Agenda una llamada de 30 min sin compromiso. Revisamos tu stack
              actual, definimos el primer workflow de alto impacto, y te damos
              hoja de ruta clara. Garantía: si el piloto no mejora tu métrica
              objetivo en 30 días, devolvemos el 50%.
            </RevealText>

            <div className="mt-12 space-y-6">
              {[
                { k: "Calendly", v: "calendly.com/little-crab-solutions" },
                { k: "Email", v: "hola@littlecrabsolutions.com" },
                { k: "WhatsApp", v: "+57 310 432 8783" },
                { k: "Discord", v: "JJ Agent#5950 — pruébalo" },
                { k: "Ubicación", v: "Medellín, Colombia · Latam" },
              ].map((row) => (
                <div
                  key={row.k}
                  className="flex flex-col gap-1 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-xs uppercase tracking-[0.22em] text-mist">
                    {row.k}
                  </span>
                  <span className="text-cream">{row.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <motion.form
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={onSubmit}
            className="rounded-2xl border border-white/10 bg-abyss/60 p-8 backdrop-blur-xl lg:p-12"
          >
            <div className="grid gap-8 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.22em] text-mist">
                  Nombre
                </span>
                <input
                  required
                  name="name"
                  className="lcs-input"
                  placeholder="¿Cómo te llamas?"
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.22em] text-mist">
                  Email
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  className="lcs-input"
                  placeholder="tu@empresa.com"
                />
              </label>
            </div>

            <label className="mt-8 block">
              <span className="text-xs uppercase tracking-[0.22em] text-mist">
                Empresa
              </span>
              <input
                name="company"
                className="lcs-input"
                placeholder="Nombre de tu organización"
              />
            </label>

            {/* Scopes */}
            <div className="mt-8">
              <span className="text-xs uppercase tracking-[0.22em] text-mist">
                Áreas de interés
              </span>
              <div className="mt-4 flex flex-wrap gap-2">
                {SCOPES.map((s) => {
                  const active = scope.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleScope(s)}
                      className={`rounded-full border px-4 py-2 text-sm transition-all ${
                        active
                          ? "border-crab bg-crab text-abyss"
                          : "border-white/15 text-mist hover:border-crab hover:text-cream"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="mt-8 block">
              <span className="text-xs uppercase tracking-[0.22em] text-mist">
                Mensaje
              </span>
              <textarea
                name="message"
                rows={4}
                className="lcs-input resize-none"
                placeholder="Cuéntanos tu caso de uso, hardware disponible y restricciones."
              />
            </label>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
              <p className="max-w-xs text-xs text-mist">
                Al enviar aceptas ser contactado por el equipo de Little Crab
                Solutions. Nunca compartimos tu información.
              </p>
              <button
                type="submit"
                disabled={sending}
                className="magnetic-btn disabled:opacity-60"
                data-hover
              >
                {sending ? "Enviando…" : "Enviar solicitud"}
                {!sending && <span aria-hidden>→</span>}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
