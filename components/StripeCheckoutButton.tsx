"use client";
import { useState } from "react";

type Props = {
  prenom: string; // On le reçoit du parent, obligatoire ici !
  onDone?: () => void; // Pour reset le parent (optionnel, UX clean)
};

export default function StripeCheckoutButton({ prenom, onDone }: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!prenom || prenom.trim().length < 2) return; // Double sécurité
    setLoading(true);
    // Appelle l’API qui crée la session Stripe Checkout (avec prénom !)
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ montant: 12000, prenom }), // 120€ + prénom
    });
    const { url } = await res.json();
    setLoading(false);
    if (onDone) onDone();
    // Redirige vers Stripe Checkout
    window.location.href = url;
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center justify-center px-8 py-3 rounded-full border-2 border-white text-white hover:bg-white hover:text-red-600 text-lg font-bold shadow-md transition-transform hover:scale-105 cursor-pointer select-none"
    >
      {loading ? "Redirection..." : "Payer la cotisation"}
    </button>
  );
}
