"use client";
import { useState, useEffect } from "react";
import { logAdminAction } from "@/utils/adminLog";

export default function StatsAdmin() {
  const [stats, setStats] = useState({ victoires: 0, joueurs: 0, annees: 0, entrainements: 0 });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/stats")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setStats(s => ({ ...s, [name]: Number(value) }));
    setSuccess(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stats),
    }).then(() => {
      logAdminAction("Modification des statistiques");
      setSuccess(true);
      setLoading(false);
    });
  }

  if (loading) return <div>Chargement…</div>;

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 font-semibold text-orange-700">Victoires cette saison</label>
          <input type="number" name="victoires" value={stats.victoires} onChange={handleChange} className="border px-3 py-2 rounded w-full" min={0} />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-orange-700">Joueurs actifs</label>
          <input type="number" name="joueurs" value={stats.joueurs} onChange={handleChange} className="border px-3 py-2 rounded w-full" min={0} />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-orange-700">Années d'existence</label>
          <input type="number" name="annees" value={stats.annees} onChange={handleChange} className="border px-3 py-2 rounded w-full" min={0} />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-orange-700">Entraînements par semaine</label>
          <input type="number" name="entrainements" value={stats.entrainements} onChange={handleChange} className="border px-3 py-2 rounded w-full" min={0} />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white text-lg py-3 rounded-full transition"
        disabled={loading}
      >
        {loading ? "Sauvegarde..." : "Sauvegarder"}
      </button>
      {success && <div className="mt-2 text-green-600 font-semibold">✔️ Statistiques mises à jour !</div>}
    </form>
  );
}
