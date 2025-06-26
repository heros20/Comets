"use client";
import { useRef, useEffect, useState } from "react";
import useSWR from "swr";
import { logAdminAction } from "@/utils/adminLog";

const fetcher = (url: string) => fetch(url).then(res => res.json());

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "Date inconnue";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Date invalide";
  return date.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
}

export default function MessagesAdmin() {
  const { data: messages, isLoading, mutate } = useSWR("/api/messages", fetcher, {
    refreshInterval: 2000,
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const lastCount = useRef(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!messages || !Array.isArray(messages)) return;
    if (lastCount.current === 0) {
      lastCount.current = messages.length;
      return;
    }
    if (messages.length > lastCount.current) {
      // Notification visuelle
      const notif = document.createElement("div");
      notif.innerText = "📣 Nouveau message reçu !";
      notif.className =
        "fixed top-4 right-4 z-[9999] bg-red-600 text-white px-6 py-3 rounded-full shadow-lg text-lg font-bold animate-bounce";
      document.body.appendChild(notif);
      setTimeout(() => notif.remove(), 4000);
      // Notification sonore
      audioRef.current?.play();
    }
    lastCount.current = messages.length;
  }, [messages]);

  async function handleDelete(id: string) {
    setDeletingId(id);
    await fetch("/api/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await logAdminAction("Supprimé un message du formulaire de contact");
    setDeletingId(null);
    mutate();
  }

  if (isLoading || !messages) return <div>Chargement...</div>;

  if (!Array.isArray(messages)) return <div>Erreur de données reçues</div>;

  return (
    <div>
      <audio ref={audioRef} src="/sounds/notify.mp3" preload="auto" />
      <h2 className="text-2xl font-bold text-red-700 mb-4">Messages reçus</h2>
      {messages.length === 0 && (
        <div className="text-gray-500 text-center py-8">Aucun message pour l’instant…</div>
      )}
      <div className="space-y-4">
        {messages.map((msg: any) => (
          <div
            key={msg.id}
            className="bg-orange-50 border border-orange-200 rounded-lg shadow p-4 relative"
          >
            <button
              onClick={() => handleDelete(msg.id)}
              disabled={deletingId === msg.id}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-800 text-white px-2 py-1 rounded-full text-xs shadow-lg transition disabled:opacity-50"
              title="Supprimer ce message"
            >
              ✕
            </button>
            <div className="text-sm text-gray-500 mb-2">{formatDate(msg.created_at)}</div>
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
