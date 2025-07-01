"use client";

import { useState, useEffect } from "react";
import StatsAdmin from "@/components/admin/StatsAdmin";
import TeamAdmin from "@/components/admin/TeamAdmin";
import GalleryAdmin from "@/components/admin/GalleryAdmin";
import MessagesAdmin from "@/components/admin/MessagesAdmin";
import LogsAdmin from "@/components/admin/LogsAdmin";
import { useRouter } from "next/navigation";

const TAB_KEY = "admin_tab_comets";

export default function Admin() {
  const [tab, setTab] = useState<string | null>(null);
  const router = useRouter();

  // ---- ETATS SCRAPE ----
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [scrapeResult, setScrapeResult] = useState<{team?: any, classement?: any} | null>(null);

  const handleScrape = async () => {
    setScrapeLoading(true);
    setScrapeResult(null);
    try {
      const res = await fetch("/api/admin/scrape", { method: "POST" });
      const data = await res.json();
      setScrapeResult(data);
    } catch (e: any) {
      setScrapeResult({
        team: { ok: false, error: e.message },
        classement: { ok: false, error: e.message }
      });
    } finally {
      setScrapeLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem(TAB_KEY);
    if (
      stored &&
      ["stats", "team", "gallery", "messages", "logs"].includes(stored)
    ) {
      setTab(stored);
    } else {
      setTab("stats");
    }
  }, []);

  useEffect(() => {
    if (tab) localStorage.setItem(TAB_KEY, tab);
  }, [tab]);

  // La déconnexion effacera le cookie à l’étape 3
  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/");
  };

  if (!tab) {
    return null; // ou loader si tu veux
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 px-4 py-8">
      
      <div className="flex justify-end mb-2">
        <button
          onClick={handleLogout}
          className="bg-orange-200 text-red-700 px-3 py-1 rounded shadow font-semibold hover:bg-orange-300 transition mr-2"
        >
          Déconnexion
        </button>
        <a
          href="/"
          className="bg-orange-100 text-orange-700 px-3 py-1 rounded shadow font-semibold hover:bg-orange-200 transition"
        >
          Retour au site
        </a>
      </div>

      <h1 className="text-4xl font-extrabold text-red-700 mb-8 text-center drop-shadow-sm">
        Tableau de bord - Administration
      </h1>

      {/* --- Bouton de mise à jour --- */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleScrape}
          disabled={scrapeLoading}
          className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold shadow transition
            ${
              scrapeLoading
                ? "bg-orange-200 text-orange-700 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
            }
          `}
        >
          <svg className={`w-5 h-5 ${scrapeLoading ? "animate-spin" : ""}`} viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2v2a8 8 0 1 1-8 8H2A10 10 0 1 0 12 2z"/>
          </svg>
          {scrapeLoading ? "Mise à jour en cours..." : "Mettre à jour les données"}
        </button>
      </div>
        {scrapeResult && (
  <div className="text-center mb-4 space-y-1">
    {scrapeResult.error ? (
      <div className="text-red-700 font-bold">
        Erreur ❌ : {scrapeResult.error}
      </div>
    ) : (
      <>
        <div className="text-green-700 font-bold">
          {scrapeResult.message || "Mise à jour réussie !"}
        </div>
        {scrapeResult.details && (
          <div className="text-gray-700 text-sm mt-2">
            Joueurs mis à jour : {scrapeResult.details.teamsUpdated}<br />
            Matchs mis à jour : {scrapeResult.details.gamesUpdated}
          </div>
        )}
      </>
    )}
  </div>
)}



      <div className="flex justify-center mb-6 gap-3 flex-wrap">
        {/* "stats", "team", "gallery", "messages", "logs"*/}
        {["gallery", "messages", "logs"].map((section) => (
          <button
            key={section}
            onClick={() => setTab(section)}
            className={`px-6 py-2 rounded-full font-bold shadow transition-colors duration-150 ${
              tab === section
                ? "bg-red-600 text-white"
                : "bg-white text-red-600 border border-red-600 hover:bg-red-50"
            }`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </div>

    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-3xl mx-auto">
  {/* {tab === "stats" && <StatsAdmin />} */}
  {/* {tab === "team" && <TeamAdmin />} */}
  {tab === "gallery" && <GalleryAdmin />}
  {tab === "messages" && <MessagesAdmin />}
  {tab === "logs" && <LogsAdmin />}
</div>

    </div>
  );
}
