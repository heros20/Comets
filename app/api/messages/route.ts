import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

const TABLE = "messages";

// Création du transporteur Nodemailer AVEC variables d'environnement
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,   // Doit être 'kevin.bigoni@gmail.com'
    pass: process.env.EMAIL_PASS,   // Mot de passe d'application généré sur Google
  },
});

// === GET ===
export async function GET() {
  const { data, error } = await supabaseServer
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET /api/messages error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

// === POST ===
export async function POST(req: Request) {
  try {
    const newMessage = await req.json();
    const messageToInsert = {
      ...newMessage,
      created_at: new Date().toISOString(),
    };

    // 1. Sauvegarde dans Supabase
    const { error } = await supabaseServer.from(TABLE).insert(messageToInsert);
    if (error) {
      console.error("POST /api/messages error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 2. Envoi du mail stylé
    const { name, email, phone, message } = newMessage;

    // Récupère le logo (penser à mettre le logo dans 'public/images/honfleurcomets.png')
    const logoPath = path.join(process.cwd(), "public/images/honfleurcomets.png");
    const logoBuffer = fs.readFileSync(logoPath);

    // HTML du mail (bleu marine/blanc + logo en haut)
    const htmlContent = `
      <div style="background: #001b36; color: #fff; font-family: 'Segoe UI', Arial, sans-serif; padding: 40px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="cid:logoComets" alt="Comets Honfleur" style="max-width: 220px; margin: 0 auto 24px; display:block;" />
        </div>
        <h2 style="color:#fff; text-align: center; margin-bottom: 30px;">Nouveau message reçu !</h2>
        <div style="background: #fff; color: #001b36; border-radius: 12px; padding: 24px; max-width: 600px; margin: 0 auto;">
          <p><strong>Nom :</strong> ${name}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Téléphone :</strong> ${phone || "Non précisé"}</p>
          <hr style="margin: 18px 0; border: 0; border-top: 1px solid #c7d3e3;" />
          <p style="white-space: pre-line;"><strong>Message :</strong><br/>${message}</p>
        </div>
        <div style="margin-top: 32px; text-align:center;">
          <span style="color: #c7d3e3;">Comets Honfleur – On vise la Lune, pas moins !</span>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Comets Honfleur" <${process.env.EMAIL_USER}>`,
      to: "kevin.bigoni@gmail.com",  // Tu peux mettre plusieurs destinataires si besoin
      subject: `Contact – Nouveau message de ${name}`,
      html: htmlContent,
      attachments: [
        {
          filename: "logoComets.png",
          content: logoBuffer,
          cid: "logoComets", // même nom que dans l'HTML (src="cid:logoComets")
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/messages exception:", err);
    return NextResponse.json({ error: "Erreur serveur interne." }, { status: 500 });
  }
}

// === DELETE ===
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const { error } = await supabaseServer.from(TABLE).delete().eq("id", id);

    if (error) {
      console.error("DELETE /api/messages error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/messages exception:", err);
    return NextResponse.json({ error: "Erreur serveur interne." }, { status: 500 });
  }
}
