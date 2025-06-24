import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseServer } from "@/lib/supabaseServer";

// Stripe init (pas besoin de version si tu utilises le bon package)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const config = {
  api: {
    bodyParser: false, // On lit le raw pour Stripe
  },
};

export async function POST(req: Request) {
  // Stripe envoie le body en raw, il faut le lire ainsi :
  const buf = await req.arrayBuffer();
  const rawBody = Buffer.from(buf);
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Erreur vérification Stripe:", err.message);
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  // On gère le paiement réussi :
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const prenom = session.metadata?.prenom || "";

    try {
      if (prenom) {
        // ⚠️ Ici on utilise bien "team" tout en minuscules
        const { error } = await supabaseServer
          .from("team")
          .insert([{ name: prenom }]);
        if (error) throw new Error(error.message);
        console.log("✅ Nouveau membre ajouté:", prenom);
      } else {
        console.warn("⚠️ Aucun prénom reçu dans metadata Stripe.");
      }
    } catch (e) {
      console.error("Erreur insertion Supabase:", e);
      return NextResponse.json({ error: "DB insert error" }, { status: 500 });
    }
  }

  // Toujours répondre à Stripe sinon il va retenter
  return NextResponse.json({ received: true });
}
