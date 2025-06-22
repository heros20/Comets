"use client";
import { useEffect, useState } from "react";

export default function BoutonAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("admin_connected") === "1") {
      setIsAdmin(true);
    }
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
