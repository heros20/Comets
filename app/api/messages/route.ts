import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

// --- Config ---
const TABLE = "messages";
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL!;

// --- Transporteur Nodemailer avec SMTP Brevo ---
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  secure: false, // Brevo: 587 = STARTTLS
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
  console.log("=== [POST /api/messages] Nouvelle requête reçue ===");
  try {
    // Log env pour debug (ne pas laisser en prod si adresse sensible)
    console.log("SMTP_HOST:", process.env.SMTP_HOST);
    console.log("SMTP_USER:", process.env.SMTP_USER);
    console.log("SMTP_PASS present:", !!process.env.SMTP_PASS);

    const newMessage = await req.json();
    console.log("Données du formulaire reçues :", newMessage);

    const messageToInsert = {
      ...newMessage,
      created_at: new Date().toISOString(),
    };

    // 1. Sauvegarde dans Supabase
    const { error } = await supabaseServer.from(TABLE).insert(messageToInsert);
    if (error) {
      console.error("POST /api/messages erreur Supabase :", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.log("Message sauvegardé en base avec succès.");

    // 2. Envoi de la notif Discord (non bloquant)
    try {
      if (DISCORD_WEBHOOK) {
        const { name, email, phone, message } = newMessage;
         const discordMessage = {
            username: "Comets Honfleur ⚾️",
            avatar_url: "https://les-comets-honfleur.vercel.app/images/honfleurcomets.png",
            content: [
              "@everyone", // <-- ici, on force la notif Discord
              ":mega: **Nouveau message sur le site !**",
              `**Nom** : ${name}`,
              `**Email** : ${email}`,
              `**Téléphone** : ${phone || "Non précisé"}`,
              `**Message** : ${message}`,
            ].join('\n'),
          };
        await fetch(DISCORD_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(discordMessage),
        });
        console.log("Notification Discord envoyée avec succès !");
      }
    } catch (e) {
      console.error("Erreur d'envoi Discord :", e);
    }

    // 3. Envoi du mail via SMTP Brevo
    const { name, email, phone, message } = newMessage;

    // Récupère le logo (doit être dans public/images/honfleurcomets.png)
    const logoPath = path.join(process.cwd(), "public/images/honfleurcomets.png");
    let logoBuffer: Buffer | undefined = undefined;
    try {
      logoBuffer = fs.readFileSync(logoPath);
      console.log("Logo chargé pour pièce jointe.");
    } catch (e) {
      console.warn("Logo non trouvé ou erreur de lecture:", e);
    }

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

    const mailOptions: any = {
      from: `"Comets Honfleur" <kevin.bigoni@outlook.fr>`, // Adresse validée chez Brevo !
      to: "kevin.bigoni@outlook.fr", // Ou plusieurs destinataires si tu veux
      subject: `Contact – Nouveau message de ${name}`,
      html: htmlContent,
      replyTo: email,
    };

    if (logoBuffer) {
      mailOptions.attachments = [
        {
          filename: "logoComets.png",
          content: logoBuffer,
          cid: "logoComets",
        },
      ];
    }

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Mail envoyé avec succès !", info);
    } catch (err: any) {
      console.error("Erreur lors de l’envoi du mail :", err);
      return NextResponse.json({ error: "Erreur lors de l’envoi du mail." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/messages exception globale :", err);
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
