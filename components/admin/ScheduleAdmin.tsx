"use client";

import { useState, useEffect } from "react";
import { logAdminAction } from "@/utils/adminLog";

type HoraireItem = {
  id?: number;
  label: string;
  min_age: number;
  max_age?: number;
  horaires: string[];  // tableau de strings horaires
  jours: string[];     // tableau de strings jours
};

const EMPTY_HORAIRE: HoraireItem = {
  label: "",
  min_age: 0,
  max_age: undefined,
  horaires: [""],
  jours: [""],
};

export default function ScheduleAdmin() {
  const [items, setItems] = useState<HoraireItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupère les horaires à l'affichage
  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch("/api/admin/horaires");
        if (!res.ok) throw new Error("Erreur chargement horaires");
        const data = await res.json();
        setItems(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  // Modifier champ simple
  function handleChange(index: number, field: keyof HoraireItem, value: any) {
    setItems((old) => {
      const copy = [...old];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    setError(null);
  }

  // Modifier horaires / jours (tableau)
  function handleArrayChange(
    index: number,
    field: "horaires" | "jours",
    subIndex: number,
    value: string
  ) {
    setItems((old) => {
      const copy = [...old];
      const arr = [...(copy[index][field] || [""])];
      arr[subIndex] = value;
      copy[index] = { ...copy[index], [field]: arr };
      return copy;
    });
    setError(null);
  }

  // Ajouter un item complet et journaliser l'action
  async function handleAddItem() {
    setItems((old) => [...old, { ...EMPTY_HORAIRE }]);
    try {
      await logAdminAction("Ajout d'une catégorie d'horaires");
    } catch (e) {
      console.error(e);
    }
  }

  // Ajouter horaire ou jour dans un item
  function handleAddSubItem(index: number, field: "horaires" | "jours") {
    setItems((old) => {
      const copy = [...old];
      const arr = [...(copy[index][field] || [""])];
      arr.push("");
      copy[index] = { ...copy[index], [field]: arr };
      return copy;
    });
  }

  // Supprimer horaire ou jour dans un item
  function handleRemoveSubItem(index: number, field: "horaires" | "jours", subIndex: number) {
    setItems((old) => {
      const copy = [...old];
      const arr = [...(copy[index][field] || [])];
      arr.splice(subIndex, 1);
      copy[index] = { ...copy[index], [field]: arr.length ? arr : [""] };
      return copy;
    });
  }

  // Supprimer un item entier et journaliser l'action
  async function handleRemoveItem(index: number) {
    if (!confirm("Confirmer la suppression de cette catégorie ?")) return;
    setItems((old) => old.filter((_, i) => i !== index));
    try {
      await logAdminAction("Suppression d'une catégorie d'horaires");
    } catch (e) {
      console.error(e);
    }
  }

  // Enregistrement complet
  async function handleSave() {
    setSaving(true);
    setError(null);

    // Validation simple : label non vide, min_age number, horaires/jours non vides
    for (const item of items) {
      if (!item.label.trim()) {
        setError("Chaque élément doit avoir une catégorie (label).");
        setSaving(false);
        return;
      }
      if (typeof item.min_age !== "number" || isNaN(item.min_age)) {
        setError("Chaque élément doit avoir un âge minimum valide.");
        setSaving(false);
        return;
      }
      if (!item.horaires.length || item.horaires.some(h => !h.trim())) {
        setError("Chaque élément doit avoir au moins un horaire valide.");
        setSaving(false);
        return;
      }
      if (!item.jours.length || item.jours.some(j => !j.trim())) {
        setError("Chaque élément doit avoir au moins un jour valide.");
        setSaving(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/admin/horaires", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur sauvegarde");
      }
      alert("Horaires sauvegardés avec succès !");
      // Journalise la modification des horaires
      await logAdminAction("Modification des horaires et jours d'entraînement");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Chargement des horaires…</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-700 mb-4">Gestion des horaires & jours</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <button
        onClick={handleAddItem}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition font-bold"
      >
        + Ajouter une catégorie
      </button>

      {items.map((item, idx) => (
        <div
          key={item.id ?? idx}
          className="mb-8 p-4 border border-orange-300 rounded-lg bg-orange-50 shadow"
        >
          <div className="flex flex-wrap gap-4 mb-3">
            <input
              type="text"
              placeholder="Catégorie"
              value={item.label}
              onChange={(e) => handleChange(idx, "label", e.target.value)}
              className="flex-1 border border-gray-400 rounded px-3 py-1"
            />
            <input
              type="number"
              min={0}
              placeholder="Âge minimum"
              value={item.min_age}
              onChange={(e) => handleChange(idx, "min_age", Number(e.target.value))}
              className="w-32 border border-gray-400 rounded px-3 py-1"
            />
            <input
              type="number"
              min={0}
              placeholder="Âge maximum (optionnel)"
              value={item.max_age ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                handleChange(idx, "max_age", val === "" ? undefined : Number(val));
              }}
              className="w-32 border border-gray-400 rounded px-3 py-1"
            />
          </div>

          <div className="mb-3">
            <strong>Horaires</strong>
            {item.horaires.map((h, i) => (
              <div key={i} className="flex gap-2 items-center mb-1">
                <input
                  type="text"
                  placeholder="Ex : 14h-15h30"
                  value={h}
                  onChange={(e) => handleArrayChange(idx, "horaires", i, e.target.value)}
                  className="flex-1 border border-gray-400 rounded px-3 py-1"
                />
                {item.horaires.length > 1 && (
                  <button
                    onClick={() => handleRemoveSubItem(idx, "horaires", i)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    type="button"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => handleAddSubItem(idx, "horaires")}
              className="mt-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              type="button"
            >
              + Ajouter un horaire
            </button>
          </div>

          <div className="mb-3">
            <strong>Jours</strong>
            {item.jours.map((j, i) => (
              <div key={i} className="flex gap-2 items-center mb-1">
                <input
                  type="text"
                  placeholder="Ex : Mercredi"
                  value={j}
                  onChange={(e) => handleArrayChange(idx, "jours", i, e.target.value)}
                  className="flex-1 border border-gray-400 rounded px-3 py-1"
                />
                {item.jours.length > 1 && (
                  <button
                    onClick={() => handleRemoveSubItem(idx, "jours", i)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    type="button"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => handleAddSubItem(idx, "jours")}
              className="mt-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              type="button"
            >
              + Ajouter un jour
            </button>
          </div>

          <button
            onClick={() => handleRemoveItem(idx)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition font-bold"
            type="button"
          >
            Supprimer cette catégorie
          </button>
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-red-700 text-white px-8 py-3 rounded font-bold hover:bg-red-800 transition"
      >
        {saving ? "Sauvegarde en cours…" : "Sauvegarder tout"}
      </button>
    </div>
  );
}
