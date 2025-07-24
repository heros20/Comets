import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  // Hack TS pour cookies() qui croit à une Promise !
  const cookieStore = cookies() as any;
  const adminSession = cookieStore.get("admin_session");

  console.log("adminSession cookie value:", adminSession?.value);

  if (!adminSession?.value) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const email = adminSession.value;

  const { data, error } = await supabase
    .from("admins")
    .select("id, email, role, first_name, last_name, created_at")
    .eq("email", email)
    .single();

  if (error || !data) {
    console.log("Erreur Supabase ou utilisateur non trouvé :", error);
    return NextResponse.json({ error: "Utilisateur inconnu" }, { status: 404 });
  }

  return NextResponse.json({ user: data });
}
