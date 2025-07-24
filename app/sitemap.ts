import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://les-comets-honfleur.vercel.app";

  // Les routes principales du site
  const staticRoutes = [
    "/",
    "/classement",
    "/equipe",
    "/calendrier",
    "/actus",
    "/galerie",
    "/rejoindre",
    "/contact",
    "/login",
    "/register",
    "/profil",
    "/mentions-legales",
    "/informations"
  ];

  // Génération de la date de maj (aujourd’hui pour tout)
  const now = new Date().toISOString();

  // Retourne la liste au format attendu
  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
  }));
}
