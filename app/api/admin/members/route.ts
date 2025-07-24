import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Liste les membres (exclut les administrateurs)
export async function GET() {
  const { data, error } = await supabase
    .from("admins")
    .select("id, created_at, email, role, age, categorie, first_name, last_name")
    .not("role", "eq", "admin");

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

// Ajoute un membre
export async function POST(request: NextRequest) {
  const { email, password, first_name, last_name, age, categorie } = await request.json();
  if (!email || !password || !first_name || !last_name || !age || !categorie) {
    return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
  }

  const ageValue = parseInt(age, 10);
  if (isNaN(ageValue) || ageValue <= 0) {
    return NextResponse.json({ error: "Âge invalide." }, { status: 400 });
  }

  // Vérifie email unique
  const { count } = await supabase
    .from("admins")
    .select("*", { count: "exact", head: true })
    .eq("email", email);
  if (count && count > 0) {
    return NextResponse.json({ error: "Email déjà utilisé." }, { status: 400 });
  }

  const password_hash = await bcrypt.hash(password, 10);

  // Ajoute le membre dans la BDD
  const { data, error } = await supabase
    .from("admins")
    .insert([{
      email,
      password_hash,
      role: "member",
      age: ageValue,
      categorie,
      first_name,
      last_name,
      created_at: new Date().toISOString()
    }])
    .select("id, email, role, created_at, age, categorie, first_name, last_name")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ user: data });
}

// Supprime un membre (sauf administrateur)
export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "ID requis." }, { status: 400 });
  }
  // Vérifie le rôle du membre
  const { data, error } = await supabase
    .from("admins")
    .select("role")
    .eq("id", id)
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (!data || data.role === "admin") {
    return NextResponse.json(
      { error: "Impossible de supprimer un compte administrateur !" },
      { status: 403 }
    );
  }
  // Supprime réellement le membre
  const { error: delError } = await supabase
    .from("admins")
    .delete()
    .eq("id", id);
  if (delError) {
    return NextResponse.json({ error: delError.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
