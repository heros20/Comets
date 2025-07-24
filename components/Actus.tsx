"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type Article = {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
};

const TEAM_CATEGORIES = ["12U", "15U", "Seniors"];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function excerpt(text: string, n = 200) {
  return text.length > n ? text.slice(0, n) + "…" : text;
}

function getYear(str: string) {
  return new Date(str).getFullYear();
}

// Catégorie robuste (tolère espace, majuscule, etc)
function getTeamCat(title: string) {
  const norm = title.trim().toUpperCase();
  for (const cat of TEAM_CATEGORIES) {
    if (norm.startsWith(cat.toUpperCase())) return cat;
  }
  return "Autres";
}

export default function Actus() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Saison et catégorie sélectionnées
  const [selectedSeason, setSelectedSeason] = useState<string>("ALL"); // "Toutes les saisons"
  const [selectedCat, setSelectedCat] = useState<string>("ALL");

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  useEffect(() => {
    fetch("/api/news")
      .then(r => r.json())
      .then(data => {
        setArticles(
          Array.isArray(data)
            ? data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            : []
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const allYears = Array.from(new Set(articles.map(a => getYear(a.created_at)))).sort((a, b) => b - a);
  const thisYear = new Date().getFullYear();
  const years = allYears.length ? allYears : [thisYear];
  const seasonTabs = ["ALL", ...years.map(String)]; // tout en string

  useEffect(() => {
    setPage(1);
    setSelectedCat("ALL");
  }, [selectedSeason]);

  const categories = ["ALL", ...TEAM_CATEGORIES];
  const isAllSeasons = selectedSeason === "ALL";
  const catLabel = (cat: string) =>
    cat === "ALL" ? "Toutes les catégories" : cat;

  // Correction : tout compare en string
  const articlesToShow = articles.filter(a => {
    const cat = getTeamCat(a.title);
    const yearStr = String(getYear(a.created_at));
    if (selectedSeason === "ALL") {
      if (selectedCat === "ALL") return true;
      return cat === selectedCat;
    }
    if (selectedCat === "ALL") return yearStr === selectedSeason;
    return yearStr === selectedSeason && cat === selectedCat;
  });

  // SEO JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Actualités - Les Comets de Honfleur",
    "url": "https://les-comets-honfleur.vercel.app/actus",
    "blogPost": articlesToShow.map(a => ({
      "@type": "BlogPosting",
      "headline": a.title,
      "datePublished": a.created_at,
      "image": a.image_url,
      "url": `https://les-comets-honfleur.vercel.app/actus/${a.id}`,
      "articleBody": excerpt(a.content, 180),
    })),
  };

  const pageCount = Math.ceil(articlesToShow.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const end = page * PAGE_SIZE;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-5xl mx-auto px-2 md:px-6 py-12">
        {/* Saison Tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {seasonTabs.map(tab =>
            <button
              key={tab}
              className={`px-4 py-2 rounded-full font-bold border-2 transition-all duration-200
                ${selectedSeason === tab
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-400 shadow"
                  : "bg-white text-orange-700 border-orange-200 hover:bg-orange-100"
                }`}
              onClick={() => setSelectedSeason(tab)}
            >
              {tab === "ALL" ? "Toutes les saisons" : `Saison ${tab}`}
            </button>
          )}
        </div>

        {/* Catégorie Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              className={`px-6 py-2 rounded-full font-bold transition
                ${selectedCat === cat
                  ? "bg-orange-500 text-white shadow"
                  : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                }`}
              onClick={() => setSelectedCat(cat)}
            >
              {catLabel(cat)}
            </button>
          ))}
        </div>

        {/* Liste d’articles */}
        {loading ? (
          <div className="text-center text-orange-700 py-16 text-xl">Chargement des articles…</div>
        ) : articlesToShow.length === 0 ? (
          <div className="text-center text-orange-700 py-16 text-lg">Aucun article à afficher (pour l’instant…)</div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-8">
              <AnimatePresence>
                {articlesToShow.slice(start, end).map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 32, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl shadow-lg bg-white/95 border border-orange-100 overflow-hidden flex flex-col"
                  >
                    {a.image_url && (
                      <div className="aspect-[16/9] w-full overflow-hidden bg-white">
                        <Image
                          src={a.image_url}
                          alt={a.title}
                          width={800}
                          height={450}
                          className="w-full h-full object-cover object-center"
                          style={{ objectFit: "cover" }}
                          unoptimized={a.image_url.startsWith("data:")}
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex flex-col flex-1 p-5 gap-2">
                      <span className="text-xs text-gray-500 uppercase">{formatDate(a.created_at)}</span>
                      <h2 className="text-2xl font-bold text-orange-700">{a.title}</h2>
                      <p className="text-base text-gray-700 flex-1">{excerpt(a.content, 200)}</p>
                      <a
                        href={`/actus/${a.id}`}
                        className="mt-4 inline-block w-max px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow hover:scale-105 transition-all duration-200"
                      >
                        Lire l’article
                      </a>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {/* Pagination */}
            {pageCount > 1 && (
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded bg-orange-100 text-red-700 font-semibold hover:bg-orange-200 transition disabled:opacity-50"
                >
                  Précédent
                </button>
                <span className="font-bold text-orange-700">
                  Page {page} / {pageCount}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(pageCount, p + 1))}
                  disabled={page === pageCount}
                  className="px-4 py-2 rounded bg-orange-100 text-red-700 font-semibold hover:bg-orange-200 transition disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
