"use client";
import useSWR from "swr";
import Image from "next/image";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Gallery() {
  const { data: gallery, isLoading } = useSWR(
    "/api/gallery",
    fetcher
    // plus de refreshInterval => fetch unique au montage, pas de surcharge
  );

  if (isLoading || !gallery)
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">Chargement…</div>
      </section>
    );

  return (
    <section id="galerie" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-red-700 mb-4">Galerie Photos</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Revivez nos meilleurs moments sur le terrain</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((img: any, idx: number) => (
            <div
              key={img.id || idx}
              className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            >
              <Image
                src={img.url}
                alt={img.legend || `Photo ${idx + 1}`}
                width={400}
                height={256}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                placeholder="blur"
                blurDataURL="/placeholder.svg"
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
      </div>
    </section>
  );
}
