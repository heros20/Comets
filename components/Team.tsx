"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Mapping des équipes (abréviation -> nom complet)
const TEAM_MAP: Record<string, string> = {
  HON: "Honfleur",
  ROU: "Rouen",
  LHA: "Le Havre",
  CHE: "Cherbourg",
  CAE: "Caen",
  AND: "Les Andelys",
  WAL: "Wallabies", // Corrigé ici !
  // Ajoute si jamais il y a de nouvelles équipes dans la ligue
};

// --- Types inchangés
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

  // Pagination light
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

  const canShowMorePlayers = players.length > visiblePlayers;
  const allPlayersVisible = players.length > INIT_COUNT && visiblePlayers >= players.length;
  const canShowMoreGames = games.length > visibleGames;
  const allGamesVisible = games.length > INIT_COUNT && visibleGames >= games.length;

  return (
    <div id="equipe" className="max-w-4xl mx-auto py-12 px-2 md:px-6 ">
      {/* Ref pour le scroll */}
      <div ref={tabTopRef}></div>
      {/* Titre */}
      <div className="max-w-2xl mx-auto mb-7 p-5 rounded-2xl bg-white/90 backdrop-blur shadow-lg">
        <h2 className="text-3xl font-bold text-red-700 mb-2 text-center tracking-wide">
          Effectif & Résultats – Comets Baseball Honfleur 2025
        </h2>
        {/* Paragraphe d’intro pour Google/SEO */}
        <p className="text-center text-base text-gray-700">
          Retrouvez ici l’effectif à jour de l’équipe <strong>Les Comets d’Honfleur</strong> (club de baseball à Honfleur, Normandie) : tous les joueurs, les résultats des matchs de la saison 2025, et le lien direct vers chaque fiche FFBS.<br />
          Suivez les performances de l’équipe de baseball d’Honfleur, les victoires et les adversaires !
        </p>
      </div>

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
                <caption className="sr-only">
                  Liste des joueurs Comets Honfleur – effectif baseball 2025, liens fiche FFBS, année, équipe.
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
                <caption className="sr-only">
                  Résultats des matchs de l’équipe Comets Honfleur, saison 2025 – score, adversaire, domicile, lien boxscore.
                </caption>
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
                          <tr key={g.id} className="even:bg-orange-50 hover:bg-orange-200/70 transition">
                            <td className="p-3 border text-center">{g.gameNumber}</td>
                            <td className="p-3 border text-center bg-gray-50 text-gray-800 font-bold">{g.date}</td>
                            <td className="p-3 border text-center">
                              {g.isHome ? (
                                <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 text-sm font-semibold">Oui</span>
                              ) : (
                                <span className="px-2 py-1 rounded-full bg-red-50 text-red-600 text-sm font-semibold">Non</span>
                              )}
                            </td>
                            <td className="p-3 border text-center font-bold text-orange-700">
                              {TEAM_MAP["HON"] || g.team_abbr}
                            </td>
                            <td className="p-3 border text-center font-bold text-red-700 flex items-center justify-center gap-2">
                              {g.opponentLogo && (
                                <img
                                  src={g.opponentLogo}
                                  alt={`Logo de l'équipe de baseball ${TEAM_MAP[g.opponent] || g.opponent}`}
                                  className="inline-block w-6 h-6 mr-2"
                                />
                              )}
                              {TEAM_MAP[g.opponent] || g.opponent}
                            </td>
                            <td className="p-3 border text-center">
                              <span className="bg-orange-100 rounded px-2 py-1 font-mono">
                                {g.teamScore} - {g.opponentScore}
                              </span>
                            </td>
                            <td className="p-3 border text-center">
                              {g.result === "W" ? (
                                <span className="font-bold text-green-700 bg-green-50 rounded-full px-2 py-1">Victoire</span>
                              ) : g.result === "L" ? (
                                <span className="font-bold text-red-600 bg-red-50 rounded-full px-2 py-1">Défaite</span>
                              ) : (
                                <span className="font-bold text-orange-700 bg-orange-50 rounded-full px-2 py-1">Nul</span>
                              )}
                            </td>
                            <td className="p-3 border text-center">
                              {g.boxscore ? (
                                <a
                                  href={g.boxscore}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`Boxscore du match Comets Honfleur vs ${TEAM_MAP[g.opponent] || g.opponent} – baseball Honfleur`}
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
                              <td className="p-3 border text-center bg-gray-50 text-gray-800 font-bold">{g.date}</td>
                              <td className="p-3 border text-center">
                                {g.isHome ? (
                                  <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 text-sm font-semibold">Oui</span>
                                ) : (
                                  <span className="px-2 py-1 rounded-full bg-red-50 text-red-600 text-sm font-semibold">Non</span>
                                )}
                              </td>
                              <td className="p-3 border text-center font-bold text-orange-700">
                                {TEAM_MAP["HON"] || g.team_abbr}
                              </td>
                              <td className="p-3 border text-center font-bold text-red-700 flex items-center justify-center gap-2">
                                {g.opponentLogo && (
                                  <img
                                    src={g.opponentLogo}
                                    alt={`Logo de l'équipe de baseball ${TEAM_MAP[g.opponent] || g.opponent}`}
                                    className="inline-block w-6 h-6 mr-2"
                                  />
                                )}
                                {TEAM_MAP[g.opponent] || g.opponent}
                              </td>
                              <td className="p-3 border text-center">
                                <span className="bg-orange-100 rounded px-2 py-1 font-mono">
                                  {g.teamScore} - {g.opponentScore}
                                </span>
                              </td>
                              <td className="p-3 border text-center">
                                {g.result === "W" ? (
                                  <span className="font-bold text-green-700 bg-green-50 rounded-full px-2 py-1">Victoire</span>
                                ) : g.result === "L" ? (
                                  <span className="font-bold text-red-600 bg-red-50 rounded-full px-2 py-1">Défaite</span>
                                ) : (
                                  <span className="font-bold text-orange-700 bg-orange-50 rounded-full px-2 py-1">Nul</span>
                                )}
                              </td>
                              <td className="p-3 border text-center">
                                {g.boxscore ? (
                                  <a
                                    href={g.boxscore}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Boxscore du match Comets Honfleur vs ${TEAM_MAP[g.opponent] || g.opponent} – baseball Honfleur`}
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
        <div className="text-center text-black mt-4 text-sm">
        Données issues de la FFBS, fédération française de baseball.
      </div>
      </div>
      
    </div>
  );
}
