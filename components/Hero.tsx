"use client";
import { motion } from "framer-motion";
import { Users, Calendar, CheckCircle, XCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PopupPrenomStripe from "@/components/PopupPrenomStripe";

export default function Hero() {
  const [showTraining, setShowTraining] = useState(false);
  const [showCotisation, setShowCotisation] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState<"success" | "error" | null>(null);
  const trainingRef = useRef<HTMLDivElement>(null);
  const params = useSearchParams();

  // Gestion du clic hors bulle entraînements
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

  // Gestion des messages Stripe via l'URL et affichage popup
  useEffect(() => {
    const paymentSuccess = params.get("success");
    const paymentCanceled = params.get("canceled");
    if (paymentSuccess) {
      setPopupType("success");
      setShowPopup(true);
    } else if (paymentCanceled) {
      setPopupType("error");
      setShowPopup(true);
    }

    // Nettoyage URL après popup
    if ((paymentSuccess || paymentCanceled) && typeof window !== "undefined") {
      const clean = () => {
        const url = window.location.pathname;
        window.history.replaceState({}, document.title, url);
      };
      const timeout = setTimeout(() => {
        setShowPopup(false);
        setPopupType(null);
        clean();
      }, 6000);
      return () => clearTimeout(timeout);
    }
  }, [params]);

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

      {/* ------ POPUP MODALE PAIEMENT ------ */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full relative flex flex-col items-center border-2 border-orange-400 animate-fade-in">
            {popupType === "success" ? (
              <>
                <CheckCircle className="w-14 h-14 text-green-600 mb-2" />
                <div className="text-2xl font-bold text-green-800 mb-2">Paiement réussi !</div>
                <div className="text-lg text-gray-700 mb-2">Bienvenue chez les Comets.</div>
              </>
            ) : (
              <>
                <svg className="w-14 h-14 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <div className="text-2xl font-bold text-red-800 mb-2">Erreur de paiement</div>
                <div className="text-lg text-gray-700 mb-2">Ton paiement n&apos;a pas été validé.</div>
              </>
            )}
            <button
              className="absolute top-3 right-3 text-xl text-gray-500 hover:text-orange-500 font-bold"
              onClick={() => setShowPopup(false)}
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Animation d'apparition (facultative) */}
      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 0.35s cubic-bezier(0.39, 0.575, 0.565, 1) both;
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(40px) scale(0.96);}
          100% { opacity: 1; transform: translateY(0) scale(1);}
        }
      `}</style>
    </motion.section>
  );
}
