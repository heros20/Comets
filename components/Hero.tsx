"use client";
import { motion } from "framer-motion";
import { Users, Calendar } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import PopupPrenomStripe from "@/components/PopupPrenomStripe";

export default function Hero() {
  const [showTraining, setShowTraining] = useState(false);
  const [showCotisation, setShowCotisation] = useState(false);
  const trainingRef = useRef<HTMLDivElement>(null);

  // Fermer la bulle si clic hors de celle-ci
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        trainingRef.current &&
        !trainingRef.current.contains(event.target as Node)
      ) {
        setShowTraining(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9 }}
      className="relative py-20 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 flex flex-col items-center justify-center"
      id="accueil"
    >
      {/* Baseball SVG déco */}
      <svg
        width="440"
        height="440"
        viewBox="0 0 400 400"
        className="absolute -z-10 opacity-10 blur-[1.5px] top-10 left-1/2 -translate-x-1/2"
      >
        <circle cx="200" cy="200" r="180" fill="white" />
        <path
          d="M60,120 Q200,200 340,120"
          stroke="#c0392b"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M60,280 Q200,200 340,280"
          stroke="#c0392b"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-xl uppercase tracking-wider text-center">
        Rejoins les <span className="text-yellow-200">Comets</span> !
      </h2>
      <p className="text-xl md:text-2xl text-orange-100 mb-10 font-medium text-center max-w-2xl mx-auto">
        Passion, esprit d'équipe et excellence sur le terrain. Découvre le baseball
        à Honfleur avec une équipe qui gagne !
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
        <a
          href="#contact"
          className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white text-red-600 hover:bg-orange-50 text-lg font-bold shadow-lg transition-transform hover:scale-105"
        >
          <Users className="mr-2 h-5 w-5" />
          Nous Rejoindre
        </a>
        {/* Bouton "Voir les Entraînements" avec bulle horaires */}
        <div ref={trainingRef} className="relative inline-block">
          <button
            type="button"
            onClick={() => setShowTraining(s => !s)}
            className="inline-flex items-center justify-center px-8 py-3 rounded-full border-2 border-white text-white hover:bg-white hover:text-red-600 text-lg font-bold shadow-md transition-transform hover:scale-105 cursor-pointer select-none"
            aria-haspopup="true"
            aria-expanded={showTraining}
          >
            <Calendar className="mr-2 h-5 w-5" />
            Voir les Entraînements
          </button>
          {showTraining && (
            <div className="absolute top-full mt-2 right-0 w-48 bg-white-transparent rounded shadow-lg p-4 text-red-900 font-semibold text-sm z-50 border border-red-300">
              <div>Mardi : 17h - 19h</div>
              <div>Jeudi : 19h - 21h</div>
            </div>
          )}
        </div>
        {/* ---- BOUTON STRIPE CHECKOUT ---- */}
        <div className="relative inline-block">
          <button
            onClick={() => setShowCotisation(true)}
            className="inline-flex items-center justify-center px-8 py-3 rounded-full border-2 border-white text-white hover:bg-white hover:text-red-600 text-lg font-bold shadow-md transition-transform hover:scale-105 cursor-pointer select-none"
          >
            Payer la cotisation
          </button>
        </div>
      </div>
      {showCotisation && (
        <PopupPrenomStripe onClose={() => setShowCotisation(false)} />
      )}
    </motion.section>
  );
}
