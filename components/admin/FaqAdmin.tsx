"use client";
import { useEffect, useState } from "react";

type Faq = {
  id: number;
  q: string;
  a: string;
  created_at: string;
};

export default function FaqAdmin() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editQ, setEditQ] = useState("");
  const [editA, setEditA] = useState("");
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  async function fetchFaqs() {
    setLoading(true);
    setErreur(null);
    try {
      const res = await fetch("/api/faq");
      const data = await res.json();
      setFaqs(data);
    } catch (e: any) {
      setErreur("Erreur de chargement !");
    } finally {
      setLoading(false);
    }
  }

  async function ajouter() {
    if (!newQ.trim() || !newA.trim()) return;
    setLoading(true);
    setErreur(null);
    try {
      const res = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: newQ, a: newA }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout !");
      setNewQ("");
      setNewA("");
      await fetchFaqs();
    } catch (e: any) {
      setErreur(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function supprimer(id: number) {
    if (!window.confirm("Supprimer cette question ?")) return;
    setLoading(true);
    setErreur(null);
    try {
      const res = await fetch("/api/faq", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression !");
      await fetchFaqs();
    } catch (e: any) {
      setErreur(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function modifier(id: number) {
    if (!editQ.trim() || !editA.trim()) return;
    setLoading(true);
    setErreur(null);
    try {
      const res = await fetch("/api/faq", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, q: editQ, a: editA }),
      });
      if (!res.ok) throw new Error("Erreur lors de la modification !");
      setEditId(null);
      setEditQ("");
      setEditA("");
      await fetchFaqs();
    } catch (e: any) {
      setErreur(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-orange-700">FAQ – Questions fréquentes</h2>
      {erreur && (
        <div className="mb-2 text-red-700 font-semibold">{erreur}</div>
      )}

      {/* Ajout */}
      <div className="flex flex-col gap-2 mb-4 md:flex-row">
        <input
          className="border rounded px-2 py-1 flex-1"
          type="text"
          placeholder="Nouvelle question"
          value={newQ}
          onChange={e => setNewQ(e.target.value)}
          disabled={loading}
        />
        <input
          className="border rounded px-2 py-1 flex-1"
          type="text"
          placeholder="Réponse"
          value={newA}
          onChange={e => setNewA(e.target.value)}
          disabled={loading}
          onKeyDown={e => { if (e.key === "Enter") ajouter(); }}
        />
        <button
          className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600 font-bold"
          onClick={ajouter}
          disabled={loading}
        >
          Ajouter
        </button>
      </div>

      {/* Liste */}
      <ul className="space-y-4">
        {faqs.map(f =>
          <li key={f.id} className="flex flex-col gap-1 border-b pb-2">
            {editId === f.id ? (
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <input
                  className="border rounded px-2 py-1 flex-1"
                  type="text"
                  value={editQ}
                  onChange={e => setEditQ(e.target.value)}
                  placeholder="Question"
                  disabled={loading}
                />
                <input
                  className="border rounded px-2 py-1 flex-1"
                  type="text"
                  value={editA}
                  onChange={e => setEditA(e.target.value)}
                  placeholder="Réponse"
                  disabled={loading}
                  onKeyDown={e => { if (e.key === "Enter") modifier(f.id); }}
                />
                <button
                  className="text-green-600 font-bold"
                  onClick={() => modifier(f.id)}
                  disabled={loading}
                >
                  Valider
                </button>
                <button
                  className="text-gray-400 font-bold"
                  onClick={() => setEditId(null)}
                  disabled={loading}
                >
                  Annuler
                </button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <span className="font-semibold text-red-700">{f.q}</span>
                <span className="text-gray-700 flex-1">{f.a}</span>
                <button
                  className="text-blue-600 font-bold"
                  onClick={() => { setEditId(f.id); setEditQ(f.q); setEditA(f.a); }}
                  disabled={loading}
                  title="Modifier"
                >
                  ✎
                </button>
                <button
                  className="text-red-500 font-bold"
                  onClick={() => supprimer(f.id)}
                  disabled={loading}
                  title="Supprimer"
                >
                  🗑
                </button>
              </div>
            )}
          </li>
        )}
      </ul>
      {loading && <div className="mt-4 text-orange-700 font-bold">Chargement…</div>}
    </div>
  );
}
