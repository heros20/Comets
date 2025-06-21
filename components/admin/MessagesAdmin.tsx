"use client";
import { useRef, useEffect } from "react";
import useSWR from "swr";
import { logAdminAction } from "@/utils/adminLog";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function MessagesAdmin() {
  const { data: messages, isLoading, mutate } = useSWR("/api/messages", fetcher, {
    refreshInterval: 2000,
  });

  const lastCount = useRef(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Notif visuelle & sonore si un nouveau message arrive
  useEffect(() => {
    if (!messages) return;
    if (lastCount.current === 0) {
      lastCount.current = messages.length;
      return;
    }
    if (messages.length > lastCount.current) {
      // VISUEL
      const notif = document.createElement("div");
      notif.innerText = "📣 Nouveau message reçu !";
      notif.className =
        "fixed top-4 right-4 z-[9999] bg-red-600 text-white px-6 py-3 rounded-full shadow-lg text-lg font-bold animate-bounce";
      document.body.appendChild(notif);
      setTimeout(() => notif.remove(), 4000);
      // SONORE
      audioRef.current?.play();
    }
    lastCount.current = messages.length;
  }, [messages]);

  // La bonne fonction handleDelete, AVEC le log !
  function handleDelete(idx: number) {
    fetch("/api/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index: idx }),
    }).then(() => {
      logAdminAction("Supprimé un message du formulaire de contact");
      mutate();
    });
  }

  if (isLoading || !messages) return <div>Chargement...</div>;

  return (
    <div>
      <audio
        ref={audioRef}
        src="/sounds/notify.mp3"
        preload="auto"
      />
      <h2 className="text-2xl font-bold text-red-700 mb-4">Messages reçus</h2>
      {messages.length === 0 && (
        <div className="text-gray-500 text-center py-8">Aucun message pour l’instant…</div>
      )}
      <div className="space-y-4">
        {messages.map((msg: any, i: number) => (
          <div key={i} className="bg-orange-50 border border-orange-200 rounded-lg shadow p-4 relative">
            <button
              onClick={() => handleDelete(i)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-800 text-white px-2 py-1 rounded-full text-xs shadow-lg transition"
              title="Supprimer ce message"
            >
              ✕
            </button>
            <div className="text-sm text-gray-500 mb-2">{msg.date}</div>
            <div className="flex flex-wrap gap-4 mb-2">
              <span className="font-bold text-red-700">{msg.name}</span>
              <span className="text-orange-700">{msg.email}</span>
              {msg.phone && <span className="text-orange-700">{msg.phone}</span>}
            </div>
            <div className="text-gray-800 mb-2 whitespace-pre-line">{msg.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
