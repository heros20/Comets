"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HymneCometsAccordion() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  useEffect(() => {
    // Pause la musique si on ferme l'onglet
    if (!isOpen && isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isOpen, isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressBarRef.current;
    if (!audio || !bar) return;

    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = Math.min(Math.max(clickX / rect.width, 0), 1);
    audio.currentTime = clickRatio * audio.duration;
    setProgress(clickRatio * 100);
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-3 px-5 py-3 rounded-lg bg-orange-100 text-red-700 font-bold shadow hover:bg-orange-200 transition w-full justify-center"
        aria-expanded={isOpen}
        aria-controls="comets-hymne-panel"
      >
        <span className="text-2xl">🎶</span>
        {isOpen ? "Fermer l’hymne des Comets" : "Écouter l’hymne des Comets de Honfleur"}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            id="comets-hymne-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: 0.4, ease: "easeInOut" } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.25 } }}
            className="overflow-hidden bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 rounded-xl text-white text-center shadow-lg mt-4"
          >
            {/* Bloc SEO/description visible uniquement ouvert, bien lisible */}
            <div
              className="text-center text-base font-medium text-gray-800 mb-6 px-3 py-3 bg-white/85 rounded-xl max-w-lg mx-auto mt-4 shadow"
              aria-label="hymne équipe baseball Honfleur description"
              style={{ lineHeight: 1.5 }}
            >
              <strong>Hymne de l’équipe de baseball Les Comets d’Honfleur</strong> : <br />
              Découvrez la musique du club – l’ambiance baseball à Honfleur, Normandie ! <br />
              Symbole de notre passion pour le baseball de la ville d’Honfleur.
            </div>
            <div className="px-6 py-8">
              <h2 className="text-3xl font-extrabold mb-4">
                Hymne des Comets d’Honfleur – musique
              </h2>
              <audio ref={audioRef} src="/sounds/hymne-comets.mp3" preload="auto" />
              <button
                onClick={togglePlay}
                className="inline-flex items-center gap-3 bg-white text-red-600 font-bold px-6 py-3 rounded-full shadow-md hover:bg-red-100 transition"
                aria-label={isPlaying ? "Pause l'hymne" : "Jouer l'hymne"}
              >
                {isPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
                {isPlaying ? "Pause" : "Jouer"}
              </button>
              <div
                ref={progressBarRef}
                onClick={handleProgressClick}
                className="mt-4 h-2 bg-white bg-opacity-40 rounded-full overflow-hidden cursor-pointer"
                aria-label="Barre de progression"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div
                  className="h-full bg-yellow-300 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {/* Slider volume */}
              <div className="mt-4 flex items-center justify-center gap-2">
                <label htmlFor="volume" className="text-white font-semibold">
                  Volume
                </label>
                <input
                  id="volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full cursor-pointer"
                  aria-label="Contrôle du volume"
                />
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
