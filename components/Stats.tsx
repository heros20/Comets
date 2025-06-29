"use client";
import useSWR from "swr";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --------- Animation ---------
const tabAnim = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: 20, scale: 0.98, transition: { duration: 0.25 } },
};

const fetcher = (url) => fetch(url).then(res => res.json());

export default function Stats() {
  const { data, isLoading, error } = useSWR("/api/classement-normandie", fetcher, {
    // refreshInterval: 60000, // Désactivé car on stocke désormais en BDD
  });
  const [tabIdx, setTabIdx] = useState(0);

  if (isLoading)
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">Chargement du classement…</div>
      </section>
    );

  if (error || !data || !data.tabs)
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center text-red-600">
          Erreur de chargement du classement. (FFBS en maintenance ?)
        </div>
      </section>
    );

  const { tabs, standings, year } = data;

  // Ligne d'entête avec colonne vide juste après le #
  const staticColumns = [
    "#", "Logo", "Abbr", "Equipe", "V", "D", "T", "PCT", "GB"
  ];

  return (
    <section className="py-16 bg-white" id="classement">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-red-700 mb-8 text-center tracking-wider">
          Championnat R1 Normandie <span className="text-orange-500">{year}</span>
        </h2>
        {/* Onglets */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setTabIdx(idx)}
              className={`px-6 py-2 rounded-t-lg font-semibold transition-all duration-200
                ${
                  tabIdx === idx
                    ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md scale-105"
                    : "bg-orange-100 text-red-600 hover:bg-orange-200"
                }
              `}
              aria-selected={tabIdx === idx}
              aria-controls={`tab-panel-${idx}`}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Table animée */}
        <div className="overflow-x-auto rounded-lg shadow bg-white p-1 min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={tabIdx}
              {...tabAnim}
              className="w-full"
              id={`tab-panel-${tabIdx}`}
              role="tabpanel"
              aria-labelledby={tabs[tabIdx]}
            >
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-orange-100">
                    {staticColumns.map((col, i) => (
                      <th key={i} className="px-2 py-2 text-center font-semibold">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {standings[tabIdx]?.length > 0 ? (
                    standings[tabIdx].map((row, i) => (
                      <tr
                        key={i}
                        className={`${
                          i % 2 === 0 ? "bg-orange-50" : "bg-white"
                        } hover:bg-orange-200/60 transition`}
                      >
                        {/* Rang */}
                        <td className="px-2 py-2 text-center font-bold">{row.rank}</td>
                        {/* Logo équipe */}
                        <td className="px-2 py-2 text-center">
                          {row.logo ? (
                            <img
                              src={row.logo}
                              alt={row.abbreviation}
                              className="h-8 mx-auto rounded shadow"
                              loading="lazy"
                            />
                          ) : null}
                        </td>
                        {/* Abréviation */}
                        <td className="px-2 py-2 text-center">{row.abbreviation}</td>
                        {/* Nom équipe (cliquable) */}
                        <td className="px-2 py-2">
                          {row.team_url ? (
                            <a
                              href={row.team_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline hover:text-orange-500 font-semibold"
                            >
                              {row.name}
                            </a>
                          ) : (
                            row.name
                          )}
                        </td>
                        {/* V, D, T, PCT, GB */}
                        <td className="px-2 py-2 text-center">{row.W}</td>
                        <td className="px-2 py-2 text-center">{row.L}</td>
                        <td className="px-2 py-2 text-center">{row.T}</td>
                        <td className="px-2 py-2 text-center">{row.PCT}</td>
                        <td className="px-2 py-2 text-center">{row.GB}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={staticColumns.length} className="text-center py-8 text-orange-600">
                        Aucune donnée pour cet onglet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="text-center text-gray-400 mt-2 text-sm">
          Source :{" "}
          <a
            className="underline hover:text-red-600"
            href={`https://ffbs.wbsc.org/fr/events/${year}-championnat-r1-baseball-ligue-normandie/standings`}
            target="_blank"
            rel="noopener noreferrer"
          >
            FFBS officielle
          </a>
        </div>
      </div>
    </section>
  );
}
