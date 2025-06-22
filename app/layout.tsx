import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Les Comets d'Honfleur",
  description: "Site officiel de l'équipe de baseball Les Comets d'Honfleur",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0 }}>
        {/* Fond stade de baseball */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundImage: 'url("/images/baseballwallpaper.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.5)',
            zIndex: -1,
          }}
          aria-hidden="true"
        />

        {/* Contenu principal */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  )
}
