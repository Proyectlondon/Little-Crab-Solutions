"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const LINKS = [
  { label: "Filosofía", href: "#filosofia" },
  { label: "Soluciones", href: "#servicios" },
  { label: "Swarm", href: "#swarm" },
  { label: "Proceso", href: "#proceso" },
  { label: "Nosotros", href: "#ecosistema" },
  { label: "Contacto", href: "#contacto" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#07090C]/85 backdrop-blur-xl border-b border-white/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-10">
          {/* Logo — animated crab on hover */}
          <a href="#top" className="flex items-center gap-3 group" data-hover>
            <div className="relative h-11 w-11 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:scale-105">
              {/* Rotating ring on hover */}
              <div className="absolute -inset-1 rounded-full border border-dashed border-crab/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:spin-slow" />
              <div className="relative h-full w-full overflow-hidden rounded-full ring-1 ring-white/10 transition-all duration-500 group-hover:ring-crab/60 group-hover:shadow-[0_0_24px_rgba(229,75,27,0.45)]">
                <Image
                  src="/logo.png"
                  alt="Little Crab Solutions"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6"
                  sizes="44px"
                />
              </div>
              {/* Tiny bubble ping on hover */}
              <span className="pointer-events-none absolute -right-1 -top-1 h-2 w-2 rounded-full bg-crab/60 opacity-0 transition-all duration-500 group-hover:scale-150 group-hover:opacity-0" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight text-cream transition-colors group-hover:text-crab">
                Little Crab
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-mist">
                Solutions
              </span>
            </div>
          </a>

          {/* Desktop links */}
          <nav className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="link-underline text-sm text-mist transition-colors hover:text-cream"
                data-hover
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contacto"
              className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-cream backdrop-blur transition-all hover:border-crab hover:text-crab"
              data-hover
            >
              Hablemos
              <span className="h-1.5 w-1.5 rounded-full bg-crab shadow-[0_0_10px_#E54B1B]" />
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 lg:hidden fixed top-4 right-4 top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))]"
              aria-label="Abrir menú"
              data-hover
            >
              <span className="text-lg">≡</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-abyss/95 backdrop-blur-xl"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-0 flex h-full w-[78%] max-w-sm flex-col gap-2 border-l border-white/10 bg-deep p-6"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.28em] text-mist">
                  Menú
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15"
                  aria-label="Cerrar menú"
                >
                  ✕
                </button>
              </div>
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.05 }}
                  className="border-b border-white/5 py-4 text-2xl font-display text-cream"
                >
                  {l.label}
                </motion.a>
              ))}
              <a
                href="#contacto"
                onClick={() => setOpen(false)}
                className="mt-8 inline-flex items-center justify-center rounded-full bg-crab px-6 py-3.5 text-sm font-semibold text-abyss"
              >
                Iniciar proyecto
              </a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
