import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-b from-blue-200 via-white to-green-100">
      <div className="mb-8 flex flex-col items-center">
        <Image
          src="/images/honfleurcomets.png"
          alt="Logo Les Comets"
          width={128}
          height={128}
          className="w-24 h-24 md:w-32 md:h-32 drop-shadow-lg mb-2"
          draggable={false}
          priority
        />
        <h1 className="text-6xl md:text-7xl font-extrabold text-orange-500 tracking-widest drop-shadow-xl">
          404
        </h1>
        <h2 className="mt-2 text-2xl md:text-3xl font-bold text-red-700 text-center">
          Strike ! Page manquée…
        </h2>
        <p className="mt-3 text-lg md:text-xl text-gray-700 text-center font-semibold">
          Tu viens de louper la balle, cette page n’existe pas.<br />
          <span className="text-orange-700 font-bold">Mais pas de panique,</span> le terrain t’attend toujours !
        </p>
        {/* Petite balle de baseball statique pour le style */}
        <div className="mt-4">
          <svg width="60" height="60" viewBox="0 0 50 50" className="mx-auto">
            <circle cx="25" cy="25" r="20" stroke="#fdba74" strokeWidth="6" fill="#fff" />
            <path d="M25 5 A20 20 0 0 1 45 25" stroke="#e11d48" strokeWidth="6" fill="none" />
            <circle cx="25" cy="25" r="4" fill="#e11d48" />
          </svg>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center">
        <Link
          href="/"
          className="px-6 py-3 bg-red-600 text-white font-bold rounded-full shadow hover:bg-orange-500 transition text-lg"
        >
          Retourner à l’accueil du club
        </Link>
        <p className="mt-4 text-gray-500 text-sm italic">
          Les Comets d’Honfleur, jamais out du web !
        </p>
      </div>
    </main>
  );
}
