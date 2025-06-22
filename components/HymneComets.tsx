"use client";
import { useState, useRef, useEffect } from "react";

export default function HymneComets() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
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
    <section className="w-full py-12 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 rounded-xl text-white text-center shadow-lg">
      <div className="max-w-xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold mb-4">Hymne des Comets</h2>
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
    </section>
  );
}
