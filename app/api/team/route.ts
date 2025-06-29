import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("team")
      .select("*")
      .order("number", { ascending: true });

    if (error) throw error;

    // On prépare les données pour le front :
    const team = data.map(player => ({
      id: player.id,
      name: [player.first_name, player.last_name].filter(Boolean).join(" "),
      position: player.pos,
      number: player.number,
      image: "/placeholder.svg", // ou une image locale du club
      bio: "", // tu pourras l'ajouter après si besoin
    }));

    return NextResponse.json(team);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
