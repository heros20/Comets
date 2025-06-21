import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const TABLE = "messages";

export async function GET() {
  const { data, error } = await supabaseServer
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false }); // Tri par date décroissante

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data || []);
}

export async function POST(req: Request) {
  const newMessage = await req.json();

  // On ajoute un champ created_at côté serveur
  const messageToInsert = {
    ...newMessage,
    created_at: new Date().toISOString(),
  };

  const { error } = await supabaseServer.from(TABLE).insert(messageToInsert);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

  const { error } = await supabaseServer.from(TABLE).delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
