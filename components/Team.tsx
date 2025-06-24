"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Member = {
  name: string;
  position: string;
  number: number;
  experience?: string;
  image: string;
  bio?: string;
};

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const teamTitleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    fetch("/api/team")
      .then(res => res.json())
      .then(data => {
        setTeamMembers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const visibleMembers = showAll ? teamMembers : teamMembers.slice(0, 3);

  if (loading) return <div className="text-center py-20">Chargement de l’équipe…</div>;

  return (
    <>
      <section id="equipe" className="py-20 bg-orange-50">
        <div className="container mx-auto px-4">
          <h2
            className="text-4xl font-bold text-red-700 mb-12 text-center"
            ref={teamTitleRef}
          >
            Notre Équipe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visibleMembers.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">Aucun membre trouvé.</p>
            ) : (
              visibleMembers.map((member, i) => (
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
                  </div>
                </div>
              ))
            )}
          </div>
          {/* --- Bouton Voir plus / Voir moins --- */}
          {teamMembers.length > 3 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => {
                  if (showAll && teamTitleRef.current) {
                    setShowAll(false);
                    // Petit délai pour que la réduction de la grille soit effective
                    setTimeout(() => {
                      teamTitleRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }, 100);
                  } else {
                    setShowAll(true);
                  }
                }}
                className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white text-lg font-bold px-8 py-3 rounded-full shadow transition"
              >
                {showAll ? "Voir moins" : "Voir plus"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* --- Modal fiche perso animée --- */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
            onClick={() => setSelectedMember(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl max-w-lg w-full p-6 relative"
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }}
              exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
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
              <p className="text-gray-700 whitespace-pre-line">
                {selectedMember.bio || "Pas encore de description."}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
