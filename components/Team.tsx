"use client";
import { useState, useEffect } from "react";

type Member = {
  name: string;
  position: string;
  number: number;
  experience?: string;
  image?: string;
  bio?: string;
};

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour fetcher la team
  async function fetchTeam() {
    try {
      const res = await fetch("/api/team", { cache: "no-store" });
      const data = await res.json();
      setTeamMembers(data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTeam(); // Premier fetch au montage

    const intervalId = setInterval(() => {
      fetchTeam();
    }, 5000); // rafraîchit toutes les 5s

    return () => clearInterval(intervalId); // nettoyage au démontage
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-red-700">Chargement de l’équipe…</div>;
  }

  return (
    <>
      <section id="equipe" className="py-20 bg-orange-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-red-700 mb-12 text-center">Notre Équipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">Aucun membre trouvé.</p>
            ) : (
              teamMembers.map((member, i) => (
                <div
                  key={i}
                  className="cursor-pointer rounded-xl overflow-hidden shadow-lg border border-orange-300 hover:shadow-2xl transition"
                  onClick={() => setSelectedMember(member)}
                >
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-72 object-cover rounded-t-xl"
                  />
                  <div className="p-4 bg-white">
                    <h3 className="text-xl font-semibold text-red-700">
                      {member.name} <span className="text-orange-600">#{member.number}</span>
                    </h3>
                    <p className="text-orange-700">{member.position}</p>
                    {member.experience && (
                      <p className="text-gray-600 text-sm mt-1">{member.experience}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Modal fiche perso */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full p-6 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 text-red-600 font-bold text-xl"
              aria-label="Fermer la fiche"
            >
              ×
            </button>
            <img
              src={selectedMember.image || "/placeholder.svg"}
              alt={selectedMember.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h2 className="text-3xl font-bold text-red-700 mb-2">{selectedMember.name}</h2>
            <p className="text-orange-600 font-semibold mb-4">
              {selectedMember.position} #{selectedMember.number}
            </p>
            {selectedMember.experience && (
              <p className="text-gray-700 mb-4 whitespace-pre-line">
                Expérience : {selectedMember.experience}
              </p>
            )}
            <p className="text-gray-700 whitespace-pre-line">
              {selectedMember.bio || "Pas encore de description."}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
