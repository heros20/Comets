"use client";
import { useEffect, useRef } from "react";

export default function MessageNotifier() {
  const lastCount = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let polling = true;
    let interval: NodeJS.Timeout;

    async function checkMessages() {
      if (typeof window === "undefined") return;
      try {
        const res = await fetch("/api/messages");
        const data = await res.json();
        if (!Array.isArray(data)) return;
        if (lastCount.current === 0) {
          lastCount.current = data.length;
          return;
        }
        if (data.length > lastCount.current) {
          // Visuel
          const notif = document.createElement("div");
          notif.innerText = "📣 Nouveau message reçu !";
          notif.className =
            "fixed top-4 right-4 z-[9999] bg-red-600 text-white px-6 py-3 rounded-full shadow-lg text-lg font-bold animate-bounce";
          document.body.appendChild(notif);
          setTimeout(() => notif.remove(), 4000);
          // Sonore
          audioRef.current?.play();
        }
        lastCount.current = data.length;
      } catch (err) {
        // Ignore errors pour pas casser le flow
      }
    }

    // Check toutes les 2 secondes
    interval = setInterval(() => {
      if (polling) checkMessages();
    }, 2000);

    return () => {
      polling = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/sounds/notify.mp3"
      preload="auto"
      style={{ display: "none" }}
      tabIndex={-1}
    />
  );
}
