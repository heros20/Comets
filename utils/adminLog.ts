// /utils/adminLog.ts

/**
 * Enregistre une action admin dans le journal côté serveur.
 * Le nom d'admin est récupéré côté serveur via le cookie httpOnly.
 *
 * @param action Texte décrivant l'action (ex: "Ajouté une image à la galerie")
 */
export async function logAdminAction(action: string) {
  try {
    await fetch("/api/admin-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
      credentials: "include", // CRUCIAL : pour envoyer le cookie sécurisé
    });
  } catch (e) {
    // Optionnel : log ou alert du debug en dev
    console.error("Erreur lors du log admin :", e);
  }
}
