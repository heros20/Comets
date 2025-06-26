"use client";
import { useState, useEffect } from "react";
import StatsAdmin from "@/components/admin/StatsAdmin";
import TeamAdmin from "@/components/admin/TeamAdmin";
import GalleryAdmin from "@/components/admin/GalleryAdmin";
import MessagesAdmin from "@/components/admin/MessagesAdmin";
import LogsAdmin from "@/components/admin/LogsAdmin";
import { useRouter } from "next/navigation";
import MessageNotifier from "@/components/admin/MessageNotifier";

const TAB_KEY = "admin_tab_comets";

export default function Admin() {
  const [tab, setTab] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  // TOUS les hooks en haut, pas de condition ici !
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAdmin = localStorage.getItem("admin_connected") === "1";
      if (!isAdmin) {
        router.replace("/admin/login");
      } else {
        setIsCheckingAuth(false);
      }
    }
  }, [router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(TAB_KEY);
      if (
        stored &&
        ["stats", "team", "gallery", "messages", "logs"].includes(stored)
      ) {
        setTab(stored);
      } else {
        setTab("stats");
      }
    }
  }, []);

  useEffect(() => {
    if (tab) localStorage.setItem(TAB_KEY, tab);
  }, [tab]);

  // Maintenant, tu peux conditionner le rendu sans casser l’ordre
  if (isCheckingAuth || !tab) {
    return null; // ou loader, ça bloque l'affichage tant qu'on sait pas
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 px-4 py-8">
      <MessageNotifier />
      <div className="flex justify-end mb-2">
        <button
          onClick={() => {
            localStorage.removeItem("admin_connected");
            localStorage.removeItem("admin_user");
            window.location.href = "/";
          }}
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

      <div className="flex justify-center mb-6 gap-3 flex-wrap">
        {/* Onglets */}
        {["stats", "team", "gallery", "messages", "logs"].map((section) => (
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
        {tab === "stats" && <StatsAdmin />}
        {tab === "team" && <TeamAdmin />}
        {tab === "gallery" && <GalleryAdmin />}
        {tab === "messages" && <MessagesAdmin />}
        {tab === "logs" && <LogsAdmin />}
      </div>
    </div>
  );
}
