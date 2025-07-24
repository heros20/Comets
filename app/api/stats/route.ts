import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const TABLE = "stats";

export async function GET() {
  const { data, error } = await supabaseServer.from(TABLE).select("*").limit(1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data?.[0] || {});
}

export async function POST(req: Request) {
  const stats = await req.json();

  // On suppose qu'il n'y a qu'une seule ligne, donc on met à jour ou insert selon présence
  const { data, error: selectError } = await supabaseServer.from(TABLE).select("id").limit(1);

  if (selectError) return NextResponse.json({ error: selectError.message }, { status: 500 });

  if (data && data.length > 0) {
    // Update
    const { error } = await supabaseServer.from(TABLE).update(stats).eq("id", data[0].id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    // Insert
    const { error } = await supabaseServer.from(TABLE).insert(stats);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
