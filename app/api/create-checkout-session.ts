// pages/api/create-checkout-session.ts (ou app/api/create-checkout-session/route.ts si Next 13+)
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { montant, prenom } = await req.json();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Cotisation Club Les Comets d'Honfleur",
            },
            unit_amount: montant || 5000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: process.env.NEXT_PUBLIC_SITE_URL + "/?success=1",
      cancel_url: process.env.NEXT_PUBLIC_SITE_URL + "/?canceled=1",
      metadata: {
        prenom: prenom || "",
      },
    });
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
