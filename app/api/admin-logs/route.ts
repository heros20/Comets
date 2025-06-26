import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { cookies } from "next/headers";

const TABLE = "admin_logs";

export async function GET() {
  const { data, error } = await supabaseServer
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET /api/admin-logs error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const adminSession = cookieStore.get("admin_session");
    const adminUser = adminSession?.value || "anonyme";

    const newLog = await req.json();

    // Supprime le champ 'date' s’il existe pour éviter les conflits
    if ("date" in newLog) {
      delete newLog.date;
    }

    const logToInsert = {
      ...newLog,
      admin: adminUser, // Ajoute le nom d'admin ici
      created_at: new Date().toISOString(), // timestamp propre
    };

    const { error } = await supabaseServer.from(TABLE).insert(logToInsert);

    if (error) {
      console.log("Tentative d'insertion du log : ", logToInsert);

      console.error("POST /api/admin-logs insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("POST /api/admin-logs unexpected error:", e);
    return NextResponse.json({ error: "Erreur inattendue côté serveur" }, { status: 500 });
  }
}
