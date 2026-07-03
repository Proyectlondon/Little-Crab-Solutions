import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import OceanAmbient from "@/components/site/OceanAmbient";
import SchemaOrg from "@/components/site/SchemaOrg";

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
  title: "Little Crab Solutions — Soluciones de IA para PYMEs en Latam",
  description:
    "Soluciones de IA que trabajan 24/7 por tu negocio: marketing automatizado, contenido que escala, atención al cliente 24/7 y sitios web que venden. Todo en tu infraestructura, sin suscripciones a la nube, sin vendor lock-in.",
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
    url: "https://little-crab-solutions.vercel.app",
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
    <html lang="es" suppressHydrationWarning className="dark bg-background">
      <head>
        <SchemaOrg />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased text-foreground relative`}
        style={{ backgroundColor: "transparent" }}
      >
        {/* Global ocean ambient — fixed canvas, paints the ocean directly on top of html bg */}
        <OceanAmbient />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
