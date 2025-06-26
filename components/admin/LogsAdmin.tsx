"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
}

export default function LogsAdmin() {
  const { data: logs, isLoading } = useSWR("/api/admin-logs", fetcher, { refreshInterval: 3000 });

  if (isLoading || !logs) return <div>Chargement…</div>;

  if (!Array.isArray(logs)) return <div>Erreur: données de logs invalides</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-700 mb-4">Journal des actions</h2>
      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {logs.length === 0 && <div className="text-gray-500">Aucune action pour l’instant…</div>}
        {logs.map((log: any) => (
          <div
            key={log.id ?? Math.random()}
            className="bg-orange-50 border border-orange-200 rounded px-4 py-2 text-sm"
          >
            <span className="text-red-700 font-bold">{log.admin || "Anonyme"}</span>
            <span className="mx-2 text-gray-500">–</span>
            {log.action}
            <span className="ml-2 text-gray-500">({formatDate(log.created_at)})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
