"use client";

import { useState, useEffect } from "react";

// ---------- MODALITES DISPLAY (dynamique depuis BDD) ----------
function ModalitesDisplay() {
  const [modalites, setModalites] = useState<{ id: number; texte: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchModalites() {
      try {
        const res = await fetch("/api/modalites");
        if (!res.ok) throw new Error("Erreur lors du chargement des modalités");
        const data = await res.json();
        setModalites(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchModalites();
  }, []);

  if (loading) return <div className="text-center py-8 text-orange-700">Chargement des modalités…</div>;
  if (error) return <div className="text-center py-8 text-red-700">Erreur : {error}</div>;

  return (
    <div>
      <h3 className="text-2xl font-bold mb-3 text-orange-700">Modalités d’inscription</h3>
      <ul className="list-disc list-inside text-left mb-3">
        {modalites.length === 0 ? (
          <li>Aucune modalité d’inscription n’est actuellement publiée.</li>
        ) : (
          modalites.map((m) => (
            <li key={m.id}>{m.texte}</li>
          ))
        )}
      </ul>
      <div className="mt-4 italic text-gray-500 text-sm">
        Si tu as des questions ou besoins spécifiques,&nbsp;
        <a
          href="/contact"
          className="underline text-orange-700 hover:text-red-700 font-semibold transition"
        >
          contacte-nous
        </a>
        &nbsp;: le club est là pour t’accompagner.
      </div>
    </div>
  );
}

// ---------- EQUIPEMENTS DISPLAY (dynamique depuis BDD) ----------
function EquipementsDisplay() {
  const [equipements, setEquipements] = useState<{ id: number; texte: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEquipements() {
      try {
        const res = await fetch("/api/equipements");
        if (!res.ok) throw new Error("Erreur lors du chargement des équipements");
        const data = await res.json();
        setEquipements(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEquipements();
  }, []);

  if (loading) return <div className="text-center py-8 text-orange-700">Chargement de l’équipement…</div>;
  if (error) return <div className="text-center py-8 text-red-700">Erreur : {error}</div>;

  return (
    <div>
      <h3 className="text-2xl font-bold mb-3 text-orange-700">Équipement nécessaire</h3>
      <ul className="list-disc list-inside text-left mb-3">
        {equipements.length === 0 ? (
          <li>Aucun équipement nécessaire n’est actuellement publié.</li>
        ) : (
          equipements.map(e => (
            <li key={e.id}>{e.texte}</li>
          ))
        )}
      </ul>
      <div className="mt-4 text-sm text-gray-500">
        Pour tout conseil équipement, demande à ton coach ou à l’équipe dirigeante.<br />
        On t’aidera à bien choisir, même pour ton premier gant !
      </div>
    </div>
  );
}

// ---------- FAQ DISPLAY (dynamique depuis BDD) ----------
function FaqDisplay() {
  const [faq, setFaq] = useState<{ id: number; q: string; a: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFaq() {
      try {
        const res = await fetch("/api/faq");
        if (!res.ok) throw new Error("Erreur lors du chargement de la FAQ");
        const data = await res.json();
        setFaq(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFaq();
  }, []);

  if (loading) return <div className="text-center py-8 text-orange-700">Chargement de la FAQ…</div>;
  if (error) return <div className="text-center py-8 text-red-700">Erreur : {error}</div>;

  return (
    <div>
      <h3 className="text-2xl font-bold mb-3 text-orange-700 text-center">
        FAQ – Questions fréquentes
      </h3>
      <dl className="space-y-5">
        {faq.length === 0 ? (
          <div className="text-center text-gray-500 italic">Aucune question publiée.</div>
        ) : (
          faq.map((item) => (
            <div
              key={item.id}
              className="rounded-xl bg-orange-50 p-4 shadow-sm"
            >
              <dt className="font-semibold text-red-700 mb-1">{item.q}</dt>
              <dd className="text-gray-700">{item.a}</dd>
            </div>
          ))
        )}
      </dl>
    </div>
  );
}

// ---------- HORAIRES ----------
const thisYear = new Date().getFullYear();

type HoraireFromDb = {
  id: number;
  label: string;
  minAge: number;
  maxAge: number | null;
  horaires: string[];
  jours: string[];
};

function adaptHoraireDbToCamelCase(dbItem: any): HoraireFromDb {
  return {
    id: dbItem.id,
    label: dbItem.label,
    minAge: dbItem.min_age,
    maxAge: dbItem.max_age,
    horaires: dbItem.horaires,
    jours: dbItem.jours,
  };
}

function getTrancheAge(cat: HoraireFromDb) {
  if (!cat) return "";
  if (cat.minAge === undefined || cat.minAge === null) {
    console.warn("minAge missing in data:", cat);
    return "Âge minimum non renseigné";
  }
  const minAge = Number(cat.minAge);
  const maxAge = cat.maxAge !== null && cat.maxAge !== undefined ? Number(cat.maxAge) : null;

  if (isNaN(minAge)) {
    console.warn("minAge is not a valid number:", cat.minAge);
    return "Âge minimum invalide";
  }

  if (maxAge === null) {
    const birthYear = thisYear - minAge;
    return `À partir de ${minAge} ans (né·e en ${birthYear} ou avant)`;
  }

  if (isNaN(maxAge)) {
    console.warn("maxAge is not a valid number:", cat.maxAge);
    return "Âge maximum invalide";
  }

  const birthYearMin = thisYear - maxAge;
  const birthYearMax = thisYear - minAge;

  return `Né·e entre ${birthYearMin} et ${birthYearMax} (${minAge} à ${maxAge} ans)`;
}

// ---------- INFOS COMPONENT PRINCIPAL ----------

export function InfosComponent() {
  const [tab, setTab] = useState(0);
  const [sousTab, setSousTab] = useState(0);
  const [horaires, setHoraires] = useState<HoraireFromDb[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHoraires() {
      try {
        const res = await fetch("/api/admin/horaires");
        if (!res.ok) throw new Error("Erreur chargement horaires");
        const dataRaw = await res.json();
        const data = dataRaw.map((item: any) => adaptHoraireDbToCamelCase(item));
        setHoraires(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchHoraires();
  }, []);

  if (loading) return <div className="text-center py-12 text-orange-700">Chargement des horaires…</div>;
  if (error) return <div className="text-center py-12 text-red-700">Erreur : {error}</div>;
  if (!horaires.length) return <div className="text-center py-12 text-gray-700">Aucune donnée horaire trouvée.</div>;

  return (
    <div className="
      max-w-3xl mx-auto my-12
      bg-white/90
      rounded-2xl
      shadow-2xl
      ring-2 ring-orange-200/80
      backdrop-blur
      px-6 md:px-12 py-8
      transition-all duration-300
    ">
      {/* Onglets principaux */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {["Horaires & jours", "Modalités d’inscription", "Équipement nécessaire", "FAQ"].map((label, idx) => (
          <button
            key={label}
            onClick={() => {
              setTab(idx);
              setSousTab(0);
            }}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
              tab === idx
                ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md scale-105"
                : "bg-orange-100 text-red-600 hover:bg-orange-200"
            }`}
            aria-selected={tab === idx}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Contenu onglets */}
      {tab === 0 && (
        <>
          {/* Onglets catégories */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {horaires.map((h, idx) => (
              <button
                key={h.id}
                onClick={() => setSousTab(idx)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                  sousTab === idx
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow scale-105"
                    : "bg-orange-50 text-orange-700 hover:bg-orange-200"
                }`}
                aria-selected={sousTab === idx}
              >
                {h.label}
              </button>
            ))}
          </div>

          {/* Contenu sélection */}
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-2xl font-bold mb-2 text-orange-700">
              {horaires[sousTab].label} – Entraînements du club de baseball à Honfleur
            </h3>
            <p className="mb-2">
              <span className="font-semibold text-gray-800">Tranche d’âge&nbsp;:</span>{" "}
              {getTrancheAge(horaires[sousTab])}
            </p>
            <div className="mb-2">
              <span className="font-semibold text-gray-800 inline-block mb-1">Horaires & jours :</span>
              <div className="text-gray-700 text-base">
                {horaires[sousTab].horaires.map((h, i) => {
                  const jour = horaires[sousTab].jours[i] ?? "—";
                  return (
                    <div key={i} className="flex justify-center gap-4">
                      <span>{h}</span>
                      <span>—</span>
                      <span>{jour}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modalités d’inscription */}
      {tab === 1 && <ModalitesDisplay />}
      {/* Équipement nécessaire */}
      {tab === 2 && <EquipementsDisplay />}
      {/* FAQ */}
      {tab === 3 && <FaqDisplay />}
    </div>
  );
}
