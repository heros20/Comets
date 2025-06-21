import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const TABLE = "messages";

export async function GET() {
  const { data, error } = await supabaseServer
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET /api/messages error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

export async function POST(req: Request) {
  try {
    const newMessage = await req.json();
    const messageToInsert = {
      ...newMessage,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabaseServer.from(TABLE).insert(messageToInsert);

    if (error) {
      console.error("POST /api/messages error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/messages exception:", err);
    return NextResponse.json({ error: "Erreur serveur interne." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const { error } = await supabaseServer.from(TABLE).delete().eq("id", id);

    if (error) {
      console.error("DELETE /api/messages error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/messages exception:", err);
    return NextResponse.json({ error: "Erreur serveur interne." }, { status: 500 });
  }
}
