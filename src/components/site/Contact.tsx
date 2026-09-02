"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import RevealText from "./RevealText";

const SCOPES = [
  "Producto o sitio web",
  "Automatización",
  "Contenido visual",
  "Asistente conversacional",
  "IA aplicada",
];

// Formspree endpoint — Reemplaza con tu Form ID real
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mzdlkjqv";

export default function Contact() {
  const [scope, setScope] = useState<string[]>(["Producto o sitio web"]);
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
      scopes: scope.join(", "),
    };

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Solicitud recibida", {
          description:
            "Te contactaremos en menos de 24h hábiles para agendar el diagnóstico.",
        });
        (e.target as HTMLFormElement).reset();
        setScope([]);
      } else {
        const data = await res.json();
        throw new Error(data.error || "Error al enviar");
      }
    } catch (err) {
      toast.error("Error al enviar", {
        description:
          "Intenta de nuevo o escríbenos directo a littlecrabsolutions@gmail.com",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contacto" className="relative py-32 lg:py-44">
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
              ¿Qué quieres
              <br />
              <span className="text-gradient-coral">hacer posible</span>
              <br />
              con nosotros?
            </RevealText>
            <RevealText
              as="p"
              delay={0.2}
              className="mt-8 max-w-md text-mist leading-relaxed"
            >
              Cuéntanos qué estás imaginando, qué necesitas resolver y por qué es
              importante para ti. En la primera conversación aclaramos el reto,
              el mejor punto de partida y si somos el equipo adecuado para
              construirlo contigo.
            </RevealText>

            <div className="mt-12 space-y-6">
              {[
                { k: "Email", v: "littlecrabsolutions@gmail.com", href: "mailto:littlecrabsolutions@gmail.com" },
                { k: "WhatsApp", v: "+57 310 432 8783", href: "https://wa.me/573104328783?text=Hola%20Little%20Crab" },
                { k: "Ubicación", v: "Tocancipá, Cundinamarca · Latam" },
              ].map((row) => (
                <div
                  key={row.k}
                  className="flex flex-col gap-1 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-xs uppercase tracking-[0.22em] text-mist">
                    {row.k}
                  </span>
                  <span className="text-cream">
                    {row.href ? (
                      <a href={row.href} target="_blank" rel="noopener noreferrer" className="hover:text-crab underline">
                        {row.v}
                      </a>
                    ) : (
                      row.v
                    )}
                  </span>
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
            action={FORMSPREE_ENDPOINT}
            method="POST"
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
                      aria-pressed={active}
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
                placeholder="Cuéntanos la idea, el problema y lo que te gustaría que las personas sintieran o lograran."
              />
            </label>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
              <p className="max-w-xs text-xs text-mist">
                Usaremos estos datos para responder tu solicitud. El envío se
                procesa de forma segura mediante Formspree.
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
