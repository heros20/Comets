import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Les Comets d\'Honfleur',  // Mets ton nom ici
  description: 'Site officiel de l\'équipe de baseball Les Comets d\'Honfleur',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
