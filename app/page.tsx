// app/page.tsx
import HomeClient from "@/components/HomeClient";

export const metadata = {
  title: "Accueil | Baseball Club - Les Comets Honfleur",
  description:
    "Bienvenue sur le site officiel du Baseball Club Les Comets Honfleur ! Découvre l’actu du club, notre équipe, le calendrier des matchs, la galerie photos et comment rejoindre la grande famille du baseball à Honfleur, Normandie.",
  keywords: [
    "baseball Honfleur",
    "club baseball Normandie",
    "équipe baseball Comets",
    "sport Honfleur",
    "rejoindre baseball Honfleur",
    "calendrier baseball",
    "galerie baseball",
    "actualité baseball",
    "adhésion baseball",
    "Comets Honfleur",
    "balle",
    "batte",
    "entraînement baseball",
    "inscription baseball",
    "enfants baseball Honfleur",
    "adultes baseball Normandie"
  ],
  openGraph: {
    title: "Accueil – Baseball Club Les Comets Honfleur",
    description:
      "Club officiel de baseball à Honfleur (Normandie) : actualités, calendrier, équipe, galerie, inscriptions et contacts. Rejoins-nous !",
    url: "https://les-comets-honfleur.vercel.app/",
    siteName: "Baseball Club - Les Comets Honfleur",
    images: [
      {
        url: "https://les-comets-honfleur.vercel.app/images/honfleurcomets.png",
        width: 1200,
        height: 630,
        alt: "Logo du Baseball Club Les Comets Honfleur",
      },
    ],
    locale: "fr_FR",
    type: "website",
    email: "president@les-comets-honfleur.fr",
    phone: "06.30.32.30.76",
    address: "Terrain de Baseball, Espace sportif René Le Floch, Avenue de la brigade Piron, 14600 Honfleur, France",
  },
  twitter: {
    card: "summary_large_image",
    title: "Accueil – Baseball Club Les Comets Honfleur",
    description:
      "Toute l’actualité, résultats et infos sur le club de baseball Les Comets à Honfleur (Normandie). Rejoins l’aventure !",
    images: ["https://les-comets-honfleur.vercel.app/images/honfleurcomets.png"],
  },
  alternates: {
    canonical: "https://les-comets-honfleur.vercel.app/"
  },
  robots: "index, follow",
  authors: [
    { name: "Président : Kevin Bigoni", url: "mailto:president@les-comets-honfleur.fr" },
    { name: "Les Comets Honfleur" }
  ],
  creator: "Les Comets Honfleur",
  publisher: "Les Comets Honfleur"
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white/40">
      <HomeClient />
    </div>
  );
}
