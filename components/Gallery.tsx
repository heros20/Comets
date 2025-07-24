"use client";
import useSWR from "swr";
import Image from "next/image";
import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryImg {
  id?: string | number;
  url: string;
  legend?: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Gallery() {
  const { data: gallery, isLoading } = useSWR<GalleryImg[]>("/api/gallery", fetcher);
  const [modalImg, setModalImg] = useState<GalleryImg | null>(null);
  const [showAll, setShowAll] = useState(false);
  const galleryTitleRef = useRef<HTMLHeadingElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (modalImg && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [modalImg]);

  useEffect(() => {
    if (!modalImg) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setModalImg(null);
    }
    window.addEventListener("keydown", onKeyDown as any);
    return () => window.removeEventListener("keydown", onKeyDown as any);
  }, [modalImg]);

  if (isLoading || !gallery)
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">Chargement…</div>
      </section>
    );

  const visibleImages = showAll ? gallery : gallery.slice(0, 8);

  const getImageAlt = (img: GalleryImg, idx: number) => {
    let alt = img.legend ? img.legend : `Photo Comets Honfleur baseball ${idx + 1}`;
    if (!alt.toLowerCase().includes("honfleur")) alt += " – Honfleur";
    if (!alt.toLowerCase().includes("baseball")) alt += " – Baseball";
    if (!alt.toLowerCase().includes("comets")) alt += " – Comets";
    return alt;
  };

  return (
    <section id="galerie" className="relative py-20 flex flex-col items-center">
      {/* Glow de fond */}
      <div className="
        pointer-events-none
        absolute -z-10 left-1/2 top-24
        -translate-x-1/2 w-[800px] h-[300px]
        bg-gradient-to-tr from-orange-200 via-red-300 to-yellow-100
        rounded-full blur-3xl
      " />
      {/* Boîte titre + texte, seule au centre, taille modérée */}
      <div className="mb-10 max-w-3xl bg-white/90 rounded-2xl shadow-xl ring-2 ring-orange-200/80 backdrop-blur p-8 text-center">
        <h2
          className="text-4xl md:text-5xl font-bold text-red-700 mb-4 drop-shadow"
          ref={galleryTitleRef}
        >
          Galerie Photos – Comets Baseball Honfleur
        </h2>
        <p className="text-xl text-black/90 max-w-2xl mx-auto">
          Plonge dans la <strong>galerie officielle</strong> des Comets :<br />
          matchs, moments forts, souvenirs…<br />
          L’âme du baseball normand, capturée en images.
        </p>
      </div>

      {/* La grille d’images dans sa card, mais SANS p-8 ou p-4 autour ! */}
      <div className="w-full max-w-6xl">
        <div className="
          bg-white/80 rounded-2xl shadow-2xl ring-2 ring-orange-200/60 backdrop-blur
          flex flex-col gap-6
          ">
          <div
            className="
              grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 p-4
            "
            aria-label="Galerie photos équipe de baseball Comets Honfleur"
          >
            {visibleImages.map((img, idx) => (
              <motion.figure
                key={img.id ?? idx}
                className="
                  relative rounded-2xl bg-white/90 shadow-xl ring-1 ring-orange-100 hover:ring-orange-400
                  backdrop-blur overflow-hidden group transition-all duration-300 cursor-pointer
                  hover:-translate-y-1 hover:shadow-2xl
                "
                style={{ height: "240px" }}
                whileHover={{ scale: 1.04 }}
                onClick={() => setModalImg(img)}
                tabIndex={0}
                aria-label={`Photo ${idx + 1} de la galerie Comets Honfleur`}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") setModalImg(img);
                }}
                role="button"
              >
                <Image
                  src={img.url}
                  alt={getImageAlt(img, idx)}
                  fill
                  style={{ objectFit: "cover" }}
                  priority={idx === 0}
                  placeholder="blur"
                  blurDataURL="../public/images/baseballwallpaper.webp"
                  loading={idx === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {img.legend && (
                  <figcaption className="absolute bottom-3 left-3 bg-white/95 rounded-xl px-4 py-2 text-orange-700 font-semibold text-base shadow-xl max-w-[90%]">
                    {img.legend}
                  </figcaption>
                )}
              </motion.figure>
            ))}
          </div>

          {/* Voir plus / moins */}
          {gallery.length > 8 && (
            <div className="flex justify-center mt-4 pb-4">
              <button
                onClick={() => {
                  if (showAll && galleryTitleRef.current) {
                    setShowAll(false);
                    setTimeout(() => {
                      galleryTitleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 100);
                  } else {
                    setShowAll(true);
                  }
                }}
                className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white text-lg font-bold px-10 py-3 rounded-full shadow transition"
                aria-label={showAll ? "Réduire la galerie" : "Voir plus de photos"}
              >
                {showAll ? "Voir moins" : "Voir plus"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table cachée SEO */}
      <table style={{ position: 'absolute', left: '-9999px', top: '-9999px', height: 0, width: 0 }}>
        <caption>
          Galerie officielle de l’équipe de baseball Les Comets d’Honfleur – Photos, souvenirs, matchs, entraînements et moments marquants à Honfleur.
        </caption>
      </table>
      {/* MODALE ANIMÉE */}
      <AnimatePresence>
        {modalImg && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setModalImg(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Image en grand format"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-w-[92vw] max-h-[90vh] cursor-auto"
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.27, ease: "easeOut" }}
            >
              <button
                ref={closeBtnRef}
                onClick={() => setModalImg(null)}
                className="absolute top-2 right-2 text-white bg-black/70 rounded-full p-3 hover:bg-orange-600 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-orange-400"
                aria-label="Fermer la photo agrandie"
                tabIndex={0}
              >
                ✕
              </button>
              <Image
                src={modalImg.url}
                alt={getImageAlt(modalImg, 0)}
                width={900}
                height={1200}
                style={{ objectFit: "contain" }}
                loading="eager"
                className="rounded-2xl bg-black"
              />
              {modalImg.legend && (
                <div className="mt-4 text-center text-white font-bold text-lg drop-shadow">{modalImg.legend}</div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
