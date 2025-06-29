import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
const baseUrl = "https://les-comets-honfleur.vercel.app/";

return [
{
url: baseUrl,
lastModified: new Date().toISOString(),
},
{
url: `${baseUrl}#accueil`,
lastModified: new Date().toISOString(),
},
{
url: `${baseUrl}#stats`,
lastModified: new Date().toISOString(),
},
{
url: `${baseUrl}#equipe`,
lastModified: new Date().toISOString(),
},
{
url: `${baseUrl}#galerie`,
lastModified: new Date().toISOString(),
},
{
url: `${baseUrl}#contact`,
lastModified: new Date().toISOString(),
},
];
}
