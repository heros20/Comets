"use client";
import { useEffect, useState } from "react";

type Log = {
  id: number;
  action: string;
  created_at: string;
  admin: string;
};

export default function LogsAdmin() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin-logs");
      if (!res.ok) {
        const data = await res.json();
        setError(data?.error || "Erreur réseau.");
        setLogs([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setLogs(data);
    } catch (e) {
      setError("Erreur de chargement des logs.");
      setLogs([]);
    }
    setLoading(false);
  }

  async function handleDeleteLog(id: number) {
    setDeleteError("");
    if (!confirm("Supprimer ce log ?")) return;
    try {
      const res = await fetch(`/api/admin-logs/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setDeleteError(data?.error || "Erreur à la suppression.");
      } else {
        setLogs((prev) => prev.filter((log) => log.id !== id));
      }
    } catch {
      setDeleteError("Erreur réseau lors de la suppression.");
    }
  }

  async function handleClearLogs() {
    if (!confirm("Supprimer TOUS les logs ?")) return;
    setClearing(true);
    setDeleteError("");
    try {
      const res = await fetch("/api/admin-logs", {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setDeleteError(data?.error || "Erreur lors du clear.");
      } else {
        setLogs([]);
      }
    } catch {
      setDeleteError("Erreur réseau lors du clear.");
    }
    setClearing(false);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl md:text-4xl font-black text-orange-700 tracking-wide drop-shadow">
          📋 Logs administrateur
        </h2>
        <button
          onClick={handleClearLogs}
          className={`bg-gradient-to-tr from-orange-500 to-red-600 text-white px-5 py-2 rounded-xl font-bold shadow-xl border-2 border-red-200 hover:scale-105 hover:from-orange-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50`}
          disabled={clearing || logs.length === 0}
        >
          {clearing ? "Suppression…" : "Tout supprimer"}
        </button>
      </div>

      {loading && (
        <div className="my-10 text-center text-orange-700 text-lg font-bold">
          Chargement…
        </div>
      )}
      {error && (
        <div className="text-red-600 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg shadow">
          {error}
        </div>
      )}
      {deleteError && (
        <div className="text-red-600 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg shadow">
          {deleteError}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl shadow-xl bg-white/95 backdrop-blur-md">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="bg-gradient-to-r from-orange-100 via-yellow-50 to-orange-100 text-orange-700 text-base">
              <th className="p-4 text-left font-bold uppercase tracking-widest">Action</th>
              <th className="p-4 text-left font-bold uppercase tracking-widest">Admin</th>
              <th className="p-4 text-left font-bold uppercase tracking-widest">Date</th>
              <th className="p-4 text-left font-bold uppercase tracking-widest"></th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-orange-50 hover:bg-orange-50 transition-all duration-100 group"
                >
                  <td className="p-4 font-semibold text-red-700">{log.action}</td>
                  <td className="p-4 font-semibold text-orange-700">{log.admin}</td>
                  <td className="p-4 text-gray-700">
                    {new Date(log.created_at).toLocaleString("fr-FR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="p-4">
                    <button
                      className="bg-red-600 hover:bg-red-800 text-white px-4 py-1 rounded-full font-bold shadow hover:scale-110 transition-all duration-100"
                      onClick={() => handleDeleteLog(log.id)}
                      title="Supprimer ce log"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))
            ) : !loading ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-orange-700 font-semibold">
                  Aucun log pour le moment.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
