import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  // On récupère les nouveaux champs
  const { email, password, first_name, last_name, age } = await request.json();

  // Vérifie que tout est bien là
  if (!email || !password || !first_name || !last_name || age === undefined) {
    return NextResponse.json(
      { error: "Tous les champs sont requis." },
      { status: 400 }
    );
  }

  const ageValue = parseInt(age, 10);
  if (isNaN(ageValue) || ageValue <= 0) {
    return NextResponse.json({ error: "Âge invalide." }, { status: 400 });
  }

  const cleanEmail = email.trim().toLowerCase();
  const password_hash = await bcrypt.hash(password, 10);

  // Détermine la catégorie en fonction de l'âge
  let categorie: string;
  if (ageValue < 13) {
    categorie = "12U";
  } else if (ageValue < 17) {
    categorie = "15U";
  } else {
    categorie = "Senior";
  }

  // On insère dans admins
  const { data, error } = await supabase
    .from("admins")
    .insert([
      {
        email: cleanEmail,
        password_hash,
        first_name,
        last_name,
        role: "member",
        age: ageValue,
        categorie,
      },
    ])
    .select();

  if (error) {
    // Gestion duplication email
    if (
      error.code === "23505" ||
      (error.message &&
        error.message.toLowerCase().includes("duplicate key value") &&
        error.message.toLowerCase().includes("email"))
    ) {
      return NextResponse.json(
        {
          error:
            "Cette adresse e-mail est déjà utilisée. Merci d'en choisir une autre !",
        },
        { status: 400 }
      );
    }
    // Autres erreurs
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ user: data?.[0] });
}
