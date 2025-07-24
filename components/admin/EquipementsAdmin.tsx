"use client";
import { useEffect, useState } from "react";

type Equipement = {
  id: number;
  texte: string;
  created_at: string;
};

export default function EquipementsAdmin() {
  const [equipements, setEquipements] = useState<Equipement[]>([]);
  const [nouveauTexte, setNouveauTexte] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editTexte, setEditTexte] = useState("");
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    fetchEquipements();
  }, []);

  async function fetchEquipements() {
    setLoading(true);
    setErreur(null);
    try {
      const res = await fetch("/api/equipements");
      const data = await res.json();
      setEquipements(data);
    } catch (e: any) {
      setErreur("Erreur de chargement !");
    } finally {
      setLoading(false);
    }
  }

  async function ajouter() {
    if (!nouveauTexte.trim()) return;
    setLoading(true);
    setErreur(null);
    try {
      const res = await fetch("/api/equipements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texte: nouveauTexte }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout !");
      setNouveauTexte("");
      await fetchEquipements();
    } catch (e: any) {
      setErreur(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function supprimer(id: number) {
    if (!window.confirm("Supprimer cet équipement ?")) return;
    setLoading(true);
    setErreur(null);
    try {
      const res = await fetch("/api/equipements", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression !");
      await fetchEquipements();
    } catch (e: any) {
      setErreur(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function modifier(id: number) {
    if (!editTexte.trim()) return;
    setLoading(true);
    setErreur(null);
    try {
      const res = await fetch("/api/equipements", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, texte: editTexte }),
      });
      if (!res.ok) throw new Error("Erreur lors de la modification !");
      setEditId(null);
      setEditTexte("");
      await fetchEquipements();
    } catch (e: any) {
      setErreur(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-orange-700">Équipement nécessaire</h2>
      {erreur && (
        <div className="mb-2 text-red-700 font-semibold">{erreur}</div>
      )}

      {/* Ajout */}
      <div className="flex gap-2 mb-4">
        <input
          className="border rounded px-2 py-1 flex-1"
          type="text"
          placeholder="Nouvel équipement"
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
        {equipements.map(e =>
          <li key={e.id} className="flex items-center gap-3">
            {editId === e.id ? (
              <>
                <input
                  className="border rounded px-2 py-1 flex-1"
                  type="text"
                  value={editTexte}
                  onChange={ev => setEditTexte(ev.target.value)}
                  onKeyDown={ev => { if (ev.key === "Enter") modifier(e.id); }}
                  disabled={loading}
                  autoFocus
                />
                <button
                  className="text-green-600 font-bold"
                  onClick={() => modifier(e.id)}
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
                <span>{e.texte}</span>
                <button
                  className="text-blue-600 font-bold"
                  onClick={() => { setEditId(e.id); setEditTexte(e.texte); }}
                  disabled={loading}
                  title="Modifier"
                >
                  ✎
                </button>
                <button
                  className="text-red-500 font-bold"
                  onClick={() => supprimer(e.id)}
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
