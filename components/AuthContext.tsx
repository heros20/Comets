"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type AuthStatus = "loading" | "guest" | "member" | "admin";

type AuthContextType = {
  status: AuthStatus;
  checkSession: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  status: "loading",
  checkSession: async () => {},
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");

  // Vérifie la session au mount
  async function checkSession() {
    setStatus("loading");
    try {
      const res = await fetch("/api/admin/check-session", { cache: "no-store" });
      if (!res.ok) throw new Error("Erreur session");
      const data = await res.json();
      if (data.isAdmin) setStatus("admin");
      else if (data.isMember) setStatus("member");
      else setStatus("guest");
    } catch {
      setStatus("guest");
    }
  }

  // Pour notifier après login/register
  async function login() {
    await checkSession();
  }
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setStatus("guest");
  }

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ status, checkSession, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
