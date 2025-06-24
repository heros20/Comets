"use client";
import useSWR from "swr";
import Image from "next/image";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Gallery() {
  const { data: gallery, isLoading } = useSWR("/api/gallery", fetcher);
  const [modalImg, setModalImg] = useState<{ url: string; legend?: string } | null>(null);
  const [showAll, setShowAll] = useState(false);
  const galleryTitleRef = useRef<HTMLHeadingElement>(null);

  if (isLoading || !gallery)
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">Chargement…</div>
      </section>
    );

  // Découpe les images
  const visibleImages = showAll ? gallery : gallery.slice(0, 4);

  return (
    <section id="galerie" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-red-700 mb-4"
            ref={galleryTitleRef}
          >
            Galerie Photos
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Revivez nos meilleurs moments sur le terrain
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visibleImages.map((img: any, idx: number) => (
            <div
              key={img.id || idx}
              className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
              style={{ height: "200px", width: "100%" }}
              onClick={() => setModalImg({ url: img.url, legend: img.legend })}
              aria-label={`Afficher la photo ${idx + 1} en grand`}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") setModalImg({ url: img.url, legend: img.legend });
              }}
            >
              <Image
                src={img.url}
                alt={img.legend || `Photo ${idx + 1}`}
                fill
                style={{ objectFit: "cover" }}
                placeholder="blur"
                blurDataURL="/placeholder.svg"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 300px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {img.legend && (
                <div className="absolute bottom-2 left-2 bg-white/80 rounded px-3 py-1 text-orange-700 font-semibold text-sm shadow">
                  {img.legend}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Voir plus / Voir moins */}
        {gallery.length > 4 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => {
                if (showAll && galleryTitleRef.current) {
                  setShowAll(false);
                  setTimeout(() => {
                    galleryTitleRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 100);
                } else {
                  setShowAll(true);
                }
              }}
              className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white text-lg font-bold px-8 py-3 rounded-full shadow transition"
            >
              {showAll ? "Voir moins" : "Voir plus"}
            </button>
          </div>
        )}
      </div>

      {/* MODALE ANIMÉE */}
      <AnimatePresence>
        {modalImg && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={() => setModalImg(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Image en grand format"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-w-[90vw] max-h-[90vh] cursor-auto"
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <button
                onClick={() => setModalImg(null)}
                className="absolute top-2 right-2 text-white bg-black bg-opacity-60 rounded-full p-2 hover:bg-opacity-90 transition"
                aria-label="Fermer l'image"
              >
                ✕
              </button>
              <Image
                src={modalImg.url}
                alt={modalImg.legend || "Image agrandie"}
                width={800}
                height={1200}
                style={{ objectFit: "contain" }}
                priority
              />
              {modalImg.legend && (
                <div className="mt-2 text-center text-white font-semibold">{modalImg.legend}</div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
