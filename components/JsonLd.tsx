// app/components/JsonLd.tsx
'use client'
import { useEffect } from "react"

export default function JsonLd() {
  useEffect(() => {
    // Script SportsTeam
    const script1 = document.createElement('script')
    script1.type = 'application/ld+json'
    script1.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SportsTeam",
      name: "Les Comets d'Honfleur",
      sport: "Baseball",
      url: "https://les-comets-honfleur.vercel.app/",
      logo: "https://les-comets-honfleur.vercel.app/images/logo.png",
      memberOf: {
        "@type": "SportsOrganization",
        name: "Ligue régionale de baseball",
      },
      location: {
        "@type": "Place",
        name: "Stade Municipal d'Honfleur",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Stade Municipal d'Honfleur",
          addressLocality: "Honfleur",
          postalCode: "14600",
          addressCountry: "FR",
        },
      },
      telephone: "+33612345678",
      email: "contact@comets-honfleur.fr",
    })
    document.head.appendChild(script1)

    // Script LocalBusiness
    const script2 = document.createElement('script')
    script2.type = 'application/ld+json'
    script2.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Les Comets d'Honfleur",
      image: "https://les-comets-honfleur.vercel.app/images/logo.png",
      "@id": "https://les-comets-honfleur.vercel.app/",
      url: "https://les-comets-honfleur.vercel.app/",
      telephone: "+33612345678",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Stade Municipal d'Honfleur",
        addressLocality: "Honfleur",
        postalCode: "14600",
        addressCountry: "FR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 49.4208,
        longitude: 0.2331
      },
      openingHours: [
        "Tu 17:00-19:00",
        "Th 19:00-21:00"
      ],
      email: "contact@comets-honfleur.fr",
      priceRange: "€"
    })
    document.head.appendChild(script2)

    // Cleanup (hot reload/dev)
    return () => {
      document.head.removeChild(script1)
      document.head.removeChild(script2)
    }
  }, [])

  return null
}
