import Actus from "@/components/Actus";

export const metadata = {
  title: "Actualités Baseball Honfleur – Les Comets | News, Annonces, Vie du club",
  description:
    "Toute l’actualité du club de baseball Les Comets de Honfleur : résultats, annonces, vie du club, moments forts de la saison, photos et plus encore. Suivez-nous et vibrez baseball !",
  openGraph: {
    title: "Actualités – Les Comets de Honfleur",
    description:
      "Les dernières nouvelles officielles du club de baseball Les Comets de Honfleur : news, résultats, annonces, photos et vie du club.",
    url: "https://les-comets-honfleur.vercel.app/actus",
    images: [
      {
        url: "https://les-comets-honfleur.vercel.app/images/actus_cover.jpg", // change si tu as mieux !
        width: 1200,
        height: 630,
        alt: "Actualités Baseball Comets Honfleur",
      },
    ],
    type: "website",
  },
  keywords: [
    "baseball", "actualité", "Comets", "Honfleur", "news", "résultats", "sport", "club", "Normandie", "annonces"
  ],
  robots: "index,follow",
};

export default function Page() {
  return <Actus />;
}
