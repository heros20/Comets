"use client";
import { useEffect, useState } from "react";

export default function BoutonAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/admin/check-session");
        if (!res.ok) throw new Error("Erreur de session");
        const data = await res.json();
        setIsAdmin(data.isAdmin === true);
      } catch {
        setIsAdmin(false);
      }
    }
    checkSession();
  }, []);

  if (isAdmin === null) return null; // ou un loader léger

  if (!isAdmin) return null;

  return (
    <a
      href="/admin"
      className="fixed bottom-4 right-4 bg-red-600 text-white px-5 py-3 rounded-full shadow-xl font-bold text-lg hover:bg-red-700 transition z-50"
      style={{ letterSpacing: 1 }}
    >
      ⚾️ Accès Admin
    </a>
  );
}
