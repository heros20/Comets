"use client";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16" aria-label="Pied de page club de baseball Honfleur">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Colonne 1 : club + SEO mots-clés */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/images/honfleurcomets.png"
              alt="Logo Les Comets d'Honfleur, club de baseball à Honfleur"
              width={120}
              height={80}
              className="w-28 h-auto object-contain"
              style={{ height: "auto" }}
              loading="lazy"
              priority={false}
            />
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            <strong>Les Comets d’Honfleur</strong> – équipe de <span className="text-orange-400 font-semibold">baseball à Honfleur</span> (Normandie).<br />
            Club sportif créé en 2005, notre équipe réunit les passionnés de baseball de la Côte Fleurie : matchs, entraînements, compétitions et événements à Honfleur.<br />
            Rejoignez l’aventure du <span className="text-orange-400 font-semibold">baseball normand</span> !
          </p>
          {/* Bloc d’adresse pour Google */}
          <address className="not-italic mt-4 text-gray-400 text-xs leading-5" aria-label="Adresse du club de baseball Honfleur">
            Terrain de Baseball à l'espace sportif René le Floch
            <br />
            Avenue de la brigade Piron
            <br />
            14600 Honfleur, France
            <br />
            <a
              href="https://www.google.com/maps/search/?api=1&query=Stade+Municipal+Honfleur+14600"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-300 hover:text-orange-500 underline transition"
            >
              Voir sur la carte
            </a>
          </address>
        </div>

        {/* Colonne 2 : Liens rapides */}
        <nav aria-label="Liens rapides club de baseball Honfleur">
          <h4 className="text-lg font-bold mb-4 text-orange-300">Liens rapides</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-gray-400 hover:text-orange-400 transition-colors">
                Accueil – Comets Honfleur
              </Link>
            </li>
            <li>
              <Link href="/equipe" className="text-gray-400 hover:text-orange-400 transition-colors">
                Équipe & Effectif
              </Link>
            </li>
            <li>
              <Link href="/galerie" className="text-gray-400 hover:text-orange-400 transition-colors">
                Galerie Photos Baseball
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-400 hover:text-orange-400 transition-colors">
                Contact & Recrutement
              </Link>
            </li>
            <li>
              <Link href="/mentions-legales" className="text-gray-400 hover:text-orange-400 transition-colors">
                Mentions légales
              </Link>
            </li>
          </ul>
        </nav>

        {/* Colonne 3 : Réseaux sociaux + contact */}
        <div>
          <h4 className="text-lg font-bold mb-4 text-orange-300">Contact & Réseaux</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <span className="font-bold text-orange-400">Président :</span> Axel Schuster
            </li>
            <li>
              <span className="font-bold text-orange-400">Téléphone :</span>{" "}
              <a href="tel:+33630323076" className="hover:text-orange-200 transition">06.30.32.30.76</a>
            </li>
            <li>
              <span className="font-bold text-orange-400">Email :</span>{" "}
              <a href="mailto:honfleurcomets@gmail.com" className="hover:text-orange-200 transition">honfleurcomets@gmail.com</a>
            </li>
          </ul>
          {/* Réseaux sociaux */}
          <div className="mt-6 flex gap-4 items-center" aria-label="Réseaux sociaux club de baseball Honfleur">
            {/* ... Les liens réseaux sociaux comme avant ... */}
          </div>
          <div className="mt-6">
            <a
              href="/rejoindre"
              className="inline-block px-5 py-2 bg-gradient-to-r from-red-600 to-orange-500 rounded-full text-white font-bold shadow hover:scale-105 hover:from-red-700 hover:to-orange-600 transition"
            >
              Rejoindre l’équipe
            </a>
          </div>
        </div>
      </div>
      {/* Crédit créateur */}
      <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col items-center gap-2">
        <p className="text-gray-400 text-xs text-center">
          © {new Date().getFullYear()} Baseball-Club – Les Comets Honfleur. Équipe officielle de Baseball en Normandie.<br />
        </p>
        <a
          href="https://heros20.github.io/Portfolio-2.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 mt-2 opacity-70 hover:opacity-100 transition group"
          aria-label="Crédit créateur du site"
        >
          <Image
            src="/images/logo_KB_arrondi_web.png"
            alt="Logo créateur KB"
            width={28}
            height={28}
            className="rounded-full shadow group-hover:scale-110 transition w-7 h-auto"
            style={{ height: "auto" }}
          />
          <span className="text-xs text-gray-400 group-hover:text-orange-300 font-semibold">
            Site réalisé par KB
          </span>
        </a>
      </div>
    </footer>
  );
}
