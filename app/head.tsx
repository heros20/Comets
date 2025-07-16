// app/head.tsx

export default function Head() {
  return (
    <>
      <title>Honfleur Baseball-Club – Les Comets | Équipe officielle à Honfleur</title>
      <meta
        name="description"
        content="Rejoins Honfleur Baseball-Club – Les Comets ! Passion, esprit d'équipe et bonne ambiance sur le terrain. Découvre le baseball à Honfleur avec une équipe engagée, conviviale et amusante."
      />
      <meta
        name="keywords"
        content="baseball, honfleur, club de baseball, comets honfleur, baseball normandie, équipe baseball, sport honfleur, baseball club, entraînements baseball, baseball honfleur, baseball comets, sport honfleur, sport, batte, gant, balle"
      />
      <meta name="author" content="Honfleur Baseball-Club – Les Comets" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="canonical" href="https://les-comets-honfleur.vercel.app/" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Honfleur Baseball-Club – Les Comets" />
      <meta
        property="og:description"
        content="Rejoins Honfleur Baseball-Club – Les Comets ! Passion, esprit d'équipe et excellence sur le terrain. Découvre le baseball à Honfleur avec une équipe engagée, conviviale et victorieuse."
      />
      <meta property="og:url" content="https://les-comets-honfleur.vercel.app/" />
      <meta property="og:image" content="https://les-comets-honfleur.vercel.app/images/honfleurcomets.png" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Honfleur Baseball-Club – Les Comets" />
      <meta
        name="twitter:description"
        content="Rejoins Honfleur Baseball-Club – Les Comets ! Passion, esprit d'équipe et excellence sur le terrain. Découvre le baseball à Honfleur avec une équipe engagée, conviviale et victorieuse."
      />
      <meta name="twitter:image" content="https://les-comets-honfleur.vercel.app/images/honfleurcomets.png" />

      {/* Google Search Console */}
      <meta name="google-site-verification" content="gwi_1N79m9NaFbKmzhg8K9EOL6pv8kxcYFPCm_7YS58" />
    </>
  );
}
