"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur inconnue.");
        return;
      }

      if (data.role === "admin") {
        router.push("/admin");
      } else if (data.role === "member") {
        router.push("/"); // ou "/member" si tu crées cette page
      } else {
        setError("Rôle inconnu, accès refusé.");
      }
    } catch (err) {
      setError("Erreur réseau, réessaie plus tard.");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Connexion</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Pseudo"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full p-2 rounded border"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 rounded border"
          required
        />
        <button className="w-full bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 font-bold">
          Se connecter
        </button>
        {error && <div className="text-red-600 text-center">{error}</div>}
      </form>
    </div>
  );
}
