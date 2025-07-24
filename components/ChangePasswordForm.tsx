"use client";
import React, { useState } from "react";

type ChangePasswordFormProps = {
  userId: string;
};

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ userId }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirm) {
      setMessage("Les mots de passe ne correspondent pas !");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("Le mot de passe doit faire au moins 8 caractères.");
      return;
    }

    const res = await fetch("/api/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, newPassword }), // ← on envoie aussi userId
    });

    if (!res.ok) {
      setMessage("Erreur lors du changement de mot de passe.");
      return;
    }
    setMessage("Mot de passe changé avec succès !");
    setNewPassword("");
    setConfirm("");
  };

  return (
    <form onSubmit={handleChangePassword} className="space-y-4">
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        className="w-full p-2 rounded border"
        required
      />
      <input
        type="password"
        placeholder="Confirme le mot de passe"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
        className="w-full p-2 rounded border"
        required
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700">
        Changer le mot de passe
      </button>
      {message && <div className="text-center text-sm mt-2">{message}</div>}
    </form>
  );
};

export default ChangePasswordForm;
