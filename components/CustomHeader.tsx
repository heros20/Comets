"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Footer from "@/components/Footer";

export default function CustomHeader({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Lien unique
  const menuLinks = (
    <Link
      href="/"
      className="block px-4 py-2 text-gray-700 hover:text-red-600 font-bold transition-colors"
      onClick={() => setOpen(false)}
    >
      Accueil
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur shadow-lg transition-shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <img
              src="/images/honfleurcomets.png"
              alt="Logo équipe de baseball Les Comets d'Honfleur, club de baseball à Honfleur en Normandie"
              className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-xl"
            />
            <div>
              <h1 className="text-2xl font-extrabold text-red-700 tracking-wider uppercase">
                Les Comets <span className="sr-only">, équipe de baseball à Honfleur</span>
              </h1>
              <p className="text-xs text-orange-700 font-semibold -mt-1">
                d'Honfleur – Baseball club en Normandie
              </p>
              <h2 className="sr-only">
                Club de baseball à Honfleur : les Comets, équipe engagée en championnat de Normandie
              </h2>
            </div>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden custom-md:flex gap-8 items-center">{menuLinks}</nav>

          {/* Burger pour mobile/tablette */}
          <div className="custom-md:hidden relative">
            <button
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {open ? (
                <X className="w-7 h-7 text-red-700" />
              ) : (
                <Menu className="w-7 h-7 text-red-700" />
              )}
            </button>
            {open && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-2 bg-white shadow-xl rounded-xl min-w-[140px] animate-slideDown z-40"
              >
                {menuLinks}
              </div>
            )}
          </div>
        </div>
        {/* Animation */}
        <style jsx>{`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-15px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slideDown {
            animation: slideDown 0.2s cubic-bezier(0.46, 0.03, 0.52, 0.96);
          }
        `}</style>
      </header>
      <main className="flex-1 w-full px-4 py-8 mx-auto" style={{ maxWidth: 800 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
