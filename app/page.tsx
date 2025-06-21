import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Team from "@/components/Team";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BaseballBalle from "@/components/BaseballBalle";
import BoutonAdmin from "@/components/BoutonAdmin";

export default function Home() {
  return (
    <>
      <Header />
      <BoutonAdmin />
      <BaseballBalle />
      <Hero />
      <Stats />
      <Team />
      <Gallery />
      <Contact />
      <Footer />
    </>
  );
}
