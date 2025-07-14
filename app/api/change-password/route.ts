import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  // On récupère le cookie admin_session
  const adminSession = cookies().get("admin_session");

  if (!adminSession || !adminSession.value) {
    return NextResponse.json({ error: "Non autorisé (cookie absent)" }, { status: 401 });
  }

  const username = adminSession.value;

  // On check que l'utilisateur existe bien en base
  const { data: admin, error } = await supabase
    .from("admins")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !admin) {
    return NextResponse.json({ error: "Session non reconnue" }, { status: 401 });
  }

  // On lit le nouveau mot de passe dans le body (et c'est tout, pas d'ID ni username dans le body !)
  const { newPassword } = await request.json();

  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
    return NextResponse.json({ error: "Mot de passe trop court" }, { status: 400 });
  }

  // On hash le nouveau mot de passe
  const newHash = await bcrypt.hash(newPassword, 10);

  // Mise à jour du password_hash
  const { error: updateError } = await supabase
    .from("admins")
    .update({ password_hash: newHash })
    .eq("username", username);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
