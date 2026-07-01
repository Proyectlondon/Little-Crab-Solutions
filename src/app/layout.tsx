import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Little Crab Solutions — Private Local-First AI Engineering",
  description:
    "Boutique de ingeniería tecnológica especializada en automatización con Inteligencia Artificial Local-First. Ollama, n8n, ComfyUI y arquitectura Swarm sobre tu propio hardware. 100% privado, seguro y sin suscripciones a la nube.",
  keywords: [
    "Little Crab Solutions",
    "JJ Stack",
    "Local-First AI",
    "Ollama",
    "n8n",
    "ComfyUI",
    "Swarm Architecture",
    "Private AI",
    "Automatización IA",
    "Qwen 2.5 Coder",
    "Llama 3",
    "Stable Diffusion",
  ],
  authors: [{ name: "Little Crab Solutions — JJ Stack Ecosystem" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Little Crab Solutions — Private Local-First AI Engineering",
    description:
      "IA generativa y automatización 100% privada sobre tu propio hardware. Sin APIs en la nube. Sin costo de tokens.",
    url: "https://littlecrab.solutions",
    siteName: "Little Crab Solutions",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Little Crab Solutions — Private Local-First AI",
    description: "IA generativa y automatización 100% privada sobre tu propio hardware.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
