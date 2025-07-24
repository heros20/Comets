// Header et Footer gérés globalement dans le layout
import NousRejoindre from "@/components/NousRejoindre";

export const metadata = {
  title: "Rejoindre les Comets Honfleur | Inscription Baseball & Cotisation",
  description: "Rejoins l’équipe de baseball Les Comets à Honfleur : infos, tarifs, essai gratuit, ambiance familiale, tous niveaux ! Pré-inscription et paiement en ligne bientôt disponible.",
  keywords: [
    "rejoindre baseball", "inscription baseball Honfleur", "adhérer club baseball", "Comets Honfleur", "payer cotisation baseball", "nouveau joueur"
  ],
  robots: "index,follow",
};

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-orange-50/60">
      <main className="flex-grow">
        <NousRejoindre />
      </main>
    </div>
  );
}
