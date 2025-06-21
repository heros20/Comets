export async function logAdminAction(action: string, user: string = "Anonyme") {
  await fetch("/api/admin-logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, user }), // Ne PAS envoyer 'date'
  });
}
