// app/informations/page.tsx
import { Metadata } from "next";
// Header et Footer sont désormais gérés par le layout global
import { InfosComponent } from "@/components/InfosComponent";

export const metadata: Metadata = {
  title: "Infos Club | Les Comets Honfleur Baseball",
  description: "Toutes les informations utiles pour rejoindre le club de baseball Les Comets à Honfleur : horaires, modalités, équipement, FAQ. Rejoins le baseball en Normandie !",
  keywords: [
    "baseball Honfleur",
    "infos baseball Honfleur",
    "horaires baseball",
    "inscription baseball",
    "club baseball Normandie",
    "équipe baseball",
    "matériel baseball",
    "Comets Honfleur FAQ"
  ],
  openGraph: {
    title: "Informations – Les Comets Honfleur Baseball Club",
    description: "Questions, horaires, équipement, inscription : découvre comment rejoindre l’équipe de baseball Les Comets à Honfleur.",
    url: "https://les-comets-honfleur.vercel.app/informations",
    siteName: "Baseball Club - Les Comets Honfleur",
    images: [
      {
        url: "https://les-comets-honfleur.vercel.app/comets-cover.webp",
        width: 1200,
        height: 630,
        alt: "Baseball Honfleur Comets"
      }
    ],
    locale: "fr_FR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Informations – Les Comets Honfleur Baseball Club",
    description: "Toutes les infos pratiques pour rejoindre et jouer chez les Comets de Honfleur.",
    images: ["https://les-comets-honfleur.vercel.app/comets-cover.webp"]
  },
  alternates: { canonical: "https://les-comets-honfleur.vercel.app/informations" }
};

export default function InformationsPage() {
  return (
    <>
      <main className="pt-12 pb-20 min-h-[70vh]">
        <section className="
            max-w-5xl mx-auto
            my-12
            bg-white/90
            rounded-2xl
            shadow-2xl
            ring-2 ring-orange-200/80
            backdrop-blur
            px-6 md:px-12 py-8
            transition-all duration-300
          ">
            <h1 className="text-4xl md:text-5xl font-extrabold text-center text-red-700 drop-shadow-xl mb-3">
              Toutes les infos pour rejoindre les Comets ⚾️
            </h1>
            <p className="text-lg text-gray-700 text-center mb-4">
              Horaires, inscriptions, équipement, FAQ&nbsp;: <span className="text-orange-600 font-bold">on répond à tout !</span>
              <br />
              Le baseball à Honfleur, tous les niveaux, toute l’année.
            </p>
          </section>

        <InfosComponent />
      </main>
    </>
  );
}
