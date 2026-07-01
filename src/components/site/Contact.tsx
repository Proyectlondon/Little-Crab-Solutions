"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const SCOPES = [
  "Modelos locales (Ollama)",
  "Automatización (n8n)",
  "Multimedia (ComfyUI)",
  "Arquitectura Swarm",
  "Auditoría completa",
];

export default function Contact() {
  const [scope, setScope] = useState<string[]>(["Auditoría completa"]);
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
      className="relative overflow-hidden bg-deep py-32 lg:py-44"
    >
      <div className="glow-blob left-[-150px] bottom-[-150px] h-[500px] w-[500px] bg-crab/20" />
      <div className="absolute inset-0 grid-backdrop opacity-30" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr]">
          {/* Left: pitch */}
          <div>
            <span className="kicker">Contacto</span>
            <h2 className="mt-6 font-display text-[clamp(2.2rem,6vw,5.5rem)] uppercase leading-[0.92] text-cream">
              Construye
              <br />
              <span className="text-gradient-coral">tu IA privada</span>
              <br />
              esta semana.
            </h2>
            <p className="mt-8 max-w-md text-mist leading-relaxed">
              Cuéntanos qué quieres automatizar. En menos de 24 horas
              hábiles te enviamos un diagnóstico inicial con la arquitectura
              Swarm propuesta y los modelos recomendados para tu hardware.
            </p>

            <div className="mt-12 space-y-6">
              {[
                { k: "Email", v: "hola@littlecrab.solutions" },
                { k: "Ecosistema", v: "JJ Stack · Latam" },
                { k: "Cobertura", v: "Remoto · On-site en clientes clave" },
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
            initial={{ opacity: 0, y: 30 }}
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
