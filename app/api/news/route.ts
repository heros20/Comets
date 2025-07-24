import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // Clé service_role ici pour contourner RLS
);

export async function GET() {
  try {
    const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("Erreur GET news:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("Erreur inattendue GET news:", err);
    return NextResponse.json({ error: "Erreur inattendue" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("POST news body:", body);

    const { title, content, image_url, author } = body;

    if (!title || !content) {
      console.log("POST news : titre ou contenu manquant");
      return NextResponse.json({ error: "Le titre et le contenu sont obligatoires" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("news")
      .insert([{ title, content, image_url, author }])
      .select();

    if (error) {
      console.error("Erreur insertion news:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("News insérée:", data);
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Erreur inattendue POST news:", err);
    return NextResponse.json({ error: "Erreur inattendue" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }
    const { error } = await supabase.from("news").delete().eq("id", id);
    if (error) {
      console.error("Erreur suppression news:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur inattendue DELETE news:", err);
    return NextResponse.json({ error: "Erreur inattendue" }, { status: 500 });
  }
}
