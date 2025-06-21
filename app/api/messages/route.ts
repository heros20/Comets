import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const TABLE = "messages";

// Récupère tous les messages, triés du plus récent au plus ancien
export async function GET() {
  const { data, error } = await supabaseServer
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

// Ajoute un nouveau message avec timestamp côté serveur
export async function POST(req: Request) {
  const newMessage = await req.json();

  const messageToInsert = {
    ...newMessage,
    created_at: new Date().toISOString(),
  };

  const { error } = await supabaseServer.from(TABLE).insert(messageToInsert);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// Supprime un message par son ID
export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  const { error } = await supabaseServer.from(TABLE).delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
