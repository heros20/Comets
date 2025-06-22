"use client";
import useSWR from "swr";
import Image from "next/image";
import { GlareCard } from "@/components/ui/glare-card"; // ajuste le chemin si besoin

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Gallery() {
  const { data: gallery, isLoading } = useSWR(
    "/api/gallery",
    fetcher,
    { refreshInterval: 4000 }
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
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Revivez nos meilleurs moments sur le terrain
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {gallery.map((img: any, idx: number) => (
            <GlareCard
              key={img.id || idx}
              className="mx-auto"
            >
              <div className="relative w-[320px] h-[192px] rounded-[48px] overflow-hidden shadow-lg cursor-pointer">
                <Image
                  src={img.url}
                  alt={img.legend || `Photo ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  placeholder="blur"
                  blurDataURL="/placeholder.svg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={idx < 3} // precharge les premières images
                />
                {img.legend && (
                  <div className="absolute bottom-2 left-2 bg-white/80 rounded px-3 py-1 text-orange-700 font-semibold text-sm shadow">
                    {img.legend}
                  </div>
                )}
              </div>
            </GlareCard>
          ))}
        </div>
      </div>
    </section>
  );
}
