import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import AdminClient from "./AdminClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminPage() {
  let cookieStore;
  // Si cookies() est async, on attend ; sinon, fallback sync.
  try {
    cookieStore = await cookies();
  } catch {
    cookieStore = cookies();
  }
  const adminSession = cookieStore.get("admin_session");

  if (!adminSession?.value) {
    redirect("/login");
  }

  const username = adminSession.value;

  const { data, error } = await supabase
    .from("admins")
    .select("role")
    .eq("username", username)
    .single();

  if (error || !data) {
    redirect("/login");
  }

  if (data.role !== "admin") {
    redirect("/");
  }

  return <AdminClient />;
}
