"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Team from "@/components/Team";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BaseballBalle from "@/components/BaseballBalle";
import BoutonAdmin from "@/components/BoutonAdmin";
import HymneComets from "@/components/HymneComets";
import { InfosComponent } from "@/components/InfosComponent";
import { Suspense } from "react";

export default function Home() {
  const [showHymn, setShowHymn] = useState(false);

  return (
    <div className="min-h-screen bg-white/40 ">
      {/* On passe la prop à Header */}
      <Header onLogoClick={() => setShowHymn(v => !v)} />
      <BoutonAdmin />
      <BaseballBalle />
      <Suspense>
        <Hero />
      </Suspense>
      <InfosComponent />
      <Team />
      <Gallery />
      <Contact />
      {/* Affichage conditionnel de l'hymne */}
      {showHymn && <HymneComets />}
      <Footer />
    </div>
  );
}
