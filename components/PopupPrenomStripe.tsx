// components/PopupPrenomStripe.tsx
"use client";
import { useState } from "react";

type Props = {
  onClose: () => void;
};

export default function PopupPrenomStripe({ onClose }: Props) {
  const [prenom, setPrenom] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleValidate(e: React.FormEvent) {
    e.preventDefault();
    if (!prenom.trim()) return;
    setLoading(true);
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ montant: 12000, prenom }), // 120€ en centimes
    });
    const { url } = await res.json();
    setLoading(false);
    window.location.href = url;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <form
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full relative flex flex-col items-center border-2 border-orange-400 animate-fade-in"
        onSubmit={handleValidate}
      >
        <h3 className="text-xl font-bold mb-4 text-red-700">Ton prénom ?</h3>
        <input
          className="border px-4 py-2 rounded mb-4 w-full text-lg"
          placeholder="Prénom"
          value={prenom}
          onChange={e => setPrenom(e.target.value)}
          autoFocus
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-2 rounded-full font-bold text-lg w-full"
          disabled={loading || !prenom.trim()}
        >
          {loading ? "Redirection..." : "Valider et payer"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-xl text-gray-500 hover:text-orange-500 font-bold"
          disabled={loading}
        >
          ×
        </button>
      </form>
      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 0.3s cubic-bezier(0.39,0.575,0.565,1) both;
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(40px) scale(0.96);}
          100% { opacity: 1; transform: translateY(0) scale(1);}
        }
      `}</style>
    </div>
  );
}
