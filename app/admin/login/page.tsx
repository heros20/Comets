"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const USERS = [
  { user: "kevin", pass: "Lolilol1" },
  { user: "coach", pass: "Baseball2024" },
  // Ajoute d'autres comptes si besoin
];

export default function AdminLogin() {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: name.trim().toLowerCase(), password: pass }),
    });
    if (res.ok) {
      router.replace("/admin");
    } else {
      const out = await res.json();
      setError(out.error || "Erreur serveur.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-100">
      <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-xl p-8 max-w-xs w-full space-y-6">
        <h2 className="text-2xl font-bold text-red-700 mb-2 text-center">Connexion Admin</h2>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
          className="border px-4 py-2 rounded w-full"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={pass}
          onChange={e => setPass(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />
        <button type="submit" className="w-full bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700 transition">
          Se connecter
        </button>
        {error && <div className="text-red-700 text-sm">{error}</div>}
      </form>
    </div>
  );
}
