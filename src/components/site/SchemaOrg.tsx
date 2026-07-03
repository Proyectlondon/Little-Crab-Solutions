"use client";

import { useEffect } from "react";

const schema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Little Crab Solutions",
  url: "https://little-crab-solutions.vercel.app",
  logo: "https://little-crab-solutions.vercel.app/logo.png",
  sameAs: [
    "https://wa.me/573104328783",
    "mailto:littlecrabsolutions@gmail.com",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tocancipá",
    addressRegion: "Cundinamarca",
    addressCountry: "CO",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+57-310-432-8783",
    contactType: "customer service",
    availableLanguage: ["Spanish", "English"],
  },
};

export default function SchemaOrg() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    script.id = "schema-org-org";
    document.head.appendChild(script);
    return () => document.getElementById("schema-org-org")?.remove();
  }, []);

  return null;
}