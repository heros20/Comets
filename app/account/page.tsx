import ChangePasswordForm from "@/components/ChangePasswordForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Page du compte utilisateur.
 *
 * On récupère l'identité de l'administrateur connecté via le cookie `admin_session`.
 * Si aucun cookie n'est présent on redirige vers la page de connexion.
 * Le `userId` (ici l'e‑mail de l'admin) est ensuite passé au composant de changement
 * de mot de passe. La route d'API ne s'en sert pas directement mais cela permet
 * d'avoir l'information côté client si nécessaire.
 */
export default async function AccountPage() {
  // Récupération des cookies côté serveur (cookies() retourne une Promise)
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session");

  // Si aucun cookie de session n'existe, l'utilisateur n'est pas connecté
  if (!adminSession?.value) {
    redirect("/login");
  }

  // On utilise la valeur du cookie comme identifiant utilisateur (email/username)
  const userId = adminSession!.value;

  return (
    <div className="max-w-md mx-auto p-8 rounded-2xl shadow-xl mt-10">
      <h2 className="text-2xl font-bold mb-6">Mon compte</h2>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Changer le mot de passe</h3>
        <ChangePasswordForm userId={userId} />
      </div>
    </div>
  );
}
