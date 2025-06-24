"use client";
import Link from "next/link";
import { Users, Calendar } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur shadow-lg transition-shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src="/images/honfleurcomets.png"
            alt="Logo Les Comets d'Honfleur"
            className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-xl"
          />
          <div>
            <h1 className="text-2xl font-extrabold text-red-700 tracking-wider uppercase">Les Comets</h1>
            <p className="text-xs text-orange-700 font-semibold -mt-1">d'Honfleur</p>
          </div>
        </div>
        <nav className="hidden md:flex gap-8">
          <Link href="#accueil" className="text-gray-700 hover:text-red-600 font-medium transition-colors">Accueil</Link>
          <Link href="#equipe" className="text-gray-700 hover:text-red-600 font-medium transition-colors">Équipe</Link>
          <Link href="#galerie" className="text-gray-700 hover:text-red-600 font-medium transition-colors">Galerie</Link>
          <Link href="#contact" className="text-gray-700 hover:text-red-600 font-medium transition-colors">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
