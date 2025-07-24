"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";

// Typage aligné avec CotisationsAdmin : adapte au besoin si la structure change
type Cotisation = {
  id: number;
  nom: string;
  prenom: string;
  age: number;
  email: string;
  montant_eur: number;
  statut: string;
  paid_at: string | null;
  stripe_id: string;
};

/**
 * Composant de tableau de bord pour l'administration.
 *
 * Affiche un condensé des informations importantes :
 * – nombre total d'inscriptions (cotisations) enregistrées;
 * – nombre d'inscriptions sur les quatre dernières semaines;
 * – nombre de cotisations non payées;
 * – quelques métriques fictives de réseaux sociaux;
 * – le composant Analytics de Vercel pour visualiser le trafic.
 */
export default function DashboardAdmin() {
  const [totalInscrits, setTotalInscrits] = useState<number>(0);
  const [recentInscrits, setRecentInscrits] = useState<number>(0);
  const [nonPayes, setNonPayes] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCotisants() {
      try {
        const res = await fetch("/api/admin/cotisations");
        if (!res.ok) throw new Error("Erreur chargement cotisations");
        const data: Cotisation[] = await res.json();
        const now = new Date();
        const fourWeeksAgo = new Date(now);
        fourWeeksAgo.setDate(now.getDate() - 28);
        const total = data.length;
        const recent = data.filter(c => c.paid_at && new Date(c.paid_at) >= fourWeeksAgo).length;
        const unpaid = data.filter(c => !c.paid_at).length;
        setTotalInscrits(total);
        setRecentInscrits(recent);
        setNonPayes(unpaid);
      } catch (e: any) {
        setError(e.message || String(e));
      } finally {
        setLoading(false);
      }
    }
    fetchCotisants();
  }, []);

  // Followers fictifs (remplacer par des valeurs réelles ou un appel API si disponible)
  const followers = {
    facebook: 0,
    instagram: 0,
    twitter: 0,
  };

  if (loading) return <div className="text-center py-8 text-orange-700">Chargement…</div>;
  if (error) return <div className="text-center py-8 text-red-700">Erreur : {error}</div>;

  return (
    <div className="space-y-6">
      {/* Cartes statistiques des cotisations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-orange-50 rounded-lg shadow">
          <h3 className="font-bold text-orange-700 mb-1">Inscriptions totales</h3>
          <p className="text-3xl font-extrabold text-red-600">{totalInscrits}</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg shadow">
          <h3 className="font-bold text-orange-700 mb-1">Inscriptions récentes (4 semaines)</h3>
          <p className="text-3xl font-extrabold text-red-600">{recentInscrits}</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg shadow">
          <h3 className="font-bold text-orange-700 mb-1">Cotisations en attente</h3>
          <p className="text-3xl font-extrabold text-red-600">{nonPayes}</p>
        </div>
      </div>

      {/* Cartes statistiques réseaux sociaux */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <div className="p-4 bg-orange-50 rounded-lg shadow">
          <h3 className="font-bold text-orange-700 mb-1">Followers Facebook</h3>
          <p className="text-2xl font-extrabold text-red-600">{followers.facebook}</p>
        </div>
      </div>

      {/* Raccourci vers la gestion des cotisations */}
      {nonPayes > 0 && (
        <div className="mt-8">
          <h3 className="font-bold text-orange-700 mb-2">Cotisations à régulariser</h3>
          <p className="mb-2">{nonPayes} membres n'ont pas encore réglé leur cotisation.</p>
          <a
            href="#"
            className="inline-block bg-gradient-to-r from-red-600 to-orange-500 text-white px-5 py-2 rounded-full font-semibold hover:from-red-700 hover:to-orange-600 transition"
          >
            Gérer les cotisations
          </a>
        </div>
      )}
    </div>
  );
}
