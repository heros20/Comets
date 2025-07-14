"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erreur inconnue.");
      return;
    }
    router.push("/login");
  };

  return (
    <div className="max-w-sm mx-auto p-4 rounded-2xl shadow-xl mt-10">
      <h2 className="text-2xl font-bold mb-4">Inscription</h2>
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
        <button className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700">
          S&apos;inscrire
        </button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </div>
  );
};

export default RegisterPage;
