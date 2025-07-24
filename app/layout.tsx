import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"
import JsonLd from "../components/JsonLd"
import LayoutClient from "../components/LayoutClient";
import { AuthProvider } from "@/components/AuthContext";

// *** METADATA PRINCIPALE POUR TOUT LE SITE ***
export const metadata: Metadata = {
  title: "Baseball Club - Les Comets Honfleur",
  description:
    "Club officiel de baseball à Honfleur (Normandie) : matchs, actualités, équipe, entraînements, photos et infos adhésion. Rejoins une équipe conviviale et passionnée !",
  keywords: [
    "baseball", "club de baseball", "Honfleur", "Comets Honfleur", "équipe baseball",
    "sport Honfleur", "Normandie", "baseball Normandie", "baseball club Honfleur",
    "match baseball", "entraînement baseball", "galerie baseball", "adhésion baseball", "contact baseball", "sport collectif", "enfants", "adultes"
  ],
  openGraph: {
    title: "Baseball Club - Les Comets Honfleur",
    description: "Découvre le club de baseball Les Comets à Honfleur : résultats, calendrier, équipe, galerie, inscription.",
    url: "https://les-comets-honfleur.vercel.app/",
    type: "website",
    siteName: "Les Comets Honfleur",
    images: [
      {
        url: "https://les-comets-honfleur.vercel.app/images/honfleurcomets.png",
        width: 1200,
        height: 630,
        alt: "Logo Les Comets Honfleur"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Baseball Club - Les Comets Honfleur",
    description: "Rejoins les Comets Honfleur, le club de baseball convivial et passionné en Normandie.",
    images: [
      "https://les-comets-honfleur.vercel.app/images/honfleurcomets.png"
    ]
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
  publisher: "Les Comets Honfleur",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* SEO balèze */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* FAVICONS */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        {/* Canonical */}
        <link rel="canonical" href="https://les-comets-honfleur.vercel.app/" />
        {/* Adresse du club pour Google */}
        <meta name="address" content="Terrain de Baseball, Espace sportif René Le Floch, Avenue de la brigade Piron, 14600 Honfleur, France" />
        {/* Mail/Tel pour rich results */}
        <meta name="contact" content="president@les-comets-honfleur.fr" />
        <meta name="telephone" content="06.30.32.30.76" />
        {/* Google Search Console */}
        <meta name="google-site-verification" content="gwi_1N79m9NaFbKmzhg8K9EOL6pv8kxcYFPCm_7YS58" />
        {/* OpenGraph/Twitter et tout le reste sont gérés par Next automatiquement via `metadata` */}
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {/* JSON-LD pour booster le rich snippet */}
        <JsonLd />
        {/* Fond stade de baseball */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundImage: 'url("/images/CometsWallpaper2.jpeg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.5)',
            zIndex: -1,
          }}
          aria-hidden="true"
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <AuthProvider>
            <LayoutClient>
              {children}
            </LayoutClient>
          </AuthProvider>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
