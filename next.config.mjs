const nextConfig = {
  // Désactive l’option qui ignore les erreurs !
  eslint: {
    ignoreDuringBuilds: false, // <= le build échoue en cas d’erreur ESLint
  },
  typescript: {
    ignoreBuildErrors: false, // <= le build échoue en cas d’erreur TypeScript
  },
 images: {
    domains: [
      'les-comets-honfleur.vercel.app',
      'ncqeaqymxdktlrdxxjlv.supabase.co',
       "static.wbsc.org",
      // Ajout tous les domaines externes qui hébergent tes images
    ],
    // formats: ['image/webp'], // Optionnel, Next.js gère tout seul les formats modernes
  },
};
export default nextConfig;
