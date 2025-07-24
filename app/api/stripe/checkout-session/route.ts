// app/api/stripe/checkout-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Cast 'apiVersion' en any pour éviter l'erreur TS
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10" as any,
});

// Seul ce bloc exporté ! Pas de await à la racine !
export async function POST(request: Request) {
  const { nom, prenom, age, email, tarif } = await request.json();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Cotisation Comets Honfleur",
              description: "Inscription saison 2025",
            },
            unit_amount: tarif * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      metadata: {
        nom,
        prenom,
        age: String(age),
        email,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/rejoindre?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/rejoindre?cancel=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
