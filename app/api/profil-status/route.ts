import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  // On récupère l'email du membre connecté
  const { email } = await request.json();

  // On récupère le membre par email
  const { data: user, error: userError } = await supabase
    .from("admins")
    .select("*")
    .eq("email", email)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: "Utilisateur non trouvé." }, { status: 404 });
  }

  // Vérifie paiement en ligne (Stripe)
  let hasPaidStripe = false;
  let cotisationDetail = null;

  if (user.first_name && user.last_name) {
    // On cherche un paiement avec prénom+nom (ou email si ta table cotisations le gère)
    let { data: cotisation } = await supabase
      .from("cotisations")
      .select("*")
      .eq("prenom", user.first_name)
      .eq("nom", user.last_name)
      .eq("statut", "paid")
      .order("paid_at", { ascending: false })
      .limit(1)
      .single();

    if (cotisation) {
      hasPaidStripe = true;
      cotisationDetail = cotisation;
    }
  }

  // Si pas payé en ligne, check la fédé (scrape/BDD players)
  let hasPaidFede = false;
  let playerFede = null;

  if (!hasPaidStripe && user.first_name && user.last_name) {
    let { data: player } = await supabase
      .from("players")
      .select("*")
      .eq("first_name", user.first_name)
      .eq("last_name", user.last_name)
      .limit(1)
      .single();

    if (player) {
      hasPaidFede = true;
      playerFede = player;
    }
  }

  // Statut général
  const cotisationPayee = hasPaidStripe || hasPaidFede;

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    },
    cotisationPayee,
    via: hasPaidStripe ? "en ligne (Stripe)" : hasPaidFede ? "fédération" : "non payée",
    detail: hasPaidStripe ? cotisationDetail : hasPaidFede ? playerFede : null,
  });
}
