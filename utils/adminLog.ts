// src/utils/adminLog.ts
export async function logAdminAction(action: string, user = "admin") {
  try {
    await fetch("/api/admin-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user,
        action,
        date: new Date().toLocaleString("fr-FR"),
      }),
    });
  } catch (err) {
    // Optionnel : tu peux afficher une erreur si tu veux
    // console.error("Erreur lors du log admin :", err);
  }
}
