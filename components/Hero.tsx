"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Calendar, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PopupPrenomStripe from "@/components/PopupPrenomStripe";

export default function Hero() {
  const [showModal, setShowModal] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState<"success" | "error" | null>(null);
  const [showStripe, setShowStripe] = useState(false);
  const params = useSearchParams();

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
      className="relative py-20 flex flex-col items-center justify-center overflow-hidden"
      id="accueil"
      aria-label="Section d'accueil, club de baseball Les Comets d'Honfleur"
    >
      {/* Overlay translucide blanc */}
      <div className="absolute inset-0 z-0 bg-white opacity-10 pointer-events-none" />

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* --- PAS DE SVG ICI, ADIEU LA BALLE DE BASEBALL --- */}

        {/* --- TITRE H1 optimisé --- */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-xl uppercase tracking-wider text-center">
          Rejoins le club de baseball <span className="text-yellow-200"></span> à Honfleur !
        </h1>
        {/* --- sous-titre H2 SEO-only, masqué mais indexé --- */}
        <h2 className="sr-only">
          Équipe de baseball à Honfleur, Les Comets : club sportif en Normandie, entraînements, matchs et passion du baseball.
        </h2>
        {/* --- Paragraphe avec mots-clés, rendu bien lisible --- */}
        <p className="text-xl md:text-2xl text-gray-800 drop-shadow font-medium text-center max-w-2xl mx-auto mb-10">
          Découvre le <strong className="text-red-700 font-extrabold drop-shadow-sm">baseball à Honfleur</strong> avec Les Comets :{" "}
          <span className="font-bold text-orange-600">club familial et ambitieux</span> en Normandie.<br />
          <span className="text-gray-900 font-semibold">
            Passion, esprit d'équipe, matchs et entraînements ouverts à tous. Rejoins-nous sur le terrain !
          </span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white text-red-600 hover:bg-orange-50 text-lg font-bold shadow-lg transition-transform hover:scale-105"
            aria-label="Contact équipe de baseball Honfleur"
          >
            <Users className="mr-2 h-5 w-5" />
            Nous contacter
          </a>
          {/* ---- BOUTON POPUP ENTRAINEMENTS ---- */}
          <button
            type="button"
            onClick={() => setShowTrainingModal(true)}
            className="inline-flex items-center justify-center px-8 py-3 rounded-full border-2 border-white text-white hover:bg-white hover:text-red-600 text-lg font-bold shadow-md transition-transform hover:scale-105 cursor-pointer select-none"
            aria-label="Voir les entraînements baseball Comets Honfleur"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Voir les Entraînements
          </button>
          {/* ---- BOUTON NOUS REJOINDRE ---- */}
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center px-8 py-3 rounded-full border-2 border-white text-white hover:bg-white hover:text-red-600 text-lg font-bold shadow-md transition-transform hover:scale-105 cursor-pointer select-none"
            aria-label="Inscription club baseball Honfleur"
          >
            Nous rejoindre
          </button>
        </div>

        {/* ------ MODALE ENTRAÎNEMENTS ------ */}
        <AnimatePresence>
          {showTrainingModal && (
            <motion.div
              key="modal-training"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              onClick={() => setShowTrainingModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 60 }}
                animate={{ scale: 1, opacity: 1, y: 0, transition: { type: "spring", duration: 0.33 } }}
                exit={{ scale: 0.92, opacity: 0, y: 40, transition: { duration: 0.18 } }}
                className="bg-white rounded-3xl shadow-2xl max-w-lg w-[94vw] p-8 sm:p-12 flex flex-col items-center gap-6 relative"
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-entrainements-title"
              >
                <h2
                  id="modal-entrainements-title"
                  className="text-3xl font-extrabold text-orange-600 mb-4 text-center"
                >
                  Les entraînements du club de baseball Comets Honfleur
                </h2>
                <div className="text-lg text-gray-800 mb-2 text-center">
                  <span className="block mb-2 font-bold text-red-600 text-xl">
                    Jeudi&nbsp;: <span className="text-orange-500 font-extrabold">Entraînement complet</span>
                  </span>
                  <span className="block text-base text-gray-600 mb-4">
                    Tous les joueurs, tous niveaux.<br />
                    Travail d'équipe, jeux de match, batting, défense et bonne humeur sur le terrain de baseball à Honfleur !
                  </span>
                  <span className="block mb-2 font-bold text-red-600 text-xl">
                    Mardi&nbsp;: <span className="text-orange-500 font-extrabold">Entraînement Pitcher/Catcher</span>
                  </span>
                  <span className="block text-base text-gray-600">
                    Spécial lanceurs & receveurs.<br />
                    Précision, puissance, technique, et secrets du <strong>baseball à Honfleur</strong>…
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 w-full mt-6">
                  <a
                    href="#contact"
                    onClick={() => setShowTrainingModal(false)}
                    className="text-base text-gray-700 hover:text-red-600 font-medium transition-colors underline underline-offset-2"
                  >
                    Nous contacter
                  </a>
                  <button
                    onClick={() => setShowTrainingModal(false)}
                    className="text-gray-500 hover:text-red-700 font-semibold underline mt-2"
                  >
                    Fermer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ------ MODALE NOUS REJOINDRE ------ */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              key="modal-rejoindre"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 60 }}
                animate={{ scale: 1, opacity: 1, y: 0, transition: { type: "spring", duration: 0.33 } }}
                exit={{ scale: 0.92, opacity: 0, y: 40, transition: { duration: 0.18 } }}
                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-[94vw] p-8 sm:p-12 flex flex-col items-center gap-6 relative"
                style={{ minHeight: "420px" }}
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-rejoindre-title"
              >
                <h2
                  id="modal-rejoindre-title"
                  className="text-3xl font-extrabold text-red-700 mb-2"
                >
                  Inscription au club de baseball Les Comets d'Honfleur
                </h2>
                <p className="text-gray-700 text-lg text-center mb-2">
                  Tu veux t’inscrire, devenir membre du club de baseball d'Honfleur ou juste nous poser des questions ?<br />
                  <span className="text-orange-500 font-bold">On t’attend, champion !</span>
                </p>
                <ul className="mb-4 text-base text-gray-700 text-left max-w-md mx-auto list-disc list-inside">
                  <li>Accès à tous les entraînements et matchs à Honfleur</li>
                  <li>Assurance sportive incluse pour tous les membres</li>
                  <li>Ambiance et progrès garantis 🏆</li>
                </ul>
                <button
                  onClick={() => { setShowModal(false); setShowStripe(true); }}
                  className="px-6 py-3 rounded-lg bg-orange-500 text-white font-bold shadow hover:bg-orange-600 transition"
                >
                  Payer la cotisation
                </button>
                <a
                  href="#contact"
                  onClick={() => setShowModal(false)}
                  className="mt-2 text-base text-gray-700 hover:text-red-600 font-medium transition-colors underline underline-offset-2"
                >
                  Nous contacter
                </a>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-6 text-gray-500 hover:text-red-700 font-semibold underline"
                >
                  Fermer
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ------ POPUP STRIPE ------ */}
        {showStripe && (
          <PopupPrenomStripe onClose={() => setShowStripe(false)} />
        )}

        {/* ------ POPUP MODALE PAIEMENT ------ */}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full relative flex flex-col items-center border-2 border-orange-400 animate-fade-in">
              {popupType === "success" ? (
                <>
                  <CheckCircle className="w-14 h-14 text-green-600 mb-2" />
                  <div className="text-2xl font-bold text-green-800 mb-2">Paiement réussi !</div>
                  <div className="text-lg text-gray-700 mb-2">Bienvenue chez les Comets, club de baseball à Honfleur.</div>
                </>
              ) : (
                <>
                  <XCircle className="w-14 h-14 text-red-500 mb-2" />
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

        <style jsx>{`
          .animate-fade-in {
            animation: fade-in 0.35s cubic-bezier(0.39, 0.575, 0.565, 1) both;
          }
          @keyframes fade-in {
            0% { opacity: 0; transform: translateY(40px) scale(0.96);}
            100% { opacity: 1; transform: translateY(0) scale(1);}
          }
        `}</style>
      </div>
    </motion.section>
  );
}
