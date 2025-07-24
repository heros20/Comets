import TeamPage from "@/components/Team";

export const metadata = {
  title: "Les Comets de Honfleur - Équipe de Baseball | Roster & Résultats",
  description:
    "Découvrez l'effectif à jour de l’équipe Les Comets de Honfleur, club de baseball en Normandie : joueurs, matchs, résultats et liens vers la FFBS. L’esprit baseball en Normandie, c’est ici !",
  openGraph: {
    title: "Les Comets de Honfleur - Baseball en Normandie",
    description:
      "Retrouvez les joueurs, les résultats et le calendrier de l’équipe de baseball Les Comets de Honfleur. Infos officielles, ambiance club, et roster complet.",
    url: "https://les-comets-honfleur.vercel.app/equipe",
    images: [
      {
        url: "https://les-comets-honfleur.vercel.app/images/team2025.jpg", // Change avec ton image si besoin
        width: 1200,
        height: 630,
        alt: "Les Comets de Honfleur - Équipe de Baseball",
      },
    ],
    type: "website",
  },
  keywords: [
    "baseball", "Honfleur", "équipe", "Comets", "Normandie", "roster", "joueurs", "matchs", "FFBS", "sport", "calendrier"
  ],
  robots: "index,follow",
};

export default function Page() {
  return <TeamPage />;
}
