"use client";
import BoutonAdmin from "@/components/BoutonAdmin";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* En-tête et pied de page placés globalement pour éviter leur rechargement à chaque changement de page */}
      <Header />
      {children}
      <Footer />
      <BoutonAdmin />
    </>
  );
}
