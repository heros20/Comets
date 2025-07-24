// Header et Footer sont intégrés dans le layout global
import CalendrierTabs from "./CalendrierTabs";

export const metadata = {
  title: "Calendrier des matchs | Comets Honfleur",
  description: "Planning officiel des matchs Comets Honfleur : adversaires, scores, boxscores. Tous les résultats et infos de la saison de baseball en un clin d’œil.",
  keywords: [
    "baseball", "Honfleur", "calendrier", "matchs", "Comets", "saison", "résultats", "boxscore"
  ],
  openGraph: {
    title: "Calendrier Comets Honfleur Baseball",
    description: "Consultez le calendrier officiel des matchs : à venir, joués, scores et planning du club.",
    url: "https://les-comets-honfleur.vercel.app/calendrier",
  }
};

// API déjà formatée
async function getGames() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${BASE_URL}/api/games`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export default async function CalendrierPage() {
  const games = await getGames();

  return (
    <>
      <main className="max-w-4xl mx-auto px-2 md:px-6 py-8">
        <CalendrierTabs games={games} />
      </main>
    </>
  );
}
