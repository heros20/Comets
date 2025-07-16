"use client";
import { useState } from "react";

const thisYear = new Date().getFullYear();

const horaires = [
  {
    label: "12U",
    minAge: 9,
    maxAge: 12,
    horaires: "Le mercredi de 14h à 15h30",
  },
  {
    label: "15U",
    minAge: 13,
    maxAge: 15,
    horaires: "Le mercredi de 15h30 à 17h",
  },
  {
    label: "Séniors",
    minAge: 16,
    horaires: "Le jeudi de 19h à 21h",
  },
];

const faq = [
  {
    q: "Faut-il avoir déjà joué au baseball pour s’inscrire ?",
    a: "Non, tous les niveaux sont acceptés, des débutants aux confirmés !",
  },
  {
    q: "À partir de quel âge peut-on jouer ?",
    a: "Dès 9 ans pour la catégorie 12U.",
  },
  {
    q: "Faut-il une visite médicale ?",
    a: "Oui, il faut fournir un certificat médical de non contre-indication à la pratique du baseball.",
  },
  {
    q: "Peut-on faire un essai avant de s’engager ?",
    a: "Bien sûr ! Les premières séances sont sans engagement.",
  },
  {
    q: "Les filles peuvent-elles jouer ?",
    a: "Évidemment ! Le club est ouvert à tous et à toutes.",
  },
];

function getTrancheAge(cat: typeof horaires[number]) {
  if (cat.label === "Séniors") {
    return `À partir de ${cat.minAge} ans (né·e en ${thisYear - cat.minAge} ou avant)`;
  }
  const minYear = thisYear - cat.maxAge;
  const maxYear = thisYear - cat.minAge;
  return `Né·e entre ${minYear} et ${maxYear} (${cat.minAge} à ${cat.maxAge} ans)`;
}

export function InfosComponent() {
  const [tab, setTab] = useState(0);
  const [sousTab, setSousTab] = useState(0);

  const mainTabs = [
    "Horaires & jours",
    "Modalités d’inscription",
    "Équipement nécessaire", // inversé avec FAQ
    "FAQ",
  ];

  return (
    <div className="bg-white w-full px-0 md:px-0 py-8 transition-all duration-300">
      {/* Onglets principaux */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {mainTabs.map((label, idx) => (
          <button
            key={label}
            onClick={() => { setTab(idx); setSousTab(0); }}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 
              ${tab === idx
                ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md scale-105"
                : "bg-orange-100 text-red-600 hover:bg-orange-200"
              }`
            }
            aria-selected={tab === idx}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ONGLET 1 : Horaires & jours */}
      {tab === 0 && (
        <div>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {horaires.map((h, idx) => (
              <button
                key={h.label}
                onClick={() => setSousTab(idx)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 
                  ${sousTab === idx
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow scale-105"
                    : "bg-orange-50 text-orange-700 hover:bg-orange-200"
                  }`
                }
                aria-selected={sousTab === idx}
              >
                {h.label}
              </button>
            ))}
          </div>
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-2xl font-bold mb-2 text-orange-700">
              {horaires[sousTab].label} – Entraînements du club de baseball à Honfleur
            </h3>
            <p className="mb-2">
              <span className="font-semibold text-gray-800">Tranche d’âge&nbsp;:</span>{" "}
              {getTrancheAge(horaires[sousTab])}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Horaires&nbsp;:</span>{" "}
              {horaires[sousTab].horaires}
            </p>
          </div>
        </div>
      )}

      {/* ONGLET 2 : Modalités d’inscription */}
      {tab === 1 && (
        <div className="max-w-xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-3 text-orange-700">Modalités d’inscription</h3>
          <ul className="list-disc list-inside text-left mb-3">
            <li>Remplir le formulaire d’adhésion fourni par le club.</li>
            <li>Certificat médical de non contre-indication au sport.</li>
            <li>Fournir une photo d’identité.</li>
            <li>Autorisation parentale pour les mineurs.</li>
            <li>Paiement de la cotisation annuelle (infos et tarifs communiqués lors de l’inscription).</li>
          </ul>
          <div className="mt-4 italic text-gray-500">
            Si tu as des questions ou besoins spécifiques, contacte-nous : le club est là pour t’accompagner.
          </div>
        </div>
      )}

      {/* ONGLET 3 : Équipement nécessaire */}
      {tab === 2 && (
        <div className="max-w-xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-3 text-orange-700">Équipement nécessaire</h3>
          <ul className="list-disc list-inside text-left mb-3">
            <li><span className="font-semibold text-gray-900">Fourni par le club&nbsp;:</span> bats, casques, balles, matériel d’entraînement, maillot officiel pour les matchs.</li>
            <li><span className="font-semibold text-gray-900">À prévoir&nbsp;:</span> gants de baseball (taille adaptée), chaussures de sport type crampons (pas de crampons métalliques), tenue d’entraînement, protège-dents (optionnel).</li>
          </ul>
          <div className="mt-4 text-sm text-gray-500">
            Pour tout conseil équipement, demande à ton coach ou à l’équipe dirigeante. On t’aidera à bien choisir, même pour ton premier gant !
          </div>
        </div>
      )}

      {/* ONGLET 4 : FAQ */}
      {tab === 3 && (
        <div className="max-w-xl mx-auto">
          <h3 className="text-2xl font-bold mb-3 text-orange-700 text-center">FAQ – Questions fréquentes</h3>
          <dl className="space-y-5">
            {faq.map((item, idx) => (
              <div key={idx} className="rounded-xl bg-orange-50 p-4 shadow-sm">
                <dt className="font-semibold text-red-700 mb-1">{item.q}</dt>
                <dd className="text-gray-700">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
