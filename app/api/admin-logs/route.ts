import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { cookies } from "next/headers";

const TABLE = "admin_logs";

// GET tous les logs
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

// Ajout d'un log (POST)
export async function POST(req: Request) {
  try {
    // cookies() doit être await sur Next.js 14+ !
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin_session");
    const adminUser = adminSession?.value || "anonyme";

    const newLog = await req.json();

    if ("date" in newLog) delete newLog.date;

    const logToInsert = {
      ...newLog,
      admin: adminUser,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabaseServer.from(TABLE).insert(logToInsert);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Erreur inattendue côté serveur" },
      { status: 500 }
    );
  }
}

// DELETE tous les logs (clear all)
export async function DELETE() {
  const { error } = await supabaseServer.from(TABLE).delete().neq("id", 0); // tout sauf un log impossible, donc tout
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
