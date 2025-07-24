import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("players") // ← LA BONNE TABLE !
      .select("id, last_name, first_name, number, pos, bt, yob, player_link, team_abbr")
      .order("number", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[/api/players] ERREUR :", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
