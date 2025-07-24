import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import AdminClient from "./AdminClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminPage() {
  // Ici on force le "await" pour contenter le typage
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session");

  if (!adminSession?.value) {
    redirect("/login");
  }

  const email = adminSession.value;

  const { data, error } = await supabase
    .from("admins")
    .select("role")
    .eq("email", email)
    .single();

  if (error || !data) {
    redirect("/login");
  }

  if (data.role !== "admin") {
    redirect("/");
  }

  return <AdminClient />;
}
