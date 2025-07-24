import type { Metadata } from "next";
import Gallery from "@/components/Gallery"; // Ton composant

export const metadata: Metadata = {
  title: "Galerie Photos | Les Comets Honfleur Baseball",
  description: "Découvrez toutes les photos des Comets : matchs, équipe, entraînements, souvenirs. Plongez dans l’univers baseball à Honfleur !",
  keywords: [
    "galerie baseball",
    "photos Comets Honfleur",
    "baseball Normandie",
    "galerie sportive",
    "Comets équipe",
  ],
  openGraph: {
    title: "Galerie Photos – Les Comets Honfleur Baseball",
    description: "Toutes les images officielles du club Comets Honfleur : matchs, équipes, moments forts et souvenirs baseball à Honfleur.",
    url: "https://les-comets-honfleur.vercel.app/galerie",
    siteName: "Les Comets Honfleur",
    images: [
      {
        url: "https://les-comets-honfleur.vercel.app/comets-cover.webp",
        width: 1200,
        height: 630,
        alt: "Galerie Baseball Comets Honfleur",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  alternates: { canonical: "https://les-comets-honfleur.vercel.app/galerie" },
};

export default function GaleriePage() {
  return (
    <>
      <Gallery />
    </>
  );
}
