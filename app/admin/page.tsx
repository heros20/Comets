import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import AdminClient from "./AdminClient"; // import de ton UI client

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminPage() {
  const adminSession = cookies().get("admin_session");

  if (!adminSession?.value) {
    redirect("/login"); // Pas connecté
  }

  const username = adminSession.value;

  const { data, error } = await supabase
    .from("admins")
    .select("role")
    .eq("username", username)
    .single();

  if (error || !data) {
    redirect("/login"); // Utilisateur non trouvé
  }

  if (data.role !== "admin") {
    redirect("/"); // Pas admin, redirection accueil
  }

  // Affiche ton composant client sécurisé
  return <AdminClient />;
}
