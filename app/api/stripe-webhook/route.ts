// app/api/stripe-webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Forcer le type ici pour éviter l'erreur de version API
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15" as any, // <== cast any pour bypass TS strict
});

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const sig = request.headers.get("stripe-signature")!;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    } catch (err) {
      console.error("⚠️ Webhook signature verification failed.", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const nom = session.metadata?.nom || "";
      const prenom = session.metadata?.prenom || "";
      const age = session.metadata?.age || "";
      const email = session.metadata?.email || "";
      const montant = session.amount_total ? session.amount_total / 100 : 0;

      const { error } = await supabaseServer
        .from("cotisations")
        .insert([{
          nom,
          prenom,
          age: Number(age),
          email,
          montant_eur: montant,
          stripe_id: session.id,
          statut: "paid",
          paid_at: new Date().toISOString(),
        }]);
      if (error) {
        console.error("Erreur insertion cotisation :", error);
        return NextResponse.json({ error: "DB insert error" }, { status: 500 });
      }
      console.log("✅ Cotisation enregistrée en BDD :", nom, prenom, email);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Erreur webhook Stripe :", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
