"use client";
import { useEffect, useState } from "react";

// Typage (adapte si ta BDD change)
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

export default function CotisationsAdmin() {
  const [cotisants, setCotisants] = useState<Cotisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCotisants() {
      try {
        const res = await fetch("/api/admin/cotisations");
        if (!res.ok) throw new Error("Erreur chargement cotisations");
        const data = await res.json();
        setCotisants(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCotisants();
  }, []);

  if (loading) return <div className="text-center py-8 text-orange-700">Chargement…</div>;
  if (error) return <div className="text-center py-8 text-red-700">Erreur : {error}</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-orange-700 mb-4">Cotisations – Paiements reçus</h2>
      {cotisants.length === 0 ? (
        <div className="text-center text-gray-600 py-12">Aucune cotisation enregistrée pour l’instant.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow mb-2">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Date</th>
                <th className="px-4 py-2 border-b">Nom</th>
                <th className="px-4 py-2 border-b">Prénom</th>
                <th className="px-2 py-2 border-b">Âge</th>
                <th className="px-2 py-2 border-b">Email</th>
                <th className="px-2 py-2 border-b">Montant</th>
                <th className="px-2 py-2 border-b">Statut</th>
                <th className="px-2 py-2 border-b">Stripe</th>
              </tr>
            </thead>
            <tbody>
              {cotisants.map((c) => (
                <tr key={c.id} className="text-center hover:bg-orange-50 transition">
                  <td className="px-4 py-2 border-b text-sm">
                    {c.paid_at ? new Date(c.paid_at).toLocaleDateString() : ""}
                  </td>
                  <td className="px-4 py-2 border-b">{c.nom}</td>
                  <td className="px-4 py-2 border-b">{c.prenom}</td>
                  <td className="px-2 py-2 border-b">{c.age}</td>
                  <td className="px-2 py-2 border-b">
                    <a href={`mailto:${c.email}`} className="text-orange-700 hover:underline">{c.email}</a>
                  </td>
                  <td className="px-2 py-2 border-b font-bold">{c.montant_eur} €</td>
                  <td className="px-2 py-2 border-b">{c.statut}</td>
                  <td className="px-2 py-2 border-b">
                    <a
                      href={`https://dashboard.stripe.com/test/payments/${c.stripe_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline"
                    >
                      Voir
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-sm text-gray-500 mb-2">
            Total cotisations : <b>{cotisants.length}</b>
          </div>
        </div>
      )}
    </div>
  );
}
