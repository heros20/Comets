import ArticleClient from "./ArticleClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

// --- Fetch l’article (SSR)
async function getArticle(id: string) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${BASE_URL}/api/news/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  return data && !data.error ? data : null;
}

// --- SEO dynamique
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${BASE_URL}/api/news/${id}`);
  if (!res.ok) {
    return {
      title: "Article introuvable | Comets Honfleur",
      description: "Cet article n’existe pas ou a été supprimé.",
    };
  }
  const data = await res.json();
  if (!data || data.error) {
    return {
      title: "Article introuvable | Comets Honfleur",
      description: "Cet article n’existe pas ou a été supprimé.",
    };
  }
  return {
    title: `${data.title} – Actualités Baseball Honfleur | Comets`,
    description: data.content?.slice(0, 160),
    openGraph: {
      title: data.title,
      description: data.content?.slice(0, 180),
      images: [data.image_url || "/images/actus_cover.jpg"],
      url: `${BASE_URL}/actus/${data.id}`,
      type: "article",
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  const article = await getArticle(id);
  return <ArticleClient article={article} />;
}
