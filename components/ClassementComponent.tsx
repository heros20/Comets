"use client";
import useSWR from "swr";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// --------- Animation ---------
const tabAnim = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: 20, scale: 0.98, transition: { duration: 0.25 } },
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Icônes de flèche (verte et rouge)
const UpArrow = () => (
  <svg className="inline-block w-4 h-4 text-green-500 ml-1" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 2l6 8H2l6-8z"/>
  </svg>
);
const DownArrow = () => (
  <svg className="inline-block w-4 h-4 text-red-500 ml-1" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 14l6-8H2l6 8z"/>
  </svg>
);

export function ClassementComponent() {
  const { data, isLoading, error } = useSWR("/api/classement-normandie", fetcher);
  const [tabIdx, setTabIdx] = useState(0);

  // Logo de secours
  const fallbackLogo = "/images/logo-fallback.png";

  if (isLoading)
    return (
      <section id="classement" className="py-12">
        <div className="w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-14 text-center">
          Chargement du classement…
        </div>
      </section>
    );

  if (error || !data || !data.tabs)
    return (
      <section id="classement" className="py-12">
        <div className="w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-14 text-center text-red-600">
          Erreur de chargement du classement. (FFBS en maintenance ?)
        </div>
      </section>
    );

  const { tabs, standings, year } = data;

  const staticColumns = [
    "#", "Logo", "Abbr", "Equipe", "V", "D", "T", "PCT", "GB"
  ];

  return (
    <section id="classement" className="py-12">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-14 transition-all duration-300">
        <h2 className="text-3xl font-bold text-red-700 mb-4 text-center tracking-wider">
          Classement Baseball Honfleur – Championnat R1 Normandie <span className="text-orange-500">{year}</span>
        </h2>
        <p className="text-center text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
          Retrouvez ici le classement à jour du championnat <strong>R1 baseball Normandie</strong> : toutes les équipes engagées, les victoires/défaites, la progression de la saison, et la position des <span className="font-bold text-red-700">Comets d'Honfleur</span> !
        </p>
        {/* Onglets moelleux */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {tabs.map((tab: string, idx: number) => (
            <button
              key={tab}
              onClick={() => setTabIdx(idx)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200
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
        {/* Boîte qui entoure le tableau */}
        <div className="overflow-x-auto min-h-[280px] transition-all duration-200">
          <AnimatePresence mode="wait">
            <motion.div
              key={tabIdx}
              {...tabAnim}
              className="w-full"
              id={`tab-panel-${tabIdx}`}
              role="tabpanel"
              aria-labelledby={tabs[tabIdx]}
            >
              <table className="min-w-full bg-white border rounded-2xl overflow-hidden">
                <caption className="sr-only">
                  Classement du championnat régional de baseball en Normandie – saison {year}
                </caption>
                <thead>
                  <tr className="bg-orange-100">
                    {staticColumns.map((col, i) => (
                      <th key={i} className="px-2 py-2 text-center font-semibold">{col}</th>
                    ))}
                  </tr>
                </thead>
              <tbody>
                {standings[tabIdx]?.length > 0 ? (
                  standings[tabIdx].map((row: any, i: number) => {
                    const isHonfleur = row.name === "Honfleur Comets";
                    const rankDiff =
                      typeof row.previous_rank === "number"
                        ? row.previous_rank - row.rank
                        : 0;

                    return (
                      <tr
                        key={i}
                        className={`
                          group transition
                          ${isHonfleur
                            ? "relative shadow-[0_2px_12px_-4px_rgba(251,146,60,0.18)]"
                            : i % 2 === 0
                              ? "bg-orange-50"
                              : "bg-white"
                          }
                          hover:bg-orange-100/60
                        `}
                      >
                        {/* Barre d'accent à gauche pour Honfleur */}
                        <td
                          className="pl-0 pr-2 py-2 text-center align-middle"
                          style={{
                            position: "relative",
                            width: "8px",
                            minWidth: "8px",
                            paddingLeft: isHonfleur ? 0 : undefined,
                          }}
                        >
                          {isHonfleur && (
                            <span
                              aria-hidden
                              className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-xl bg-gradient-to-b from-orange-500 via-orange-400 to-blue-500 shadow-md"
                              style={{ marginLeft: '-8px', zIndex: 1 }}
                            />
                          )}
                          {row.rank}
                          {rankDiff > 0 && <UpArrow />}
                          {rankDiff < 0 && <DownArrow />}
                        </td>
                        {/* Logo équipe */}
                        <td className="px-2 py-2 text-center">
                          <Image
                            src={
                              typeof row.logo === "string" && row.logo.trim() !== ""
                                ? row.logo
                                : fallbackLogo
                            }
                            alt={`Logo de l'équipe de baseball ${row.name}${isHonfleur ? ' (Honfleur)' : ''}`}
                            width={32}
                            height={32}
                            className="h-8 w-8 mx-auto rounded-full shadow"
                            style={{ objectFit: "cover" }}
                            unoptimized={
                              typeof row.logo === "string" && row.logo.startsWith("data:")
                            }
                            loading="lazy"
                          />
                        </td>
                        <td className="px-2 py-2 text-center">{row.abbreviation}</td>
                        {/* Nom équipe (effet moderne sur Honfleur) */}
                        <td className={`px-2 py-2 whitespace-nowrap ${isHonfleur
                          ? "font-bold text-orange-600 underline underline-offset-4 decoration-2 decoration-blue-400"
                          : ""}`}>
                          {row.team_url ? (
                            <a
                              href={row.team_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={isHonfleur
                                ? "font-bold underline text-orange-600 decoration-blue-400"
                                : "underline hover:text-orange-500 font-semibold"
                              }
                            >
                              {row.name}
                            </a>
                          ) : (
                            row.name
                          )}
                        </td>
                        <td className="px-2 py-2 text-center">{row.W}</td>
                        <td className="px-2 py-2 text-center">{row.L}</td>
                        <td className="px-2 py-2 text-center">{row.T}</td>
                        <td className="px-2 py-2 text-center">{row.PCT}</td>
                        <td className="px-2 py-2 text-center">{row.GB}</td>
                      </tr>
                    );
                  })
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
            FFBS officielle – Championnat baseball Normandie
          </a>
        </div>
      </div>
    </section>
  );
}
