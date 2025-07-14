import ChangePasswordForm from "@/components/ChangePasswordForm";

// À remplacer par ta vraie récupération de l'utilisateur connecté !
const userId = "UTILISATEUR_ID"; // TODO: Prends-le depuis la session/cookie/etc.

export default function AccountPage() {
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
