import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type HoraireItem = {
  id?: number;
  label: string;
  min_age: number;
  max_age?: number | null;
  horaires: string[];
  jours: string[];
};

function validateItem(item: any): item is HoraireItem {
  return (
    item &&
    typeof item.label === "string" &&
    typeof item.min_age === "number" &&
    Array.isArray(item.horaires) &&
    item.horaires.every((h: any) => typeof h === "string") &&
    Array.isArray(item.jours) &&
    item.jours.every((j: any) => typeof j === "string") &&
    (item.max_age === undefined || item.max_age === null || typeof item.max_age === "number")
  );
}

export async function GET() {
  const { data, error } = await supabase
    .from("horaires")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const horaires: HoraireItem[] = (data ?? []).map((item: any) => ({
    id: item.id,
    label: item.label,
    min_age: item.min_age,
    max_age: item.max_age,
    horaires: item.horaires ? JSON.parse(item.horaires) : [],
    jours: item.jours ? JSON.parse(item.jours) : [],
  }));

  return NextResponse.json(horaires);
}

export async function PUT(request: Request) {
  try {
    const newData = await request.json();

    if (!Array.isArray(newData)) {
      return NextResponse.json({ error: "Données invalides, tableau attendu." }, { status: 400 });
    }

    for (const item of newData) {
      if (!validateItem(item)) {
        return NextResponse.json(
          { error: "Chaque élément doit avoir label (string), min_age (number), horaires (string[]), jours (string[]), max_age (number|null|undefined)." },
          { status: 400 }
        );
      }
    }

    // Supprime tout avant
    const { error: delError } = await supabase.from("horaires").delete().neq("id", 0);
    if (delError) {
      return NextResponse.json({ error: delError.message }, { status: 500 });
    }

    // Prépare les données à insérer
    const insertData = newData.map((item) => ({
      label: item.label,
      min_age: item.min_age,
      max_age: item.max_age ?? null,
      horaires: JSON.stringify(item.horaires),
      jours: JSON.stringify(item.jours),
    }));

    const { error: insertError } = await supabase.from("horaires").insert(insertData);
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Horaires mis à jour avec succès !" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const item = await request.json();

    if (!validateItem(item)) {
      return NextResponse.json(
        { error: "L'élément doit avoir label (string), min_age (number), horaires (string[]), jours (string[]), max_age (number|null|undefined)." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.from("horaires").insert([{
      label: item.label,
      min_age: item.min_age,
      max_age: item.max_age ?? null,
      horaires: JSON.stringify(item.horaires),
      jours: JSON.stringify(item.jours),
    }]).select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Horaire ajouté avec succès !", data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Erreur serveur." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, updates } = await request.json();

    if (typeof id !== "number") {
      return NextResponse.json({ error: "id invalide ou manquant" }, { status: 400 });
    }
    if (!updates || typeof updates !== "object") {
      return NextResponse.json({ error: "updates manquants ou invalides" }, { status: 400 });
    }

    // Valide les champs à mettre à jour
    const allowedFields = ["label", "min_age", "max_age", "horaires", "jours"];
    for (const key of Object.keys(updates)) {
      if (!allowedFields.includes(key)) {
        return NextResponse.json({ error: `Champ invalide: ${key}` }, { status: 400 });
      }
    }

    // Si horaires ou jours sont fournis, stringify
    const updatesToSave: any = { ...updates };
    if (updates.horaires) {
      if (!Array.isArray(updates.horaires) || !updates.horaires.every((h: any) => typeof h === "string")) {
        return NextResponse.json({ error: "horaires doit être un tableau de chaînes" }, { status: 400 });
      }
      updatesToSave.horaires = JSON.stringify(updates.horaires);
    }
    if (updates.jours) {
      if (!Array.isArray(updates.jours) || !updates.jours.every((j: any) => typeof j === "string")) {
        return NextResponse.json({ error: "jours doit être un tableau de chaînes" }, { status: 400 });
      }
      updatesToSave.jours = JSON.stringify(updates.jours);
    }

    // Effectue la mise à jour
    const { error } = await supabase
      .from("horaires")
      .update(updatesToSave)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Horaire modifié avec succès !" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (typeof id !== "number") {
      return NextResponse.json({ error: "id invalide ou manquant" }, { status: 400 });
    }

    const { error } = await supabase
      .from("horaires")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Horaire supprimé avec succès !" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Erreur serveur." }, { status: 500 });
  }
}
