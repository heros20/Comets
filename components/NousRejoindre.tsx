"use client";
import React, { useState, useEffect } from "react";

// ------------------- POPUP MODALE -------------------
function ResultPopup({ type, onClose }: { type: "success" | "error"; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        className={`bg-white rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center gap-3 animate-popup-appear min-w-[320px]`}
        style={{
          border: type === "success" ? "2px solid #22c55e" : "2px solid #ef4444",
        }}
      >
        <span className={`text-5xl`}>
          {type === "success" ? "✅" : "❌"}
        </span>
        <h2
          className={`text-2xl font-bold ${
            type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {type === "success"
            ? "Paiement validé, bienvenue chez les Comets !"
            : "Paiement annulé ou échoué"}
        </h2>
        <div className="text-gray-700 text-center mt-2 mb-2">
          {type === "success"
            ? "Ton inscription est bien prise en compte. Tu recevras un mail du club sous peu.\nPrends tes baskets et rejoins l’aventure ! 🚀"
            : "Le paiement n’a pas été validé. Tu peux réessayer ou nous contacter si besoin."}
        </div>
        <button
          className={`mt-2 px-5 py-2 rounded-lg font-bold shadow bg-orange-500 text-white hover:bg-orange-600 transition`}
          onClick={onClose}
        >
          OK
        </button>
      </div>
      <style jsx>{`
        @keyframes popup-appear {
          from { opacity: 0; transform: translateY(-24px) scale(0.96);}
          to   { opacity: 1; transform: translateY(0) scale(1);}
        }
        .animate-popup-appear { animation: popup-appear 0.4s cubic-bezier(.39,.575,.565,1.000);}
      `}</style>
    </div>
  );
}

// ----------------------------------------------------

export default function NousRejoindre() {
  const [paiementLoading, setPaiementLoading] = useState(false);
  const [popup, setPopup] = useState<null | "success" | "error">(null);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    age: "",
    email: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  // --- Vérifie les query params pour afficher le message ---
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "1") {
      setPopup("success");
      window.history.replaceState({}, "", window.location.pathname);
    }
    if (params.get("cancel") === "1") {
      setPopup("error");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // --- Auto-close après 6s
  useEffect(() => {
    if (!popup) return;
    const timer = setTimeout(() => setPopup(null), 6000);
    return () => clearTimeout(timer);
  }, [popup]);

  // ---- Gestion du formulaire moderne ----
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormError(null);
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function validateEmail(email: string) {
    return /^[\w\-.]+@[\w\-.]+\.[a-zA-Z]{2,}$/.test(email);
  }

  async function handlePaiement(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const { nom, prenom, age, email } = form;

    if (!nom || !prenom || !age || !email) {
      setFormError("Merci de remplir tous les champs !");
      return;
    }
    if (!validateEmail(email)) {
      setFormError("Merci de renseigner un email valide.");
      return;
    }
    if (isNaN(Number(age)) || Number(age) < 5 || Number(age) > 99) {
      setFormError("Merci de renseigner un âge valide.");
      return;
    }

    setPaiementLoading(true);

    const res = await fetch("/api/stripe/checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom,
        prenom,
        age,
        email,
        tarif: 120,
      }),
    });
    const data = await res.json();
    setPaiementLoading(false);

    if (data.url) {
      window.location.href = data.url;
    } else {
      setFormError("Erreur Stripe : " + data.error);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-2 sm:px-6 flex flex-col gap-8">
      {popup && <ResultPopup type={popup} onClose={() => setPopup(null)} />}

      {/* EN-TÊTE */}
      <section className="bg-gradient-to-r from-orange-100 to-orange-50 border border-orange-200 rounded-3xl shadow-xl py-8 px-6 text-center flex flex-col gap-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-orange-700 mb-1 drop-shadow">
          Rejoins l’aventure Comets&nbsp;!
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium">
          <b>Envie de frapper la balle, de découvrir le baseball ou de rejoindre une équipe qui a du cœur ?</b><br />
          Chez les <b>Comets de Honfleur</b>, on accueille tous les niveaux, tous les âges, <span className="text-orange-600">avec sourire et ambition</span>.<br />
          Viens essayer : <b>première séance gratuite</b> !
        </p>
      </section>
      
      {/* INFOS PRATIQUES + TARIFS */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/90 rounded-2xl shadow-lg p-6 border border-orange-200 flex flex-col gap-2">
          <h2 className="font-bold text-orange-700 text-xl mb-2">Infos pratiques :</h2>
          <ul className="list-disc list-inside text-gray-700 leading-7 font-medium">
            <li><b>Horaires entraînement</b> : jeudi 19h-21h</li>
            <li><b>Lieu</b> : Stade municipal, Honfleur</li>
            <li><b>Équipement</b> fourni pour débuter</li>
            <li>Ambiance familiale, <b>débutants bienvenus</b></li>
          </ul>
        </div>
        <div className="bg-white/90 rounded-2xl shadow-lg p-6 border border-orange-200 flex flex-col gap-2">
          <h2 className="font-bold text-orange-700 text-xl mb-2">Tarifs 2025 :</h2>
          <ul className="list-inside text-gray-700 leading-7 font-medium">
            <li>
              <b>Cotisation annuelle :</b> 
              <span className="text-orange-700 font-bold"> 120 € </span>
              <span className="text-gray-500 text-sm">(tarif unique adulte/enfant)</span>
            </li>
            <li>Paiement sécurisé en ligne via Stripe</li>
            <li>Assurance incluse</li>
            <li className="text-green-700 font-bold">Première séance gratuite !</li>
          </ul>
        </div>
      </section>
      
      {/* BOUTON INSCRIPTION + FORM */}
      <section className="bg-gradient-to-r from-orange-200/50 to-orange-50 rounded-2xl shadow-lg p-8 flex flex-col items-center gap-5 border border-orange-200">
        <form onSubmit={handlePaiement} className="flex flex-col gap-4 w-full max-w-md">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="nom"
              placeholder="Nom"
              className="flex-1 px-4 py-3 rounded-xl border border-orange-200 focus:border-orange-500"
              value={form.nom}
              onChange={handleChange}
              required
              autoComplete="family-name"
            />
            <input
              type="text"
              name="prenom"
              placeholder="Prénom"
              className="flex-1 px-4 py-3 rounded-xl border border-orange-200 focus:border-orange-500"
              value={form.prenom}
              onChange={handleChange}
              required
              autoComplete="given-name"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="number"
              name="age"
              placeholder="Âge"
              className="flex-1 px-4 py-3 rounded-xl border border-orange-200 focus:border-orange-500"
              value={form.age}
              onChange={handleChange}
              required
              min={5}
              max={99}
            />
            <input
              type="email"
              name="email"
              placeholder="Adresse email"
              className="flex-1 px-4 py-3 rounded-xl border border-orange-200 focus:border-orange-500"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>
          {formError && (
            <div className="text-red-600 font-semibold text-center text-sm">{formError}</div>
          )}
          <button
            type="submit"
            disabled={paiementLoading}
            className={`bg-gradient-to-r from-orange-600 to-orange-400 text-white font-bold py-3 px-8 rounded-2xl text-xl shadow-xl transition ${
              paiementLoading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {paiementLoading ? "Redirection vers Stripe…" : "Payer ma cotisation en ligne – 120 €"}
          </button>
        </form>
        <span className="text-gray-700 text-base text-center">
          Pour t’inscrire, viens à l’entraînement ou contacte-nous :<br />
          <a href="mailto:contact@les-comets-honfleur.fr" className="text-orange-700 hover:underline font-bold">contact@les-comets-honfleur.fr</a>
        </span>
      </section>
      
      {/* FAQ */}
      <section className="bg-orange-50/80 border border-orange-200 rounded-2xl p-6 shadow-lg">
        <h3 className="font-bold text-orange-700 mb-3 text-lg">Questions fréquentes</h3>
        <dl className="space-y-3 text-gray-800">
          <div>
            <dt className="font-semibold">Faut-il avoir déjà joué ?</dt>
            <dd>Pas du tout : on t’apprend tout, ambiance 100 % découverte et progression.</dd>
          </div>
          <div>
            <dt className="font-semibold">Quel âge minimum ?</dt>
            <dd>Dès 14 ans, sans limite d’âge pour débuter !</dd>
          </div>
          <div>
            <dt className="font-semibold">Comment venir essayer ?</dt>
            <dd>Viens simplement à un entraînement : préviens-nous, et on t’accueille comme il se doit.</dd>
          </div>
        </dl>
      </section>

      <div className="text-center text-gray-400 text-sm mt-5 pb-2">
        Les Comets Honfleur – Association loi 1901 – Baseball Normandie
      </div>
    </div>
  );
}
