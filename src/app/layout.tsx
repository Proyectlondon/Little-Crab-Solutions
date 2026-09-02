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
  title: "Little Crab Solutions — Diseño, software e IA a medida",
  description:
    "Creamos productos digitales, automatizaciones y sistemas de IA que expresan la identidad de cada cliente y encajan en su forma de trabajar.",
  keywords: [
    "Little Crab Solutions",
    "diseño web Colombia",
    "desarrollo de software a medida",
    "automatización IA",
    "diseño de producto digital",
    "IA para PYMEs",
    "contenido visual con IA",
    "local-first AI",
  ],
  authors: [{ name: "Little Crab Solutions" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Little Crab Solutions — Tecnología con tu esencia",
    description:
      "Diseño, software, automatización e IA creados a la medida de tu negocio y tu identidad.",
    url: "https://little-crab-solutions.vercel.app",
    siteName: "Little Crab Solutions",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Little Crab Solutions — Tecnología con tu esencia",
    description: "Diseño, software, automatización e IA creados a tu medida.",
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
