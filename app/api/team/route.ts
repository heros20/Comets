import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const TABLE = "team";

export async function GET() {
  try {
    const { data, error } = await supabaseServer.from(TABLE).select("*").order("number", { ascending: true });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/team error:", err);
    return NextResponse.json({ error: err.message || "Erreur inconnue" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const newMember = await req.json();
    const { error } = await supabaseServer.from(TABLE).insert(newMember);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/team error:", err);
    return NextResponse.json({ error: err.message || "Erreur inconnue" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, member } = await req.json();
    if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });
    const { error } = await supabaseServer.from(TABLE).update(member).eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/team error:", err);
    return NextResponse.json({ error: err.message || "Erreur inconnue" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });
    const { error } = await supabaseServer.from(TABLE).delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/team error:", err);
    return NextResponse.json({ error: err.message || "Erreur inconnue" }, { status: 500 });
  }
}
