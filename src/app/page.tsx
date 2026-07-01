import Cursor from "@/components/site/Cursor";
import Navigation from "@/components/site/Navigation";
import Hero from "@/components/site/Hero";
import Marquee from "@/components/site/Marquee";
import Manifesto from "@/components/site/Manifesto";
import Services from "@/components/site/Services";
import SwarmArchitecture from "@/components/site/SwarmArchitecture";
import Process from "@/components/site/Process";
import JJStack from "@/components/site/JJStack";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-abyss">
      <Cursor />
      <div className="noise-overlay" aria-hidden />
      <Navigation />
      <Hero />
      <Marquee />
      <Manifesto />
      <Services />
      <SwarmArchitecture />
      <Process />
      <JJStack />
      <Contact />
      <Footer />
    </main>
  );
}
