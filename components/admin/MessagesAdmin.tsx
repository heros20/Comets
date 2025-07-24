"use client";
import { useState, useEffect, useRef } from "react";
import { logAdminAction } from "@/utils/adminLog";
import { supabase } from "@/lib/supabaseClient";

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "Date inconnue";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Date invalide";
  return date.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
}

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const lastCount = useRef(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 1. Récupère les messages au mount
  useEffect(() => {
    fetch("/api/messages")
      .then(r => r.json())
      .then(data => {
        setMessages(data || []);
        lastCount.current = (data || []).length;
        setLoading(false);
      });
  }, []);

  // 2. Ecoute les nouveaux messages en live (Supabase realtime)
  useEffect(() => {
    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => [payload.new, ...prev]);
          // Notif visuelle + sonore
          const notif = document.createElement("div");
          notif.innerText = "📣 Nouveau message reçu !";
          notif.className =
            "fixed top-4 right-4 z-[9999] bg-red-600 text-white px-6 py-3 rounded-full shadow-lg text-lg font-bold animate-bounce";
          document.body.appendChild(notif);
          setTimeout(() => notif.remove(), 4000);
          audioRef.current?.play();
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => prev.filter((msg) => msg.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 3. Suppression
  async function handleDelete(id: string) {
    setDeletingId(id);
    await fetch("/api/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    // Journalise la suppression d'un message avant de reset l'état. On log via l'ID pour identifier l'action.
    try {
      await logAdminAction(`Suppression message id ${id}`);
    } catch (e) {
      console.error(e);
    }
    setDeletingId(null);
    // L'événement DELETE supprime direct côté live, pas besoin de refetch !
  }

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      <audio ref={audioRef} src="/sounds/notify.mp3" preload="auto" />
      <h2 className="text-2xl font-bold text-red-700 mb-4">Messages reçus</h2>
      {messages.length === 0 && (
        <div className="text-gray-500 text-center py-8">Aucun message pour l’instant…</div>
      )}
      <div className="space-y-4">
        {messages.map((msg) => (
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
