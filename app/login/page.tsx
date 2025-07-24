"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

function CometsLoader() {
  return (
    <span className="inline-block">
      <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="#fdba74"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="none"
          stroke="#e11d48"
          strokeWidth="4"
          strokeLinecap="round"
          d="M4 12a8 8 0 018-8"
        />
      </svg>
    </span>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur inconnue.");
        setLoading(false);
        return;
      }

      await login(); // <-- clé ! Permet d'update tout de suite

      if (data.role === "admin") {
        router.push("/admin");
      } else if (data.role === "member") {
        router.push("/");
      } else {
        setError("Rôle inconnu, accès refusé.");
        setLoading(false);
      }
    } catch (err) {
      setError("Erreur réseau, réessaie plus tard.");
      setLoading(false);
    }
  };

  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-[70vh] py-12">
        <div className="w-full max-w-sm mx-auto p-8 rounded-2xl shadow-lg bg-white/95 backdrop-blur">
          <h2 className="text-2xl font-bold mb-4 text-center text-red-700">
            Connexion
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 rounded border border-orange-200 focus:border-red-500"
              required
              disabled={loading}
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2 rounded border border-orange-200 focus:border-red-500"
              required
              disabled={loading}
              autoComplete="current-password"
            />
            <button
              className={`w-full bg-red-600 text-white py-2 rounded-xl font-bold transition flex items-center justify-center
                ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-red-700"}
              `}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <CometsLoader />
                  Connexion…
                </span>
              ) : (
                "Se connecter"
              )}
            </button>
            {error && (
              <div className="text-red-600 text-center font-semibold">{error}</div>
            )}
          </form>
        </div>
      </main>
    </>
  );
}
