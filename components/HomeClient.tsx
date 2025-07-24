"use client";
import Hero from "@/components/Hero";
import Link from "next/link";
import useSWR from "swr";
import Image from "next/image";

// ---- Style commun : boîtes blanches, rien autour ----
const sectionStyle = "max-w-6xl mx-auto my-12 bg-white border border-gray-200 rounded-3xl shadow-xl p-10 text-center";
const headingStyle = "text-2xl md:text-3xl font-extrabold text-red-700 mb-4 tracking-tight";
const paraStyle = "text-gray-700 text-lg md:text-xl mb-4";
const pillBtn = "inline-block mt-6 px-8 py-3 rounded-full bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400 text-white font-bold shadow hover:from-orange-500 hover:to-red-600 transition";
const linkBtn = "inline-block mt-4 text-orange-600 font-bold underline hover:text-red-600 transition";

// ---- Composants d'accueil ----

function ActuTeaser() {
  return (
    <section className={sectionStyle}>
      <h2 className={headingStyle}>Dernière actualité</h2>
      <p className={paraStyle}>
        La saison reprend bientôt ! Préparez vos gants, on attaque la nouvelle saison des Comets sur les chapeaux de roues.
      </p>
      <Link href="/actus" className={linkBtn}>Voir toutes les actus</Link>
    </section>
  );
}

function CalendrierNext() {
  return (
    <section className={sectionStyle}>
      <h2 className={headingStyle}>Voir les Matchs</h2>
      <p className={paraStyle}>Les Comets vs. La Normandie</p>
      <Link href="/calendrier" className={pillBtn}>Voir le calendrier</Link>
    </section>
  );
}

function ClassementFlash() {
  return (
    <section className={sectionStyle}>
      <h2 className={headingStyle}>Classement rapide</h2>
      <p className={paraStyle}>
        Les Comets : <span className="font-extrabold text-red-700"></span> en championnat Normandie
      </p>
      <Link
        href="/classement"
        className={pillBtn + " bg-yellow-400 text-red-700 hover:bg-orange-400 hover:text-white transition"}
        style={{ background: "linear-gradient(90deg, #fbbf24, #fdba74)" }}
      >
        Voir le classement
      </Link>
    </section>
  );
}

function EquipeApercu() {
  return (
    <section className={sectionStyle}>
      <h2 className={headingStyle}>Ils font briller les Comets</h2>
      <div className="flex gap-8 items-center justify-center my-6">
        <Image src="/images/player1.jpg" alt="Joueur 1" width={80} height={80} className="w-20 h-20 rounded-full border-2 border-orange-200 object-cover shadow" loading="lazy" />
        <Image src="/images/player2.jpg" alt="Joueur 2" width={80} height={80} className="w-20 h-20 rounded-full border-2 border-orange-200 object-cover shadow" loading="lazy" />
        <Image src="/images/player3.jpg" alt="Joueur 3" width={80} height={80} className="w-20 h-20 rounded-full border-2 border-orange-200 object-cover shadow" loading="lazy" />
      </div>
      <Link href="/equipe" className={linkBtn}>Voir toute l’équipe</Link>
    </section>
  );
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

function PhotoHighlight() {
  const { data: gallery, isLoading } = useSWR("/api/gallery", fetcher);

  const lastPhotos =
    !isLoading && gallery && gallery.length >= 2
      ? gallery.slice(-2)
      : gallery && gallery.length > 0
        ? [gallery[gallery.length - 1]]
        : [];

  return (
    <section className={sectionStyle + " overflow-hidden"}>
      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        {isLoading ? (
          <div className="w-full h-56 flex items-center justify-center bg-gray-100 rounded-2xl">
            <span className="text-gray-400">Chargement des photos…</span>
          </div>
        ) : lastPhotos.length > 0 ? (
          lastPhotos.map((img: any, i: number) => (
            <Image
              key={img.id || i}
              src={img.url}
              alt={img.legend || `Photo Comets Honfleur baseball ${i + 1}`}
              width={520}
              height={240}
              className="w-full md:w-1/2 h-56 object-cover rounded-2xl"
              style={{ objectFit: "cover" }}
              loading={i === 0 ? "eager" : "lazy"}
              sizes="(max-width: 768px) 100vw, 520px"
              unoptimized={typeof img.url === "string" && img.url.startsWith("data:")}
            />
          ))
        ) : (
          // Si aucune photo, on n'affiche RIEN (pas d'image par défaut)
          null
        )}
      </div>
      <div className="p-4 bg-white rounded-xl mt-6 text-center">
        <p className={paraStyle}>Revivez les plus belles actions du club en images !</p>
        <Link href="/galerie" className={linkBtn}>Voir la galerie photo</Link>
      </div>
    </section>
  );
}

function RejoindreBanner() {
  return (
    <section className={sectionStyle + " border-dashed border-2 border-orange-200"}>
      <h2 className={headingStyle + " text-orange-500"}>Envie de frapper avec nous ?</h2>
      <p className={paraStyle + " mb-8 max-w-2xl mx-auto"}>
        Rejoins les Comets, le club de baseball ouvert à tous à Honfleur.<br />
        Débutants bienvenus, esprit d’équipe garanti !
      </p>
      <Link href="/rejoindre" className={pillBtn}>Je veux rejoindre l’équipe</Link>
    </section>
  );
}

// ---- Accueil principal ----

export default function HomeClient() {
  return (
    <div className="min-h-screen">
      <main>
        <Hero />
        <ActuTeaser />
        <CalendrierNext />
        <ClassementFlash />
        <PhotoHighlight />
        <RejoindreBanner />
      </main>
    </div>
  );
}
