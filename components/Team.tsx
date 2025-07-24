"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TEAM_MAP: Record<string, string> = {
  HON: "Honfleur",
  ROU: "Rouen",
  LHA: "Le Havre",
  CHE: "Cherbourg",
  CAE: "Caen",
  AND: "Les Andelys",
  WAL: "Wallabies",
  // Ajoute ici si nouvelles équipes
};

type Player = {
  id: number;
  team_abbr: string;
  last_name: string;
  first_name: string;
  yob?: string;
  player_link?: string;
};

const INIT_COUNT = 10;
const ROW_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03 },
  }),
  exit: { opacity: 0, y: -16, transition: { duration: 0.18 } },
};

export default function TeamPage() {
  const seasonYear = new Date().getFullYear();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [visiblePlayers, setVisiblePlayers] = useState(INIT_COUNT);
  const [playersNoAnim, setPlayersNoAnim] = useState(false);

  useEffect(() => {
    fetch("/api/players")
      .then((res) => res.json())
      .then((data) => setPlayers(Array.isArray(data) ? data : []))
      .catch(() => setPlayers([]))
      .finally(() => setLoading(false));
  }, []);

  const canShowMorePlayers = players.length > visiblePlayers;
  const allPlayersVisible = players.length > INIT_COUNT && visiblePlayers >= players.length;

  // SEO JSON-LD structuré (même logique)
  const teamJsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    "name": "Comets de Honfleur",
    "sport": "Baseball",
    "url": "https://les-comets-honfleur.vercel.app/equipe",
    "member": players.map((p) => ({
      "@type": "Person",
      "name": `${p.first_name} ${p.last_name}`,
    })),
    "coach": { "@type": "Person", "name": "Nom du coach" }
  };

  if (loading)
    return (
      <>
        <div className="text-center py-20 text-xl text-orange-700">
          Chargement des joueurs…
        </div>
      </>
    );

  return (
    <>
      {/* SEO – données structurées JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamJsonLd) }}
      />
      <div className="min-h-screen flex flex-col bg-orange-50/40">
        <main className="flex-grow">
          <div id="equipe" className="max-w-4xl mx-auto py-12 px-2 md:px-6 ">
            <div className="max-w-2xl mx-auto mb-7 p-5 rounded-2xl bg-white/90 backdrop-blur shadow-lg">
              <h2 className="text-3xl font-bold text-red-700 mb-2 text-center tracking-wide">
                Effectif – Comets Baseball Honfleur {seasonYear}
              </h2>
              <p className="text-center text-base text-gray-700">
                Découvrez ici l’effectif à jour de l’équipe <strong>Les Comets d’Honfleur</strong> (club de baseball à Honfleur, Normandie) : tous les joueurs, liens fiche FFBS, et l’année.<br />
                La team passion, la team orange !
              </p>
            </div>

            {/* Table animée Joueurs */}
            <div className="overflow-x-auto rounded-lg shadow bg-white p-2 min-h-[320px]">
              <AnimatePresence>
                <motion.div
                  key="joueurs"
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } }}
                  exit={{ opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.25 } }}
                  className="w-full"
                >
                  <table className="min-w-full border rounded-xl bg-white">
                    <caption className="sr-only">
                      Liste des joueurs Comets Honfleur – effectif baseball {seasonYear}, liens fiche FFBS, année, équipe.
                    </caption>
                    <thead>
                      <tr className="bg-orange-100">
                        <th className="p-3 border text-center font-semibold">Équipe</th>
                        <th className="p-3 border text-center font-semibold">Nom</th>
                        <th className="p-3 border text-center font-semibold">Année</th>
                        <th className="p-3 border text-center font-semibold">Fiche FFBS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.length > 0 ? (
                        <>
                          {playersNoAnim ? (
                            players.slice(0, visiblePlayers).map((p) => (
                              <tr
                                key={p.id}
                                className="even:bg-orange-50 hover:bg-orange-200/70 transition"
                              >
                                <td className="p-3 border text-center font-bold text-orange-700">{TEAM_MAP[p.team_abbr] || p.team_abbr}</td>
                                <td className="p-3 border font-semibold text-center">
                                  {p.first_name} {p.last_name}
                                </td>
                                <td className="p-3 border text-center">{p.yob || "-"}</td>
                                <td className="p-3 border text-center">
                                  {p.player_link ? (
                                    <a
                                      href={p.player_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      aria-label={`Fiche FFBS du joueur ${p.first_name} ${p.last_name}, équipe de baseball Comets Honfleur`}
                                      className="text-orange-600 hover:underline font-bold"
                                    >
                                      Voir
                                    </a>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <AnimatePresence initial={false}>
                              {players.slice(0, visiblePlayers).map((p, i) => (
                                <motion.tr
                                  key={p.id}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  variants={ROW_VARIANTS}
                                  custom={i}
                                  layout
                                  className="even:bg-orange-50 hover:bg-orange-200/70 transition"
                                >
                                  <td className="p-3 border text-center font-bold text-orange-700">{TEAM_MAP[p.team_abbr] || p.team_abbr}</td>
                                  <td className="p-3 border font-semibold text-center">
                                    {p.first_name} {p.last_name}
                                  </td>
                                  <td className="p-3 border text-center">{p.yob || "-"}</td>
                                  <td className="p-3 border text-center">
                                    {p.player_link ? (
                                      <a
                                        href={p.player_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Fiche FFBS du joueur ${p.first_name} ${p.last_name}, équipe de baseball Comets Honfleur`}
                                        className="text-orange-600 hover:underline font-bold"
                                      >
                                        Voir
                                      </a>
                                    ) : (
                                      <span className="text-gray-400">-</span>
                                    )}
                                  </td>
                                </motion.tr>
                              ))}
                            </AnimatePresence>
                          )}
                          <tr>
                            <td colSpan={4} className="text-center py-3">
                              {canShowMorePlayers && (
                                <button
                                  onClick={() => setVisiblePlayers(players.length)}
                                  className="px-4 py-2 rounded bg-orange-100 text-red-700 font-semibold hover:bg-orange-200 transition"
                                >
                                  Voir plus
                                </button>
                              )}
                              {allPlayersVisible && (
                                <button
                                  onClick={() => {
                                    setPlayersNoAnim(true);
                                    setTimeout(() => setVisiblePlayers(INIT_COUNT), 10);
                                    setTimeout(() => setPlayersNoAnim(false), 20);
                                  }}
                                  className="px-4 py-2 rounded bg-orange-100 text-red-700 font-semibold hover:bg-orange-200 transition"
                                >
                                  Voir moins
                                </button>
                              )}
                            </td>
                          </tr>
                        </>
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-6 text-orange-600">
                            Aucun joueur à afficher.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-center mt-4">
  <a
    href="https://ffbs.wbsc.org/fr/events/2025-championnat-r1-baseball-ligue-normandie/teams/34745"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center bg-gradient-to-r from-orange-100 via-orange-50 to-orange-100 px-4 py-2 rounded-xl shadow-sm border border-orange-200 text-orange-700 font-semibold text-sm hover:underline hover:bg-orange-200 transition"
  >
    <span className="mr-2 flex items-center">
      <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
      </svg>
    </span>
    <span>
      Données issues de la <span className="font-bold text-orange-900 underline">FFBS</span> – mises à jour en temps réel 
    </span>
  </a>
</div>

            </div>
          </div>
        </main>
      </div>
    </>
  );
}
