import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// Tu dois ajouter ces variables dans .env.local
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Utilise bien la SERVICE ROLE KEY côté serveur
);

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  // On récupère l'utilisateur dans Supabase
  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Utilisateur inconnu" }, { status: 401 });
  }

  // Vérification du mot de passe hashé
  const isValid = await bcrypt.compare(password, data.password_hash);
  if (!isValid) {
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }

  // On pose un cookie HTTPOnly qui va servir de session admin
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_session", "ok", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8, // 8h
    sameSite: "lax",
  });

  return response;
}
