"use client";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
// Header et Footer sont gérés par le layout global
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Article = {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at?: string;
};

type ArticleClientProps = {
  article: Article | null;
};

type ShareLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
  color: string;
};

export default function ArticleClient({ article }: ArticleClientProps) {
  const [pathname, setPathname] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") setPathname(window.location.pathname);
  }, []);

  if (!article)
    return (
      <>
        <div className="max-w-3xl mx-auto py-20 text-center text-xl text-orange-700">
          Article introuvable ou supprimé 🥲
        </div>
      </>
    );

  const heroAnim = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };
  const contentAnim = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
  };

  const siteUrl = "https://les-comets-honfleur.vercel.app";
  const articleUrl = pathname
    ? `${siteUrl}${pathname}`
    : `${siteUrl}/actus/${article.id}`;

  const excerpt =
    typeof article.content === "string"
      ? article.content.replace(/(<([^>]+)>)/gi, "").slice(0, 120) + "…"
      : "";

  const shareLinks: ShareLink[] = [
    {
      label: "Partager sur Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}&quote=${encodeURIComponent(article.title + " – " + excerpt)}`,
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21.7 0H2.3C1 0 0 1 0 2.3v19.4C0 23 1 24 2.3 24H12v-9.3H9v-3.6h3V8.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.7.2 2.7.2v3H17c-1.4 0-1.8.9-1.8 1.8v2.1h3.5l-.6 3.6H15.2V24h6.5c1.3 0 2.3-1 2.3-2.3V2.3C24 1 23 0 21.7 0z" />
        </svg>
      ),
      color: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    {
      label: "Partager sur X (ex-Twitter)",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(article.title + " – " + excerpt)}`,
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 1200 1227" fill="currentColor"><path d="M923.163 0H1109.63L712.039 522.93L1181 1227H817.25L532.865 836.282L207.142 1227H20.636L442.456 659.053L0 0H372.435L628.073 361.716L923.163 0ZM862.583 1107.47H962.913L312.462 114.191H204.595L862.583 1107.47Z"/></svg>
      ),
      color: "bg-black hover:bg-gray-800 text-white",
    },
    {
      label: "Partager sur LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`,
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.8 0-5 2.2-5 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5v-14c0-2.8-2.2-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.3c-1 0-1.7-.8-1.7-1.7s.8-1.7 1.7-1.7c1 0 1.7.8 1.7 1.7s-.7 1.7-1.7 1.7zm14.5 10.3h-3v-4.7c0-1.1 0-2.5-1.5-2.5s-1.7 1.2-1.7 2.4v4.8h-3v-9h2.9v1.2h.1c.4-.7 1.2-1.4 2.5-1.4 2.7 0 3.2 1.7 3.2 4.1v5.1zm0 0"/></svg>
      ),
      color: "bg-blue-800 hover:bg-blue-900 text-white",
    },
    {
      label: "Partager sur Instagram",
      href: `https://www.instagram.com/?url=${encodeURIComponent(articleUrl)}`,
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.3.1 2 .3 2.4.5.6.3 1 .7 1.3 1.3.3.4.4 1.1.5 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.3-.3 2-.5 2.4-.3.6-.7 1-1.3 1.3-.4.3-1.1.4-2.4.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.3-.1-2-.3-2.4-.5-.6-.3-1-.7-1.3-1.3-.3-.4-.4-1.1-.5-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.3.3-2 .5-2.4.3-.6.7-1 1.3-1.3.4-.3 1.1-.4 2.4-.5C8.4 2.2 8.8 2.2 12 2.2m0-2.2C8.7 0 8.3 0 7 .1 5.7.2 4.7.4 4 .8 3.2 1.2 2.6 1.8 2.2 2.6c-.4.7-.6 1.7-.7 3C1.4 8.3 1.4 8.7 1.4 12c0 3.3 0 3.7.1 4.9.1 1.3.3 2.3.7 3 .4.8 1 1.4 1.8 1.8.7.4 1.7.6 3 .7 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c1.3-.1 2.3-.3 3-.7.8-.4 1.4-1 1.8-1.8.4-.7.6-1.7.7-3 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.1-1.3-.3-2.3-.7-3-.4-.8-1-1.4-1.8-1.8-.7-.4-1.7-.6-3-.7C15.7.1 15.3 0 12 0z"/><path d="M12 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zm0 10.3a4.1 4.1 0 1 1 0-8.2 4.1 4.1 0 0 1 0 8.2zm6.4-11.5a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z"/></svg>
      ),
      color: "bg-gradient-to-tr from-pink-600 via-yellow-400 to-purple-600 text-white",
    },
    {
      label: "Partager par Email",
      href: `mailto:?subject=${encodeURIComponent("À lire : " + article.title)}&body=${encodeURIComponent("Je voulais te partager cet article du club Les Comets d’Honfleur !\n\n" + article.title + "\n\n" + excerpt + "\n\nDécouvre l’article complet ici : " + articleUrl)}`,
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M1.5 4A2.5 2.5 0 0 0 0 6.5v11A2.5 2.5 0 0 0 2.5 20h19a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 21.5 4h-19Zm0 2h19c.3 0 .5.2.5.5v.16l-10 6.36-10-6.36V6.5c0-.3.2-.5.5-.5Zm-.5 2.37 9.77 6.2a1 1 0 0 0 1.06 0l9.67-6.14v8.57c0 .3-.2.5-.5.5h-19a.5.5 0 0 1-.5-.5V8.37Z"/>
        </svg>
      ),
      color: "bg-orange-400 hover:bg-orange-500 text-white",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-100/60 flex flex-col">
        {/* HERO IMAGE */}
        <motion.div {...heroAnim}>
          <div className="max-w-3xl mx-auto w-full rounded-3xl overflow-hidden mt-8 shadow-xl border border-orange-200 bg-white/90">
            {article.image_url && (
              <div className="aspect-[16/9] w-full">
                <Image
                  src={article.image_url}
                  alt={article.title}
                  width={800}
                  height={450}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  sizes="(max-width: 900px) 100vw, 800px"
                  unoptimized={typeof article.image_url === "string" && article.image_url.startsWith("data:")}
                />
              </div>
            )}
            <div className="px-7 pb-6 pt-4">
              <span className="block text-xs text-gray-500 uppercase tracking-wide mb-1">
                {article.created_at ? new Date(article.created_at).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" }) : ""}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-orange-700 mb-4 leading-tight tracking-tight drop-shadow-md">
                {article.title}
              </h1>
            </div>
          </div>
        </motion.div>

        {/* CONTENU DE L’ARTICLE */}
        <motion.div
          {...contentAnim}
          className="max-w-3xl mx-auto flex-1 px-2 md:px-8 pb-8 pt-6"
        >
          <article
            className="prose md:prose-lg max-w-none bg-white/90 rounded-3xl p-7 shadow-lg border border-orange-100 text-gray-900 text-lg leading-relaxed"
            style={{ whiteSpace: "pre-line" }}
          >
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{article.content}</ReactMarkdown>
          </article>

          {/* BARRE DE PARTAGE RÉSEAUX */}
          <div className="mt-10 py-8 px-4 bg-gradient-to-r from-orange-100 via-yellow-50 to-orange-50 rounded-2xl shadow-md border border-orange-200 flex flex-col items-center gap-4">
            <div className="text-xl md:text-2xl font-bold text-red-600 mb-2 text-center">
              📣 Partage cet article autour de toi !
            </div>
            <div className="flex gap-4 flex-wrap justify-center">
              {shareLinks.map(({ label, href, icon, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className={`rounded-full p-3 transition text-xl shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400 ${color}`}
                  aria-label={label}
                >
                  {icon}
                </a>
              ))}
            </div>
            <div className="text-sm text-orange-700 font-semibold mt-1">
              Avec les Comets, l’info fait toujours un home run !
            </div>
          </div>

          {/* Bouton retour actus */}
          <div className="mt-10 flex justify-center">
            <Link
              href="/actus"
              className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold shadow hover:scale-105 hover:from-orange-600 hover:to-red-700 transition text-lg"
            >
              ← Revenir aux actus du club
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
