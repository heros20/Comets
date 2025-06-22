"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Stats() {
  const { data: stats, isLoading } = useSWR(
    "/api/stats",
    fetcher,
    { refreshInterval: 4000 } // ← toutes les 4 secondes, modifie au besoin
  );

  if (isLoading || !stats) return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">Chargement…</div>
    </section>
  );

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-white font-bold">🏆</span>
            </div>
            <h3 className="text-3xl font-bold text-red-600 mb-2">{stats.victoires}</h3>
            <p className="text-gray-600">Victoires cette saison</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-white font-bold">👥</span>
            </div>
            <h3 className="text-3xl font-bold text-orange-600 mb-2">{stats.joueurs}</h3>
            <p className="text-gray-600">Joueurs actifs</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-white font-bold">🎯</span>
            </div>
            <h3 className="text-3xl font-bold text-yellow-600 mb-2">{stats.annees}</h3>
            <p className="text-gray-600">Années d&apos;existence</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-white font-bold">📅</span>
            </div>
            <h3 className="text-3xl font-bold text-red-600 mb-2">{stats.entrainements}</h3>
            <p className="text-gray-600">Entraînements par semaine</p>
          </div>
        </div>
      </div>
    </section>
  );
}
