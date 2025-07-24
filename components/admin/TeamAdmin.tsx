"use client";
import { useEffect, useState } from "react";

// Type pour les membres (comptes du site)
type Member = {
  id: string;
  email: string;
  role: string;
  created_at: string;
  age?: number;
  categorie?: string;
  first_name?: string;
  last_name?: string;
};

export default function MembersAdmin() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState<string>("");
  const [categorie, setCategorie] = useState<string>("");
  const [addMsg, setAddMsg] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => { fetchMembers(); }, []);

  async function fetchMembers() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/members");
      if (!res.ok) {
        const data = await res.json();
        setError(data?.error || "Erreur réseau.");
        setMembers([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Format de données inattendu");
      setMembers(data);
    } catch (e: any) {
      setError("Erreur de chargement.");
      setMembers([]);
    }
    setLoading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAddMsg(""); setError("");
    if (!email || !password || !firstName || !lastName || !age || !categorie) {
      setError("Tous les champs sont requis."); return;
    }
    const ageValue = parseInt(age, 10);
    if (isNaN(ageValue) || ageValue <= 0) {
      setError("Âge invalide."); return;
    }
    let data;
    try {
      const res = await fetch("/api/admin/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email, password,
          first_name: firstName,
          last_name: lastName,
          age: ageValue,
          categorie,
        }),
      });
      data = await res.json();
      if (!res.ok) { setError(data?.error || "Erreur inconnue."); return; }
      setAddMsg("Membre ajouté !");
      setEmail(""); setPassword(""); setFirstName(""); setLastName(""); setAge(""); setCategorie("");
      fetchMembers();
    } catch (e: any) {
      setError(data?.error || "Erreur lors de l'ajout.");
    }
  }

  async function handleDelete(id: string, role: string) {
    setDeleteError("");
    if (role === "admin") {
      setDeleteError("Impossible de supprimer un administrateur."); return;
    }
    if (!confirm("Supprimer ce membre ?")) return;
    let data;
    try {
      const res = await fetch("/api/admin/members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      data = await res.json();
      if (!res.ok) {
        setDeleteError(data?.error || "Erreur à la suppression.");
      } else {
        fetchMembers();
      }
    } catch (e: any) {
      setDeleteError(data?.error || "Erreur lors de la suppression.");
    }
  }

  return (
    <div className="w-full flex flex-col items-center px-2">
      <h2 className="text-2xl md:text-3xl font-black mb-4 text-orange-700 drop-shadow">
        Gestion des membres du site
      </h2>
      {loading && <div>Chargement…</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}

      {/* TABLEAU GRAND FORMAT, sans scroll horizontal sur desktop */}
      <div className="w-full max-w-7xl bg-white/90 rounded-2xl shadow-xl overflow-x-auto mb-6">
        <table className="w-full text-base">
          <thead>
            <tr className="bg-orange-100 text-orange-700">
              <th className="p-3 text-left font-bold">Email</th>
              <th className="p-3 text-left font-bold">Prénom</th>
              <th className="p-3 text-left font-bold">Nom</th>
              <th className="p-3 text-left font-bold">Rôle</th>
              <th className="p-3 text-left font-bold">Âge</th>
              <th className="p-3 text-left font-bold">Catégorie</th>
              <th className="p-3 text-left font-bold">Créé le</th>
              <th className="p-3 text-left font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-t last:border-b-0 hover:bg-orange-50">
                <td className="p-3">{m.email}</td>
                <td className="p-3">{m.first_name || "-"}</td>
                <td className="p-3">{m.last_name || "-"}</td>
                <td className="p-3">{m.role}</td>
                <td className="p-3">{m.age ?? "-"}</td>
                <td className="p-3">{m.categorie ?? "-"}</td>
                <td className="p-3">{new Date(m.created_at).toLocaleDateString()}</td>
                <td className="p-3">
                  <button
                    className={`px-3 py-1 rounded font-bold 
                      ${m.role === "admin"
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    onClick={() => handleDelete(m.id, m.role)}
                    disabled={m.role === "admin"}
                    title={
                      m.role === "admin"
                        ? "Impossible de supprimer un administrateur"
                        : "Supprimer ce membre"
                    }
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {members.length === 0 && !loading && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-orange-700">
                  Aucun membre (hors admins).
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteError && (
        <div className="text-red-600 mb-4">{deleteError}</div>
      )}

      {/* Ajout d’un membre */}
      <form
        onSubmit={handleAdd}
        className="flex gap-3 flex-wrap items-center mb-2 max-w-4xl w-full"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="p-2 rounded border border-orange-200 flex-1 min-w-[160px]"
          required
        />
        <input
          type="text"
          placeholder="Prénom"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          className="p-2 rounded border border-orange-200 flex-1 min-w-[100px]"
          required
        />
        <input
          type="text"
          placeholder="Nom"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          className="p-2 rounded border border-orange-200 flex-1 min-w-[100px]"
          required
        />
        <input
          type="number"
          placeholder="Âge"
          value={age}
          onChange={e => setAge(e.target.value)}
          className="p-2 rounded border border-orange-200 flex-1 min-w-[70px]"
          required
          min={1}
        />
        <select
          value={categorie}
          onChange={e => setCategorie(e.target.value)}
          className="p-2 rounded border border-orange-200 flex-1 min-w-[100px]"
          required
        >
          <option value="">Catégorie</option>
          <option value="12U">12U</option>
          <option value="15U">15U</option>
          <option value="Senior">Senior</option>
        </select>
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-2 rounded border border-orange-200 flex-1 min-w-[130px]"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-orange-500 text-white font-bold hover:bg-orange-600"
        >
          Ajouter
        </button>
      </form>
      {addMsg && <div className="text-green-700">{addMsg}</div>}
    </div>
  );
}
