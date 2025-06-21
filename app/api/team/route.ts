import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const TABLE = "team";

export async function GET() {
  const { data, error } = await supabaseServer
    .from(TABLE)
    .select("*")
    .order("number", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const newMember = await req.json();

  const { error } = await supabaseServer.from(TABLE).insert(newMember);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  const { id, member } = await req.json();

  if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });

  const { error } = await supabaseServer.from(TABLE).update(member).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });

  const { error } = await supabaseServer.from(TABLE).delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
