// components/Hero.tsx
"use client";

export default function Hero() {
  return (
    <section
      className="relative py-16 flex flex-col items-center justify-center overflow-hidden"
      id="accueil"
      aria-label="Section d'accueil, club de baseball Les Comets d'Honfleur"
    >
      {/* --- Overlay ultra-léger pour fond --- */}
      <div className="absolute inset-0 z-0 bg-black/15 pointer-events-none" />

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* --- TITRE H1 --- */}
        <h1
          className="
            text-4xl md:text-6xl font-extrabold
            text-white uppercase tracking-wider text-center
            text-shadow-extra-soft
            mb-3
            leading-tight
          "
          style={{ letterSpacing: "0.07em" }}
        >
          Baseball-Club
          <span className="text-white font-extrabold mx-2" aria-hidden="true">–</span>
          <span className="text-orange-400 font-extrabold text-shadow-orange-xsoft">Honfleur Comets</span>
        </h1>

        <h2 className="sr-only">
          Équipe de baseball à Honfleur, Les Comets : club sportif en Normandie, entraînements, matchs et passion du baseball.
        </h2>

        {/* --- Accroche --- */}
        <p
          className="
            text-lg md:text-2xl
            font-medium
            text-center
            text-white
            text-shadow-extra-soft
            max-w-2xl mx-auto
            mb-7 md:mb-10
          "
        >
          Rejoins le club de baseball à Honfleur !<br />
          Découvre le{" "}
          <strong className="text-orange-300 font-extrabold text-shadow-orange-xsoft">
            baseball à Honfleur
          </strong>{" "}
          avec Les Comets :<br />
          <span className="font-bold text-orange-200 text-shadow-orange-xsoft">
            club familial et motivé en Normandie.
          </span>
          <br />
          <span className="block mt-3 text-white font-semibold text-shadow-extra-soft">
            Passion, esprit d&apos;équipe, matchs et entraînements ouverts à tous.<br />
            <a
              href="/rejoindre"
              className="inline-block text-orange-300 underline underline-offset-4 font-extrabold text-xl hover:text-orange-400 hover:scale-105 transition-all"
            >
              Rejoins-nous sur le terrain !
            </a>
          </span>
        </p>
      </div>
    </section>
  );
}
