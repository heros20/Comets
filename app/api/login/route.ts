import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// Utilise bien la SERVICE ROLE KEY côté serveur
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Vérifie présence des champs
  if (!email || !password) {
    return NextResponse.json({ error: "Email et mot de passe requis." }, { status: 400 });
  }

  // On récupère l'utilisateur dans Supabase
  const { data, error } = await supabase
    .from("admins")
    .select("id, email, role, password_hash")
    .eq("email", email)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Utilisateur inconnu" }, { status: 401 });
  }

  // Vérification du mot de passe hashé
  const isValid = await bcrypt.compare(password, data.password_hash);
  if (!isValid) {
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }

  // Pose un cookie HTTPOnly pour la session admin
  const response = NextResponse.json({
    success: true,
    role: data.role,   // <-- renvoie bien le rôle ici
    email: data.email, // (optionnel, pratique pour debug ou pour le front)
    id: data.id        // (optionnel, si besoin sur le front)
  });

  response.cookies.set("admin_session", data.email, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8, // 8h
    sameSite: "lax",
  });

  return response;
}
