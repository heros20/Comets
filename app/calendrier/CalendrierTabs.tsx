"use client";
import { useState } from "react";
import Image from "next/image";

type Game = {
  id: string | number;
  date?: string;
  gameNumber?: string | number;
  opponent: string;
  logo?: string;
  isHome?: boolean;
  teamScore?: number;
  opponentScore?: number;
  result?: "W" | "L" | "N" | null;
  boxscore?: string | null;
};

const TEAM_MAP: Record<string, string> = {
  HON: "Honfleur",
  ROU: "Rouen",
  LHA: "Le Havre",
  CHE: "Cherbourg",
  CAE: "Caen",
  AND: "Les Andelys",
  WAL: "Wallabies",
};

function formatDateFR(dateStr: string | undefined): string {
  if (!dateStr) return "-";
  const [d, m, y] = dateStr.split("/");
  if (!d || !m || !y) return dateStr;
  return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
}

export default function CalendrierTabs({ games }: { games: Game[] }) {
  const [tab, setTab] = useState(0);

  // Trie les matchs du plus récent au plus ancien
  const sortedGames = [...games].sort((a, b) => {
    function parseDate(d?: string | null): number {
      if (!d) return 0;
      const [day, month, year] = d.split("/");
      return new Date(`${year}-${month}-${day}`).getTime();
    }
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    return dateB - dateA;
  });

  // Filtres :
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  function parseDate(d?: string | null): Date | null {
    if (!d) return null;
    const [day, month, year] = d.split("/");
    return new Date(`${year}-${month}-${day}`);
  }
  const upcoming = sortedGames.filter((g) => {
    const date = parseDate(g.date);
    return date !== null && date >= today;
  });
  const past = sortedGames.filter((g) => {
    const date = parseDate(g.date);
    return date === null || date < today;
  });

  const tabs = [
    { label: "Tous", icon: "📅", data: sortedGames },
    { label: "À venir", icon: "⏳", data: upcoming },
    { label: "Joués", icon: "✔️", data: past },
  ];

  return (
    <div>
      {/* Intro SEO & visible */}
      <div className="max-w-3xl mx-auto mb-7 p-5 rounded-xl bg-white/90 backdrop-blur shadow-lg text-center">
        <h1 className="text-3xl font-bold text-orange-700 mb-2">
          Calendrier & Résultats officiels – Comets Honfleur
        </h1>
        <p className="text-base text-gray-700">
          Retrouvez ici <strong>tous les matchs officiels</strong> des{" "}
          <b>Comets Honfleur</b> : scores, adversaires, dates, boxscores, et
          résultats de la saison.
          <br />
          <span className="hidden md:inline">
            Mettez cette page en favori pour ne rien rater du baseball à
            Honfleur !
          </span>
        </p>
      </div>
      {/* Tabs */}
      <div className="flex gap-2 justify-center mb-3">
        {tabs.map((t, idx) => (
          <button
            key={t.label}
            onClick={() => setTab(idx)}
            className={`px-4 py-2 rounded-t-xl font-semibold transition 
              ${
                tab === idx
                  ? "bg-gradient-to-r from-orange-600 to-orange-400 text-white shadow scale-105"
                  : "bg-orange-100 text-orange-700 hover:bg-orange-200"
              }`}
          >
            <span className="text-lg mr-1">{t.icon}</span> {t.label}
          </button>
        ))}
      </div>
      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-base">
          <thead>
            <tr className="bg-orange-100 text-center">
              <th className="p-3 font-bold">Date</th>
              <th className="p-3 font-bold">Numéro</th>
              <th className="p-3 font-bold text-left">Adversaire</th>
              <th className="p-3 font-bold">Lieu</th>
              <th className="p-3 font-bold">Score</th>
              <th className="p-3 font-bold">Résultat</th>
              <th className="p-3 font-bold">Boxscore</th>
            </tr>
          </thead>
          <tbody>
            {tabs[tab].data.length ? (
              tabs[tab].data.map((g) => (
                <tr
                  key={g.id}
                  className="even:bg-orange-50 hover:bg-orange-200/70 transition text-center"
                >
                  <td className="p-2 font-mono font-bold">{formatDateFR(g.date)}</td>
                  <td className="p-2">{g.gameNumber || "-"}</td>
                  <td className="p-2 font-semibold text-left">
                    <div className="flex items-center gap-2">
                      {g.logo && (
                        <Image
                          src={g.logo}
                          alt={TEAM_MAP[g.opponent] || g.opponent}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full border border-orange-200 bg-white object-contain"
                          style={{ minWidth: 32, minHeight: 32 }}
                          unoptimized={
                            typeof g.logo === "string" && g.logo.startsWith("data:")
                          }
                        />
                      )}
                      <span className="pl-1">{TEAM_MAP[g.opponent] || g.opponent}</span>
                    </div>
                  </td>
                  <td className="p-2">
                    {g.isHome ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-bold">
                        Domicile
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded font-bold">
                        Extérieur
                      </span>
                    )}
                  </td>
                  <td className="p-2 font-mono">
                    {typeof g.teamScore === "number" &&
                    typeof g.opponentScore === "number"
                      ? `${g.teamScore} - ${g.opponentScore}`
                      : "-"}
                  </td>
                  <td className="p-2">
                    {g.result === "W" && (
                      <span className="text-green-700 font-bold">Victoire</span>
                    )}
                    {g.result === "L" && (
                      <span className="text-red-600 font-bold">Défaite</span>
                    )}
                    {g.result === "N" && (
                      <span className="text-orange-600 font-bold">Nul</span>
                    )}
                    {!g.result && (
                      <span className="text-gray-400">À venir</span>
                    )}
                  </td>
                  <td className="p-2">
                    {g.boxscore ? (
                      <a
                        href={g.boxscore}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-700 hover:underline font-bold"
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
              <tr>
                <td colSpan={7}>
                  <div className="flex justify-center items-center py-10">
                    <span className="text-orange-600 text-xl font-semibold text-center">
                      Aucun match à afficher
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-6">
        <a
          href="https://ffbs.wbsc.org/fr/calendar"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-gradient-to-r from-orange-100 via-orange-50 to-orange-100 px-4 py-2 rounded-xl shadow-sm border border-orange-200 text-orange-700 font-semibold text-base hover:underline hover:bg-orange-200 transition"
        >
          <svg
            className="w-5 h-5 text-orange-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01"
            />
          </svg>
          Données issues de la{" "}
          <span className="font-bold text-orange-900 underline">FFBS</span> – mises à
          jour en temps réel
        </a>
      </div>
    </div>
  );
}
