"use client";
import React, { useEffect, useState } from "react";

export default function ProfilPage({ username }: { username: string }) {
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      const res = await fetch("/api/profil/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      setInfo(data);
      setLoading(false);
    }
    fetchStatus();
  }, [username]);

  if (loading) return <div className="py-10 text-center text-orange-700">Chargement…</div>;
  if (!info || info.error) return <div className="py-10 text-center text-red-600">Erreur : {info?.error}</div>;

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-xl p-8 mt-8">
      <h2 className="text-2xl font-bold mb-3 text-orange-700">Profil</h2>
      <div className="mb-2"><b>Pseudo :</b> {info.user.username}</div>
      <div className="mb-2"><b>Prénom :</b> {info.user.first_name}</div>
      <div className="mb-2"><b>Nom :</b> {info.user.last_name}</div>
      <div className="mb-2"><b>Rôle :</b> {info.user.role}</div>
      <div className="mb-3">
        <b>Cotisation :</b>{" "}
        {info.cotisationPayee ? (
          <span className="text-green-600 font-bold">
            Payée <span className="italic text-sm">({info.via})</span>
          </span>
        ) : (
          <span className="text-red-600 font-bold">Non payée</span>
        )}
      </div>
      {info.detail && info.via === "fédération" && (
        <div className="text-sm text-gray-500 mt-2">
          Joueur licencié à la fédé (infos club trouvées).
        </div>
      )}
    </div>
  );
}
