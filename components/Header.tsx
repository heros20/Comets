"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [isLogged, setIsLogged] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/admin/check-session");
        if (!res.ok) throw new Error("Erreur session");
        const data = await res.json();
        setIsLogged(data.isAdmin === true || data.isMember === true);
      } catch {
        setIsLogged(false);
      }
    }
    checkSession();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsLogged(false);
    router.push("/");
  };

  const menuLinks = (
    <>
      <Link
        href="#accueil"
        className="block px-4 py-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
        onClick={() => setOpen(false)}
      >
        Accueil
      </Link>
      <Link
        href="#equipe"
        className="block px-4 py-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
        onClick={() => setOpen(false)}
      >
        Équipe
      </Link>
      <Link
        href="#galerie"
        className="block px-4 py-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
        onClick={() => setOpen(false)}
      >
        Galerie
      </Link>
      <Link
        href="#contact"
        className="block px-4 py-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
        onClick={() => setOpen(false)}
      >
        Contact
      </Link>
    </>
  );

  if (isLogged === null) {
    return null;
  }

  const authLinks = isLogged ? (
    <div className="flex gap-2 items-center">
      <button
        onClick={handleLogout}
        className="px-3 py-1 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-bold transition-colors"
      >
        Déconnexion
      </button>
    </div>
  ) : (
    <div className="flex gap-2">
      <Link
        href="/login"
        className="px-3 py-1 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-bold transition-colors"
        onClick={() => setOpen(false)}
      >
        Connexion
      </Link>
      <Link
        href="/register"
        className="px-3 py-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors"
        onClick={() => setOpen(false)}
      >
        Inscription
      </Link>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur shadow-lg transition-shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
        <nav className="hidden custom-md:flex gap-8 items-center">
          {menuLinks}
          {authLinks}
        </nav>

        {/* Burger pour mobile/tablette */}
        <button
          className="custom-md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? (
            <X className="w-7 h-7 text-red-700" />
          ) : (
            <Menu className="w-7 h-7 text-red-700" />
          )}
        </button>
      </div>

      {/* Overlay menu mobile/tablette */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm custom-md:hidden flex flex-col"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white shadow-xl rounded-b-2xl mx-4 mt-8 pb-4 animate-slideDown"
            style={{ minWidth: 220, maxWidth: 320, marginLeft: "auto", marginRight: "auto" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-end pr-2 pt-2">
              <button
                className="p-2 rounded-full hover:bg-gray-200"
                onClick={() => setOpen(false)}
                aria-label="Fermer le menu"
              >
                <X className="w-6 h-6 text-red-700" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">{menuLinks}</nav>
            <div className="mt-4 flex flex-col gap-2 px-4">
              {isLogged ? (
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-bold transition-colors"
                >
                  Déconnexion
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-3 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-bold transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Animation du menu mobile */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.25s cubic-bezier(0.46, 0.03, 0.52, 0.96);
        }
      `}</style>
    </header>
  );
}
