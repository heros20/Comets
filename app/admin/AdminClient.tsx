"use client";

import { useState, useEffect } from "react";
import { logAdminAction } from "@/utils/adminLog";
import { Home, Users, Calendar, FileText, Mail, Image as GalleryIcon, Settings, BookUser, Box, MessageCircle, ListTodo } from "lucide-react";
import NewsAdmin from "@/components/admin/NewsAdmin";
import StatsAdmin from "@/components/admin/StatsAdmin";
import TeamAdmin from "@/components/admin/TeamAdmin";
import GalleryAdmin from "@/components/admin/GalleryAdmin";
import MessagesAdmin from "@/components/admin/MessagesAdmin";
import LogsAdmin from "@/components/admin/LogsAdmin";
import HorairesAdmin from "@/components/admin/ScheduleAdmin";
import ModalitesAdmin from "@/components/admin/ModalitesAdmin";
import EquipementsAdmin from "@/components/admin/EquipementsAdmin";
import FaqAdmin from "@/components/admin/FaqAdmin";
import CotisationsAdmin from "@/components/admin/CotisationsAdmin";
import DashboardAdmin from "@/components/admin/DashboardAdmin";
import { useRouter } from "next/navigation";

const TAB_KEY = "admin_tab_comets";

// Configuration des différentes sections du panneau d'administration.
const SECTION_CONFIG = [
  { key: "dashboard", label: "Tableau de bord", icon: <Home className="w-5 h-5 mr-2" /> },
  { key: "cotisations", label: "Cotisations", icon: <BookUser className="w-5 h-5 mr-2" /> },
  { key: "team", label: "Membre", icon: <Users className="w-5 h-5 mr-2" /> },
  { key: "horaires", label: "Horaires", icon: <Calendar className="w-5 h-5 mr-2" /> },
  { key: "modalites", label: "Modalités", icon: <ListTodo className="w-5 h-5 mr-2" /> },
  { key: "equipements", label: "Équipement", icon: <Box className="w-5 h-5 mr-2" /> },
  { key: "faq", label: "FAQ", icon: <Settings className="w-5 h-5 mr-2" /> },
  { key: "news", label: "Articles", icon: <FileText className="w-5 h-5 mr-2" /> },
  { key: "gallery", label: "Galerie", icon: <GalleryIcon className="w-5 h-5 mr-2" /> },
  { key: "messages", label: "Messages", icon: <MessageCircle className="w-5 h-5 mr-2" /> },
  { key: "logs", label: "Logs", icon: <Mail className="w-5 h-5 mr-2" /> }
];

export default function Admin() {
  const [tab, setTab] = useState<string | null>(null);
  const router = useRouter();

  // ---- ETATS SCRAPE ----
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [scrapeResult, setScrapeResult] = useState<{ team?: any; classement?: any; message?: string; details?: any } | null>(null);

  const handleScrape = async () => {
    setScrapeLoading(true);
    setScrapeResult(null);
    try {
      const res = await fetch("/api/admin/scrape", { method: "POST" });
      const data = await res.json();
      setScrapeResult(data);
      // Journalise la mise à jour seulement si l'appel renvoie ok
      if (res.ok) {
        try {
          await logAdminAction("Mise à jour des données via scraping");
        } catch (e) {
          console.error(e);
        }
      }
    } catch (e: any) {
      setScrapeResult({
        team: { ok: false, error: e.message },
        classement: { ok: false, error: e.message },
      });
    } finally {
      setScrapeLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem(TAB_KEY);
    const allowedTabs = SECTION_CONFIG.map(s => s.key);
    if (stored && allowedTabs.includes(stored)) {
      setTab(stored);
    } else {
      // Démarre désormais sur le tableau de bord par défaut
      setTab("dashboard");
    }
  }, []);

  useEffect(() => {
    if (tab) localStorage.setItem(TAB_KEY, tab);
  }, [tab]);

  const handleLogout = async () => {
    // Journalise la déconnexion avant de supprimer la session
    try {
      await logAdminAction("Déconnexion de l'administrateur");
    } catch (e) {
      console.error(e);
    }
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/");
  };

  if (!tab) {
    return null; // ou loader si tu veux
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex">
      {/* --- SIDEBAR --- */}
      <aside className="w-[240px] bg-white/90 border-r border-orange-200 shadow-lg flex flex-col py-8 px-4 min-h-screen">
        <h2 className="text-xl font-extrabold text-orange-600 mb-6 text-center tracking-widest">Admin Comets</h2>
        <nav className="flex-1 flex flex-col gap-2">
          {SECTION_CONFIG.map(section => (
            <button
              key={section.key}
              onClick={() => setTab(section.key)}
              className={`flex items-center px-4 py-2 rounded-xl font-semibold transition shadow
                ${
                  tab === section.key
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105"
                    : "bg-orange-50 text-orange-700 hover:bg-orange-200"
                }
              `}
              tabIndex={0}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </nav>
        <div className="mt-8 flex flex-col gap-2">
          <button
            onClick={handleLogout}
            className="bg-orange-200 text-red-700 px-3 py-1 rounded shadow font-semibold hover:bg-orange-300 transition"
          >
            Déconnexion
          </button>
          <a
            href="/"
            className="bg-orange-100 text-orange-700 px-3 py-1 rounded shadow font-semibold hover:bg-orange-200 transition text-center"
          >
            Retour au site
          </a>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 px-6 py-10 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-red-700 mb-6 text-center drop-shadow-sm">
          Tableau de bord – Administration
        </h1>

        {/* --- Bouton de mise à jour --- */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleScrape}
            disabled={scrapeLoading}
            className={`flex items together gap-2 px-5 py-2 rounded-full font-bold shadow transition
              ${
                scrapeLoading
                  ? "bg-orange-200 text-orange-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
              }
            `}
          >
            <svg className={`w-5 h-5 ${scrapeLoading ? "animate-spin" : ""}`} viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2v2a8 8 0 1 1-8 8H2A10 10 0 1 0 12 2z" />
            </svg>
            {scrapeLoading ? "Mise à jour en cours..." : "Mettre à jour les données"}
          </button>
        </div>
        {scrapeResult && (
          <div className="text-center mb-4 space-y-1">
            {(scrapeResult.team?.error || scrapeResult.classement?.error) ? (
              <div className="text-red-700 font-bold">
                Erreur ❌ : {scrapeResult.team?.error || scrapeResult.classement?.error}
              </div>
            ) : (
              <>
                <div className="text-green-700 font-bold">
                  {scrapeResult.message || "Mise à jour réussie !"}
                </div>
                {scrapeResult.details && (
                  <div className="text-gray-700 text-sm mt-2">
                    Joueurs mis à jour : {scrapeResult.details.teamsUpdated}
                    <br />
                    Matchs mis à jour : {scrapeResult.details.gamesUpdated}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* --- CONTENU PRINCIPAL --- */}
        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl">
          {tab === "dashboard" && <DashboardAdmin />}
          {tab === "cotisations" && <CotisationsAdmin />}
          {tab === "team" && <TeamAdmin />}
          {tab === "horaires" && <HorairesAdmin />}
          {tab === "modalites" && <ModalitesAdmin />}
          {tab === "equipements" && <EquipementsAdmin />}
          {tab === "faq" && <FaqAdmin />}
          {tab === "news" && <NewsAdmin />}
          {tab === "gallery" && <GalleryAdmin />}
          {tab === "messages" && <MessagesAdmin />}
          {tab === "logs" && <LogsAdmin />}
        </div>
      </main>
    </div>
  );
}
