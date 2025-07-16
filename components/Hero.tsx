// components/Hero.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Calendar, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PopupPrenomStripe from "@/components/PopupPrenomStripe";

export default function Hero() {
  // ... (rien à changer dans la logique JS)

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9 }}
      className="relative py-20 flex flex-col items-center justify-center overflow-hidden"
      id="accueil"
      aria-label="Section d'accueil, club de baseball Les Comets d'Honfleur"
    >
      <div className="absolute inset-0 z-0 bg-white opacity-10 pointer-events-none" />

     <div className="relative z-10 w-full flex flex-col items-center">
  {/* --- TITRE H1 SEO --- */}
  <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-xl uppercase tracking-wider text-center">
    Honfleur Baseball-Club
    <span className="text-white font-extrabold mx-2" aria-hidden="true">–</span>
    <span className="text-orange-400 font-extrabold">LES COMETS</span>
  </h1>
        {/* --- sous-titre H2 SEO-only --- */}
        <h2 className="sr-only">
          Équipe de baseball à Honfleur, Les Comets : club sportif en Normandie, entraînements, matchs et passion du baseball.
        </h2>
        {/* --- Paragraphe d’accroche --- */}
        <p className="text-xl md:text-2xl text-gray-800 drop-shadow font-medium text-center max-w-2xl mx-auto mb-10">
          Rejoins le club de baseball à Honfleur ! <br />
          Découvre le <strong className="text-red-700 font-extrabold drop-shadow-sm">baseball à Honfleur</strong> avec Les Comets :{" "}
          <span className="font-bold text-orange-600">club familial et motivé</span> en Normandie.<br />
          <span className="text-gray-900 font-semibold">
            Passion, esprit d'équipe, matchs et entraînements ouverts à tous. Rejoins-nous sur le terrain !
          </span>
        </p>
        {/* ...Le reste ne bouge pas */}
        {/* ... */}
      </div>
    </motion.section>
  );
}
