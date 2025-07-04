import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Team from "@/components/Team";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BaseballBalle from "@/components/BaseballBalle";
import BoutonAdmin from "@/components/BoutonAdmin";
import HymneComets from "@/components/HymneComets";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
    <div className="min-h-screen bg-white/40 ">
      <Header />
      <BoutonAdmin />
      <BaseballBalle />
      <Suspense>
        <Hero />
      </Suspense>
      <Stats />
      <Team />
      <Gallery />
      <Contact />
      <HymneComets />
      <Footer />
    </div>
    </>
  );
}
