"use client";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

interface HeaderProps {
  onLogoClick?: () => void;
}

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/informations", label: "Infos club" },
  { href: "/equipe", label: "Équipe" },
  { href: "/calendrier", label: "Calendrier" },
  { href: "/classement", label: "Classement" },
  { href: "/actus", label: "Actus" },
  { href: "/galerie", label: "Galerie" },
  { href: "/rejoindre", label: "Nous rejoindre" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ onLogoClick }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { status, logout } = useAuth();

  // Burger menu auto-ferme
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

  // Auth links selon contexte
  const authLinks =
    status === "admin" || status === "member" ? (
      <div className="flex items-center gap-2">
        <Link
          href="/profil"
          className="flex items-center gap-1 px-3 py-2 rounded-full bg-gray-100 hover:bg-orange-100 text-orange-700 font-bold shadow transition"
          title="Mon profil"
          onClick={() => setOpen(false)}
        >
          <User className="w-5 h-5 mr-1" />
          <span className="hidden md:inline">Profil</span>
        </Link>
        <button
          onClick={async () => {
            await logout();
            router.push("/");
          }}
          className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-bold transition shadow"
        >
          Déconnexion
        </button>
      </div>
    ) : status === "loading" ? (
      <div className="text-orange-600 animate-pulse px-2">Chargement…</div>
    ) : (
      <>
        <Link
          href="/login"
          className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-bold transition shadow w-full md:w-auto"
          onClick={() => setOpen(false)}
        >
          Connexion
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition shadow w-full md:w-auto"
          onClick={() => setOpen(false)}
        >
          Inscription
        </Link>
      </>
    );

  const navBar = (
    <nav className="flex flex-wrap justify-center gap-3 md:gap-8 w-full mt-1">
      {NAV.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`
              relative px-2 py-1 font-bold uppercase text-sm md:text-base tracking-wide
              transition
              ${isActive
                ? "text-red-700 after:absolute after:-bottom-0.5 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-orange-400 after:to-red-600 after:rounded-full"
                : "text-gray-700 hover:text-red-700 after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-[3px] after:bg-gradient-to-r after:from-orange-400 after:to-red-600 after:rounded-full hover:after:w-full"
              }
            `}
            style={{ overflow: "hidden" }}
            onClick={() => setOpen(false)}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );

  if (status === "loading") return null;

  return (
    <header className="sticky top-0 z-50 bg-transparent md:bg-white/75 backdrop-blur-xl shadow-sm">
      <div className="pointer-events-none absolute -z-10 left-1/2 top-0 -translate-x-1/2 w-[650px] h-[90px] bg-gradient-to-tr from-orange-100 via-yellow-100 to-white rounded-full blur-2xl" />
      <div className="container mx-auto px-4 pt-2 flex flex-col gap-2">
        {/* Logo + auth + burger */}
        <div className="flex flex-col gap-2 w-full pb-1 relative md:flex-row md:justify-between md:items-center">

          {/* Logo + titre */}
          <div className="flex items-center gap-4">
            <Image
              src="/images/honfleurcomets.png"
              alt="Logo équipe de baseball Les Comets d'Honfleur, club de baseball à Honfleur en Normandie"
              width={80}
              height={80}
              className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-xl cursor-pointer"
              style={{ userSelect: "none" }}
              priority={true}
              onClick={onLogoClick}
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-red-700 tracking-wider uppercase drop-shadow">
                Les Comets
              </h1>
              <p className="text-xs text-orange-700 font-semibold -mt-1 md:text-sm">
                d'Honfleur – Baseball club en Normandie
              </p>
              <span className="sr-only">
                Club de baseball à Honfleur : les Comets, équipe engagée en championnat de Normandie
              </span>
            </div>
          </div>

          {/* Boutons de connexion */}
          <div className="flex flex-col gap-2 items-center mt-2 md:mt-0 md:flex-row md:gap-2 md:items-center">
            {authLinks}
          </div>

          {/* Burger mobile */}
          <button
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400 ml-2 absolute top-2 right-4"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            style={{ alignSelf: 'flex-end' }}
          >
            {open ? (
              <X className="w-7 h-7 text-red-700" />
            ) : (
              <Menu className="w-7 h-7 text-red-700" />
            )}
          </button>
        </div>

        {/* Nav Desktop/Tablet */}
        <div className="hidden md:flex w-full justify-center">
          {navBar}
        </div>

        {/* Nav Mobile */}
        {open && (
          <div
            ref={menuRef}
            className="md:hidden mt-2 w-full"
          >
            <div className="flex flex-col gap-2 bg-white/90 rounded-xl shadow p-2">
              {NAV.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`
                    relative px-4 py-3 font-bold uppercase text-gray-700 hover:text-red-700 transition border-b border-orange-100 last:border-none
                    ${pathname === href ? "text-red-700 bg-orange-100" : ""}
                  `}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
