"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const ageValue = parseInt(age, 10);
    if (isNaN(ageValue) || ageValue <= 0) {
      setError("Âge invalide.");
      setLoading(false);
      return;
    }
    // 1. Inscription
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: cleanEmail,
        first_name,
        last_name,
        password,
        age: ageValue,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erreur inconnue.");
      setLoading(false);
      return;
    }
    // 2. Connexion automatique
    const loginRes = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail, password }),
    });
    if (!loginRes.ok) {
      setError(
        "Inscription réussie, mais connexion impossible. Essayez de vous connecter manuellement."
      );
      setLoading(false);
      return;
    }
    await login(); // <-- Clef pour header !

    // 3. Redirection
    sessionStorage.setItem("welcomeNewComet", "1");
    router.push("/");
  };

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-[70vh] py-12">
        <div className="w-full max-w-sm mx-auto p-8 rounded-2xl shadow-lg bg-white/95 backdrop-blur">
          <h2 className="text-2xl font-bold mb-4 text-center text-red-700">
            Inscription
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Prénom"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 rounded border border-orange-200 focus:border-red-500"
              required
              autoComplete="given-name"
            />
            <input
              type="text"
              placeholder="Nom"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 rounded border border-orange-200 focus:border-red-500"
              required
              autoComplete="family-name"
            />
            <input
              type="number"
              placeholder="Âge"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full p-2 rounded border border-orange-200 focus:border-red-500"
              required
              min={1}
            />
            <input
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded border border-orange-200 focus:border-red-500"
              required
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded border border-orange-200 focus:border-red-500"
              required
              autoComplete="new-password"
            />
            <button
              className="w-full bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 font-bold transition"
              type="submit"
              disabled={loading}
            >
              {loading ? "Inscription en cours..." : "S'inscrire"}
            </button>
            {error && (
              <div className="text-red-600 text-center font-semibold">
                {error}
              </div>
            )}
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default RegisterPage;
