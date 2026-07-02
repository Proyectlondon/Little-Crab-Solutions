import CrabCursor from "@/components/site/CrabCursor";
import AudioToggle from "@/components/site/AudioToggle";
import Navigation from "@/components/site/Navigation";
import Hero from "@/components/site/Hero";
import Manifesto from "@/components/site/Manifesto";
import Services from "@/components/site/Services";
import SwarmArchitecture from "@/components/site/SwarmArchitecture";
import Process from "@/components/site/Process";
import JJStack from "@/components/site/JJStack";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-transparent">
      {/* Crab cursor (desktop only) + Audio toggle */}
      <CrabCursor />
      <AudioToggle />

      {/* Noise overlay */}
      <div className="noise-overlay" aria-hidden />

      {/* All content sits above the ocean layer */}
      <div className="relative z-10">
        <Navigation />
        <Hero />
        <Manifesto />
        <Services />
        <SwarmArchitecture />
        <Process />
        <JJStack />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
