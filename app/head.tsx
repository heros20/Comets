export default function Head() {
  return (
    <>
      <title>Les Comets d'Honfleur - Équipe de Baseball Passionnée et Victorieuse</title>
      <meta
        name="description"
        content="Site officiel des Comets d'Honfleur, équipe de baseball basée à Honfleur. Rejoignez-nous pour vivre la passion du baseball, suivre nos matchs, nos entraînements et découvrir notre galerie."
      />
      <meta
        name="keywords"
        content="baseball, comets honfleur, équipe baseball, baseball normandie, sport honfleur, entraînements baseball"
      />
      <meta name="author" content="Les Comets d'Honfleur" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <link rel="icon" href="/favicon.ico" />
      <link rel="canonical" href="https://comets-git-main-herosqwerty-1719s-projects.vercel.app" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Les Comets d'Honfleur - Équipe de Baseball Passionnée et Victorieuse" />
      <meta
        property="og:description"
        content="Rejoignez Les Comets d'Honfleur, l'équipe de baseball de la région. Suivez nos actualités, matchs et entraînements."
      />
      <meta property="og:url" content="https://comets-git-main-herosqwerty-1719s-projects.vercel.app" />
      <meta property="og:image" content="https://comets-git-main-herosqwerty-1719s-projects.vercel.app/images/baseballwallpaper.webp" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Les Comets d'Honfleur - Équipe de Baseball Passionnée et Victorieuse" />
      <meta
        name="twitter:description"
        content="Rejoignez Les Comets d'Honfleur, l'équipe de baseball de la région. Suivez nos actualités, matchs et entraînements."
      />
      <meta name="twitter:image" content="https://comets-git-main-herosqwerty-1719s-projects.vercel.app/images/baseballwallpaper.webp" />
      <meta name="google-site-verification" content="gwi_1N79m9NaFbKmzhg8K9EOL6pv8kxcYFPCm_7YS58" />
      {/* JSON-LD pour SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsTeam",
            name: "Les Comets d'Honfleur",
            sport: "Baseball",
            url: "https://comets-git-main-herosqwerty-1719s-projects.vercel.app",
            logo: "https://comets-git-main-herosqwerty-1719s-projects.vercel.app/images/logo.png",
            memberOf: {
              "@type": "SportsOrganization",
              name: "Ligue régionale de baseball",
            },
            location: {
              "@type": "Place",
              name: "Stade Municipal d'Honfleur",
              address: "14600 Honfleur, France",
            },
          }),
        }}
      />
    </>
  );
}
