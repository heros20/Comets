"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/images/honfleurcomets.png"
              alt="Logo Les Comets d'Honfleur"
              className="w-10 h-10 object-contain"
            />
            <h3 className="text-xl font-bold">Les Comets d'Honfleur</h3>
          </div>
          <p className="text-gray-400">
            Club de baseball passionné depuis 2005. Rejoignez-nous pour vivre l'aventure du baseball normand !
          </p>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-4">Liens Rapides</h4>
          <ul className="space-y-2">
            <li>
              <Link href="#accueil" className="text-gray-400 hover:text-orange-400 transition-colors">
                Accueil
              </Link>
            </li>
            <li>
              <Link href="#equipe" className="text-gray-400 hover:text-orange-400 transition-colors">
                Équipe
              </Link>
            </li>
            <li>
              <Link href="#galerie" className="text-gray-400 hover:text-orange-400 transition-colors">
                Galerie
              </Link>
            </li>
            <li>
              <Link href="#contact" className="text-gray-400 hover:text-orange-400 transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-4">Horaires d'Entraînement</h4>
          <ul className="space-y-2 text-gray-400">
            <li>Mardi : 17h00 - 19h00</li>
            <li>Jeudi : 19h00 - 21h00</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 text-center">
        <p className="text-gray-400">© {new Date().getFullYear()} Les Comets d'Honfleur. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
