import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"
import JsonLd from "../components/JsonLd"

export const metadata: Metadata = {
  title: "Les Comets d'Honfleur - Équipe de Baseball Passionnée et Victorieuse",
  description: "Site officiel des Comets d'Honfleur, équipe de baseball basée à Honfleur. Rejoignez-nous pour vivre la passion du baseball, suivre nos matchs, nos entraînements et découvrir notre galerie.",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        {/* Toutes tes meta ici */}
        <meta name="keywords" content="baseball, comets honfleur, équipe baseball, baseball normandie, sport honfleur, entraînements baseball, honfleur baseball" />
        <meta name="author" content="Les Comets d'Honfleur" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://les-comets-honfleur.vercel.app/" />
        {/* ... tes Open Graph, Twitter, Google Search Console ... */}
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {/* *** AJOUTE ICI *** */}
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
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  )
}
