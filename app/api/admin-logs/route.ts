import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

const TABLE = "admin_logs";

export async function GET() {
  const { data, error } = await supabaseServer
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data || []);
}

export async function POST(req: Request) {
  const newLog = await req.json();

  const logToInsert = {
    ...newLog,
    created_at: new Date().toISOString(),
  };

  const { error } = await supabaseServer.from(TABLE).insert(logToInsert);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
