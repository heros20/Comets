"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Tes types
type Player = {
  id: number;
  team_abbr: string;
  last_name: string;
  first_name: string;
  yob?: string;
  player_link?: string;
};

type Game = {
  id: number;
  team_abbr: string;
  date: string;
  isHome: boolean;
  opponent: string;
  opponentLogo?: string;
  teamScore: number;
  opponentScore: number;
  result: string;
  boxscore?: string;
  gameNumber?: number;
};

const tabAnim = {
  initial: { opacity: 0, y: 30, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.25 } },
};

const ROW_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03 },
  }),
  exit: { opacity: 0, y: -16, transition: { duration: 0.18 } },
};

const INIT_COUNT = 10;

export default function TeamPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabIdx, setTabIdx] = useState(0);

  // Pour la pagination light
  const [visiblePlayers, setVisiblePlayers] = useState(INIT_COUNT);
  const [visibleGames, setVisibleGames] = useState(INIT_COUNT);

  // Flags pour couper l'animation sur "Voir moins"
  const [playersNoAnim, setPlayersNoAnim] = useState(false);
  const [gamesNoAnim, setGamesNoAnim] = useState(false);

  // Ref pour scroller au niveau du header/onglets
  const tabTopRef = useRef<HTMLDivElement>(null);

  // --- FETCH Joueurs
  useEffect(() => {
    fetch("/api/players")
      .then((res) => res.json())
      .then((data) => setPlayers(Array.isArray(data) ? data : []))
      .catch(() => setPlayers([]));
  }, []);

  // --- FETCH Matchs
  useEffect(() => {
    fetch("/api/games")
      .then((res) => res.json())
      .then((data) => setGames(Array.isArray(data) ? data : []))
      .catch(() => setGames([]))
      .finally(() => setLoading(false));
  }, []);

  // Remet à 10 lignes à chaque changement d’onglet
  useEffect(() => {
    setVisiblePlayers(INIT_COUNT);
    setVisibleGames(INIT_COUNT);
    setPlayersNoAnim(false);
    setGamesNoAnim(false);
  }, [tabIdx]);

  if (loading)
    return (
      <div className="text-center py-20 text-xl text-orange-700">
        Chargement des données…
      </div>
    );

  const tabs = [
    { label: "Joueurs", icon: "👥" },
    { label: "Matchs", icon: "⚾️" },
  ];

  // Helpers pour « Voir plus/moins »
  const canShowMorePlayers = players.length > visiblePlayers;
  const allPlayersVisible = players.length > INIT_COUNT && visiblePlayers >= players.length;
  const canShowMoreGames = games.length > visibleGames;
  const allGamesVisible = games.length > INIT_COUNT && visibleGames >= games.length;

  return (
    
    <div id="equipe" className="max-w-4xl mx-auto py-12 px-2 md:px-6 ">
      {/* Ref pour le scroll */}
      <div ref={tabTopRef}></div>
      {/* Titre */}
      <h2 className="text-3xl font-bold text-red-700 mb-6 text-center tracking-wide">
        Effectif & Résultats 2025
      </h2>
      {/* Onglets */}
      <div className="flex justify-center gap-2 mb-4">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => setTabIdx(idx)}
            className={`
              px-6 py-2 rounded-t-lg font-semibold transition-all duration-200 flex items-center gap-2
              ${
                tabIdx === idx
                  ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow scale-105"
                  : "bg-orange-100 text-red-600 hover:bg-orange-200"
              }
            `}
            aria-selected={tabIdx === idx}
            aria-controls={`tab-panel-${idx}`}
          >
            <span className="text-xl">{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Table animée */}
      <div className="overflow-x-auto rounded-lg shadow bg-white p-2 min-h-[320px]">
        <AnimatePresence mode="wait">
          {tabIdx === 0 && (
            <motion.div
              key="joueurs"
              {...tabAnim}
              className="w-full"
              id="tab-panel-0"
              role="tabpanel"
            >
              <table className="min-w-full border rounded-xl bg-white">
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
                            <td className="p-3 border text-center">{p.team_abbr}</td>
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
                              <td className="p-3 border text-center">{p.team_abbr}</td>
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
                                if (tabTopRef.current) {
                                  tabTopRef.current.scrollIntoView({ behavior: "instant" });
                                }
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
          )}
          {tabIdx === 1 && (
            <motion.div
              key="matchs"
              {...tabAnim}
              className="w-full"
              id="tab-panel-1"
              role="tabpanel"
            >
              <table className="min-w-full border rounded-xl bg-white">
                <thead>
                  <tr className="bg-orange-100">
                    <th className="p-3 border text-center font-semibold">Numéro</th>
                    <th className="p-3 border text-center font-semibold">Date</th>
                    <th className="p-3 border text-center font-semibold">Domicile</th>
                    <th className="p-3 border text-center font-semibold">Équipe</th>
                    <th className="p-3 border text-center font-semibold">Adversaire</th>
                    <th className="p-3 border text-center font-semibold">Score</th>
                    <th className="p-3 border text-center font-semibold">Résultat</th>
                    <th className="p-3 border text-center font-semibold">Boxscore</th>
                  </tr>
                </thead>
                <tbody>
                  {games.length > 0 ? (
                    <>
                      {gamesNoAnim ? (
                        games.slice(0, visibleGames).map((g) => (
                          <tr
                            key={g.id}
                            className="even:bg-orange-50 hover:bg-orange-200/70 transition"
                          >
                            <td className="p-3 border text-center">{g.gameNumber}</td>
                            <td className="p-3 border text-center">{g.date}</td>
                            <td className="p-3 border text-center">{g.isHome ? "Oui" : "Non"}</td>
                            <td className="p-3 border text-center">HON</td>
                            <td className="p-3 border text-center flex items-center gap-2">
                              {g.opponentLogo && (
                                <img
                                  src={g.opponentLogo}
                                  alt={g.opponent}
                                  className="inline-block w-6 h-6 mr-2"
                                />
                              )}
                              {g.opponent}
                            </td>
                            <td className="p-3 border text-center">
                              {g.teamScore} - {g.opponentScore}
                            </td>
                            <td className="p-3 border text-center">
                              {g.result === "W"
                                ? "Victoire"
                                : g.result === "L"
                                ? "Défaite"
                                : "Nul"}
                            </td>
                            <td className="p-3 border text-center">
                              {g.boxscore ? (
                                <a
                                  href={g.boxscore}
                                  target="_blank"
                                  rel="noopener noreferrer"
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
                          {games.slice(0, visibleGames).map((g, i) => (
                            <motion.tr
                              key={g.id}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              variants={ROW_VARIANTS}
                              custom={i}
                              layout
                              className="even:bg-orange-50 hover:bg-orange-200/70 transition"
                            >
                              <td className="p-3 border text-center">{g.gameNumber}</td>
                              <td className="p-3 border text-center">{g.date}</td>
                              <td className="p-3 border text-center">{g.isHome ? "Oui" : "Non"}</td>
                              <td className="p-3 border text-center">HON</td>
                              <td className="p-3 border text-center flex items-center gap-2">
                                {g.opponentLogo && (
                                  <img
                                    src={g.opponentLogo}
                                    alt={g.opponent}
                                    className="inline-block w-6 h-6 mr-2"
                                  />
                                )}
                                {g.opponent}
                              </td>
                              <td className="p-3 border text-center">
                                {g.teamScore} - {g.opponentScore}
                              </td>
                              <td className="p-3 border text-center">
                                {g.result === "W"
                                  ? "Victoire"
                                  : g.result === "L"
                                  ? "Défaite"
                                  : "Nul"}
                              </td>
                              <td className="p-3 border text-center">
                                {g.boxscore ? (
                                  <a
                                    href={g.boxscore}
                                    target="_blank"
                                    rel="noopener noreferrer"
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
                        <td colSpan={8} className="text-center py-3">
                          {canShowMoreGames && (
                            <button
                              onClick={() => setVisibleGames(games.length)}
                              className="px-4 py-2 rounded bg-orange-100 text-red-700 font-semibold hover:bg-orange-200 transition"
                            >
                              Voir plus
                            </button>
                          )}
                          {allGamesVisible && (
                            <button
                              onClick={() => {
                                setGamesNoAnim(true);
                                if (tabTopRef.current) {
                                  tabTopRef.current.scrollIntoView({ behavior: "instant" });
                                }
                                setTimeout(() => setVisibleGames(INIT_COUNT), 10);
                                setTimeout(() => setGamesNoAnim(false), 20);
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
                      <td colSpan={8} className="text-center py-6 text-orange-600">
                        Aucun match à afficher.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="text-center text-orange-400 mt-4 text-sm">
        Données issues de la FFBS.
      </div>
    </div>
  );
}
