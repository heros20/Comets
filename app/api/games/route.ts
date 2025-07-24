import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("games")
      .select("*")
      .order("date", { ascending: true });

    if (error) throw error;

    // On adapte les champs si besoin
    const games = data.map(match => ({
      id: match.id,
      gameNumber: match.game_number,
      date: match.date,
      isHome: match.is_home,
      opponent: match.opponent_abbr,
      logo: match.opponent_logo,
      teamScore: match.team_score,
      opponentScore: match.opponent_score,
      result: match.result,
      boxscore: match.boxscore_link,
    }));

    return NextResponse.json(games);
  } catch (err: unknown) {
    let errorMessage = "Erreur inconnue";
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
