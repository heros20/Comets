"use client";

import { useEffect, useState } from "react";

type Modalite = {
  id: number;
  texte: string;
  created_at: string;
};

export default function ModalitesAdmin() {
  const [modalites, setModalites] = useState<Modalite[]>([]);
  const [nouveauTexte, setNouveauTexte] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editTexte, setEditTexte] = useState("");
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  // Récupère la liste au chargement
  useEffect(() => {
    fetchModalites();
  }, []);

  async function fetchModalites() {
    setLoading(true);
    setErreur(null);
    try {
      const res = await fetch("/api/modalites");
      const data = await res.json();
      setModalites(data);
    } catch (e: any) {
      setErreur("Erreur de chargement !");
    } finally {
      setLoading(false);
    }
  }

  // Ajout
  async function ajouter() {
    if (!nouveauTexte.trim()) return;
    setLoading(true);
    setErreur(null);
    try {
      const res = await fetch("/api/modalites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texte: nouveauTexte }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout !");
      setNouveauTexte("");
      await fetchModalites();
    } catch (e: any) {
      setErreur(e.message);
    } finally {
      setLoading(false);
    }
  }

  // Suppression
  async function supprimer(id: number) {
    if (!window.confirm("Supprimer cette modalité ?")) return;
    setLoading(true);
    setErreur(null);
    try {
      const res = await fetch("/api/modalites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression !");
      await fetchModalites();
    } catch (e: any) {
      setErreur(e.message);
    } finally {
      setLoading(false);
    }
  }

  // Modification
  async function modifier(id: number) {
    if (!editTexte.trim()) return;
    setLoading(true);
    setErreur(null);
    try {
      const res = await fetch("/api/modalites", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, texte: editTexte }),
      });
      if (!res.ok) throw new Error("Erreur lors de la modification !");
      setEditId(null);
      setEditTexte("");
      await fetchModalites();
    } catch (e: any) {
      setErreur(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-red-700">Modalités d’inscription</h2>

      {erreur && (
        <div className="mb-2 text-red-700 font-semibold">{erreur}</div>
      )}

      {/* Ajout */}
      <div className="flex gap-2 mb-4">
        <input
          className="border rounded px-2 py-1 flex-1"
          type="text"
          placeholder="Nouvelle modalité"
          value={nouveauTexte}
          onChange={e => setNouveauTexte(e.target.value)}
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
      <ul className="space-y-2">
        {modalites.map(m =>
          <li key={m.id} className="flex items-center gap-3">
            {editId === m.id ? (
              <>
                <input
                  className="border rounded px-2 py-1 flex-1"
                  type="text"
                  value={editTexte}
                  onChange={e => setEditTexte(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") modifier(m.id); }}
                  disabled={loading}
                  autoFocus
                />
                <button
                  className="text-green-600 font-bold"
                  onClick={() => modifier(m.id)}
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
              </>
            ) : (
              <>
                <span>{m.texte}</span>
                <button
                  className="text-blue-600 font-bold"
                  onClick={() => { setEditId(m.id); setEditTexte(m.texte); }}
                  disabled={loading}
                  title="Modifier"
                >
                  ✎
                </button>
                <button
                  className="text-red-500 font-bold"
                  onClick={() => supprimer(m.id)}
                  disabled={loading}
                  title="Supprimer"
                >
                  🗑
                </button>
              </>
            )}
          </li>
        )}
      </ul>
      {loading && <div className="mt-4 text-orange-700 font-bold">Chargement…</div>}
    </div>
  );
}
