"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Colonne 1 : club + SEO mots-clés */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/images/honfleurcomets.png"
              alt="Logo Les Comets d'Honfleur, club de baseball à Honfleur"
              className="w-30 h-20 object-contain"
            />
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            <strong>Les Comets d’Honfleur</strong> – équipe de <span className="text-orange-400 font-semibold">baseball à Honfleur</span> (Normandie).<br />
            Club sportif créé en 2005, notre équipe réunit les passionnés de baseball de la Côte Fleurie : matchs, entraînements, compétitions et événements à Honfleur.<br />
            Rejoignez l’aventure du <span className="text-orange-400 font-semibold">baseball normand</span> !
          </p>
          {/* Bloc d’adresse pour Google */}
          <address className="not-italic mt-4 text-gray-400 text-xs leading-5">
            Stade Municipal d’Honfleur<br />
            14600 Honfleur, France<br />
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
        <div>
          <h4 className="text-lg font-bold mb-4 text-orange-300">Liens rapides</h4>
          <ul className="space-y-2">
            <li>
              <Link href="#accueil" className="text-gray-400 hover:text-orange-400 transition-colors">
                Accueil – Comets Honfleur
              </Link>
            </li>
            <li>
              <Link href="#equipe" className="text-gray-400 hover:text-orange-400 transition-colors">
                Équipe & Effectif
              </Link>
            </li>
            <li>
              <Link href="#galerie" className="text-gray-400 hover:text-orange-400 transition-colors">
                Galerie Photos Baseball
              </Link>
            </li>
            <li>
              <Link href="#contact" className="text-gray-400 hover:text-orange-400 transition-colors">
                Contact & Recrutement
              </Link>
            </li>
          </ul>
        </div>

        {/* Colonne 3 : horaires & contact */}
        <div>
          <h4 className="text-lg font-bold mb-4 text-orange-300">Entraînements baseball</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <strong>Mardi</strong> : 17h00 – 19h00<br />
              (pitchers/catchers, initiation, progression)
            </li>
            <li>
              <strong>Jeudi</strong> : 19h00 – 21h00<br />
              (entraînement équipe complet, adultes et jeunes)
            </li>
          </ul>
          <div className="mt-6">
            <a
              href="#contact"
              className="inline-block px-5 py-2 bg-gradient-to-r from-red-600 to-orange-500 rounded-full text-white font-bold shadow hover:scale-105 hover:from-red-700 hover:to-orange-600 transition"
            >
              Rejoindre l’équipe
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-10 pt-8 text-center">
        <p className="text-gray-400 text-xs">
          © {new Date().getFullYear()} Les Comets d'Honfleur – Équipe de Baseball Normandie. Tous droits réservés.<br />
          Site réalisé par les joueurs pour les passionnés de baseball !
        </p>
      </div>
    </footer>
  );
}
