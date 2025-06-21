"use client";
import { useState, useEffect, useRef } from "react";
import { logAdminAction } from "@/utils/adminLog";

type Member = {
  name: string;
  position: string;
  number: number | string;
  experience?: string;
  image?: string;
  bio?: string;
};

export default function TeamAdmin() {
  const [team, setTeam] = useState<Member[]>([]);
  const [form, setForm] = useState<Member>({
    name: "",
    position: "",
    number: "",
    experience: "",
    image: "",
    bio: "",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Charge les membres au montage
  useEffect(() => {
    fetch("/api/team")
      .then(res => res.json())
      .then(data => setTeam(data));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setSuccess(false);
  }

  // Upload image et preview via FileReader
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setForm(f => ({ ...f, image: url }));
      setSuccess(false);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.position || !form.number) {
      alert("Merci de remplir au minimum le nom, le poste et le numéro.");
      return;
    }

    setLoading(true);

    const payload = { ...form, number: Number(form.number) };

    if (editingIndex !== null) {
      // Edition
      await fetch("/api/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index: editingIndex, member: payload }),
      });
      logAdminAction(`Modifié ${form.name} (équipe)`);

      const updated = [...team];
      updated[editingIndex] = payload;
      setTeam(updated);
      setEditingIndex(null);
    } else {
      // Ajout
      await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      logAdminAction(`Ajouté ${form.name} à l’équipe`);
      setTeam([...team, payload]);
    }

    setForm({ name: "", position: "", number: "", experience: "", image: "", bio: "" });
    setSuccess(true);
    setLoading(false);
  }

  function handleEdit(i: number) {
    setEditingIndex(i);
    setForm(team[i]);
    setSuccess(false);
  }

  async function handleDelete(i: number) {
    if (!confirm(`Confirmer la suppression de ${team[i].name} ?`)) return;
    setLoading(true);
    await fetch("/api/team", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index: i }),
    });
    logAdminAction(`Supprimé ${team[i].name} de l’équipe`);
    setTeam(team.filter((_, idx) => idx !== i));
    setLoading(false);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-700 mb-4">Gérer l'équipe</h2>

      <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nom"
          required
          className="border px-3 py-2 rounded"
        />
        <input
          name="position"
          value={form.position}
          onChange={handleChange}
          placeholder="Poste"
          required
          className="border px-3 py-2 rounded"
        />
        <input
          name="number"
          type="number"
          value={form.number}
          onChange={handleChange}
          placeholder="Numéro"
          required
          className="border px-3 py-2 rounded"
        />
        <input
          name="experience"
          value={form.experience}
          onChange={handleChange}
          placeholder="Expérience (ex: 3 ans)"
          className="border px-3 py-2 rounded"
        />
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Bio / Description"
          className="border px-3 py-2 rounded col-span-full"
          rows={3}
        />
        <div className="col-span-full flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-orange-200 hover:bg-orange-300 text-orange-900 rounded px-4 py-2 font-semibold border border-orange-400"
          >
            📁 Choisir une image
          </button>
          {form.image && (
            <img src={form.image} alt="Preview" className="h-24 w-24 object-cover rounded-lg border border-orange-300" />
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 text-white px-6 py-3 rounded font-bold hover:bg-red-700 transition col-span-full"
        >
          {editingIndex !== null ? "Modifier" : "Ajouter"}
        </button>
      </form>

      {success && <div className="mb-4 text-green-600 font-bold">✔️ Action réalisée !</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {team.map((member, i) => (
          <div
            key={i}
            className="bg-orange-50 border border-orange-200 rounded-lg shadow p-4 flex items-center gap-4 relative"
          >
            <img
              src={member.image || "/placeholder.svg"}
              alt={member.name}
              className="w-20 h-24 object-cover rounded-xl border border-red-200"
            />
            <div className="flex-1">
              <div className="font-bold text-red-700 text-lg">
                {member.name} <span className="text-xs text-orange-600">#{member.number}</span>
              </div>
              <div className="text-orange-700">{member.position}</div>
              {member.experience && (
                <div className="text-gray-500 text-sm">{member.experience}</div>
              )}
            </div>
            <div className="flex flex-col gap-2 absolute top-2 right-2">
              <button
                onClick={() => handleEdit(i)}
                className="text-xs bg-orange-500 hover:bg-orange-700 text-white px-2 py-1 rounded"
              >
                Éditer
              </button>
              <button
                onClick={() => handleDelete(i)}
                className="text-xs bg-red-600 hover:bg-red-800 text-white px-2 py-1 rounded"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
