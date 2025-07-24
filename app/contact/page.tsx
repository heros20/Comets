import { Metadata } from "next";
import ContactClientPage from "@/components/Contact";

// SEO 🔥
export const metadata: Metadata = {
  title: "Contact | Les Comets Honfleur Baseball Club",
  description:
    "Une question, une envie de baseball ? Contactez le club Les Comets à Honfleur : formulaire, adresse, téléphone, mail. Rejoignez l’aventure en Normandie !",
  keywords: [
    "baseball Honfleur",
    "contact baseball",
    "Comets Honfleur",
    "club baseball Normandie",
    "équipe baseball",
    "rejoindre baseball Honfleur",
    "baseball Seine Maritime",
    "contact Comets",
  ],
  openGraph: {
    title: "Contact – Les Comets Honfleur Baseball Club",
    description:
      "Envie de baseball ? Contactez les Comets à Honfleur pour toute demande, adhésion ou renseignement !",
    url: "https://les-comets-honfleur.vercel.app/contact",
    siteName: "Baseball Club - Les Comets Honfleur",
    images: [
      {
        url: "https://les-comets-honfleur.vercel.app/comets-cover.webp",
        width: 1200,
        height: 630,
        alt: "Baseball Honfleur Comets",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact – Les Comets Honfleur Baseball Club",
    description:
      "Une question ? Une envie de baseball ? Contactez les Comets de Honfleur.",
    images: ["https://les-comets-honfleur.vercel.app/comets-cover.webp"],
  },
  alternates: { canonical: "https://les-comets-honfleur.vercel.app/contact" },
};

export default function ContactPage() {
  return <ContactClientPage />;
}
