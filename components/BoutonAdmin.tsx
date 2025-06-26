"use client";
import { useEffect, useState } from "react";

export default function BoutonAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/admin/check-session")
      .then(res => res.json())
      .then(data => {
        setIsAdmin(data.isAdmin === true);
      })
      .catch(() => setIsAdmin(false));
  }, []);

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
