import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// On utilise la clé ANON côté front pour la sécurité
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    // On va chercher le dernier classement inséré
    const { data, error } = await supabase
      .from("classement_normandie")
      .select("data")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      console.error("[API] Erreur Supabase :", error);
      return NextResponse.json({ error: "Erreur BDD" }, { status: 500 });
    }

    // On renvoie le contenu JSON (qui contient tabs, standings, year, etc.)
    return NextResponse.json(data.data);
  } catch (err) {
    console.error("Erreur api/classement-normandie:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
