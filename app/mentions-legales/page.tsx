// app/mentions-legales/page.tsx

export const metadata = {
  title: "Mentions Légales | Baseball Club - Les Comets Honfleur",
  description:
    "Retrouvez toutes les mentions légales du club Les Comets Honfleur : éditeur, hébergeur, gestion des données, droits et devoirs.",
  alternates: { canonical: "https://les-comets-honfleur.vercel.app/mentions-legales" },
};

export default function MentionsLegales() {
  return (
    <>
      <main className="max-w-3xl mx-auto py-16 px-4">

        {/* Titre stylé dans une box, centré */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/90 rounded-2xl shadow-xl px-8 py-6 inline-block">
            <h1 className="text-4xl md:text-5xl font-extrabold text-red-700 drop-shadow-xl text-center">
              Mentions légales
            </h1>
          </div>
        </div>

        {/* Editeur */}
        <section className="mb-8 rounded-2xl bg-white/95 shadow p-6">
          <h2 className="text-2xl font-bold mb-2 text-orange-700">
            Éditeur du site
          </h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>Nom de l’association :</strong><br />
            Baseball Club - Les Comets Honfleur
            <br />
            <strong>Président :</strong> Axel Schuster
            <br />
            <strong>Téléphone :</strong> <a href="tel:+33630323076" className="underline text-orange-700">06.30.32.30.76</a>
            <br />
            <strong>Email :</strong> <a href="mailto:honfleurcomets@gmail.com" className="underline text-orange-700">honfleurcomets@gmail.com</a>
            <br />
            <strong>Adresse du siège / terrain :</strong><br />
            Terrain de Baseball à l'espace sportif René le Floch,<br />
            Avenue de la brigade Piron,<br />
            14600 Honfleur, France
          </p>
        </section>

        {/* Création & gestion du site */}
        <section className="mb-8 rounded-2xl bg-white/95 shadow p-6">
          <h2 className="text-2xl font-bold mb-2 text-orange-700">Créateur et gestionnaire du site</h2>
          <p className="text-gray-700 leading-relaxed">
            Ce site est conçu, développé et administré par :<br />
            <strong>Kevin Bigoni</strong><br />
            Boulleville, 27210, France<br />
            Email : <a href="mailto:kevin.bigoni@outlook.fr" className="underline text-orange-700">kevin.bigoni@outlook.fr</a><br />
            Portfolio :{" "}
            <a href="https://heros20.github.io/Portfolio-2.0/" target="_blank" rel="noopener noreferrer" className="underline text-orange-700">
              https://heros20.github.io/Portfolio-2.0/
            </a>
            <br />
            Kevin Bigoni assure la maintenance, l’évolution technique et la gestion des contenus du site.<br />
            Il est également responsable du traitement des données à caractère personnel collectées via le site.
          </p>
        </section>

        {/* Hébergement */}
        <section className="mb-8 rounded-2xl bg-white/95 shadow p-6">
          <h2 className="text-2xl font-bold mb-2 text-orange-700">Hébergement</h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>Hébergeur :</strong> Vercel Inc.<br />
            440 N Barranca Ave #4133,<br />
            Covina, CA 91723, États-Unis<br />
            <a href="https://vercel.com" className="text-red-700 underline">https://vercel.com</a>
          </p>
        </section>

        {/* Propriété */}
        <section className="mb-8 rounded-2xl bg-white/95 shadow p-6">
          <h2 className="text-2xl font-bold mb-2 text-orange-700">Propriété intellectuelle</h2>
          <p className="text-gray-700 leading-relaxed">
            Les contenus du site (textes, images, logo, photos, vidéos) sont la propriété exclusive du club Baseball Club - Les Comets Honfleur ou de leurs auteurs respectifs. Toute reproduction, utilisation ou diffusion sans autorisation est strictement interdite.
          </p>
        </section>

        {/* Données personnelles */}
        <section className="mb-8 rounded-2xl bg-white/95 shadow p-6">
          <h2 className="text-2xl font-bold mb-2 text-orange-700">Gestion des données personnelles</h2>
          <p className="text-gray-700 leading-relaxed">
            Dans le cadre du formulaire de contact, d’inscription ou d’adhésion, le site collecte les données suivantes : <br />
            <strong>Nom, Prénom, Email, Téléphone</strong>.<br /><br />
            Ces informations sont strictement nécessaires à la gestion des demandes, inscriptions, adhésions ou au suivi de contact. Elles ne sont ni cédées ni revendues à des tiers.
            <br /><br />
            Responsable du traitement : <strong>Kevin Bigoni</strong> (<a href="mailto:kevin.bigoni@outlook.fr" className="underline text-orange-700">kevin.bigoni@outlook.fr</a>)
            <br /><br />
            Conformément au RGPD, vous disposez d’un droit d’accès, de modification et de suppression de vos données, sur simple demande à cette adresse.
          </p>
        </section>

        {/* Cookies */}
        <section className="mb-8 rounded-2xl bg-white/95 shadow p-6">
          <h2 className="text-2xl font-bold mb-2 text-orange-700">Cookies & sessions</h2>
          <p className="text-gray-700 leading-relaxed">
            Le site n’utilise que des cookies strictement nécessaires pour la gestion de session et la sécurité du site. Aucun cookie de tracking ou de publicité n’est déposé.
          </p>
        </section>

        {/* Contact */}
        <section className="mb-4 rounded-2xl bg-white/95 shadow p-6">
          <h2 className="text-2xl font-bold mb-2 text-orange-700">Contact</h2>
          <p className="text-gray-700 leading-relaxed">
            Pour toute question concernant les mentions légales ou la gestion de vos données personnelles : <br />
            <a href="mailto:kevin.bigoni@outlook.fr" className="underline text-orange-700">kevin.bigoni@outlook.fr</a>
          </p>
        </section>
      </main>
    </>
  );
}
