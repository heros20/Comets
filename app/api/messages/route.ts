import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

export const runtime = "nodejs";

const TABLE = "messages";
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL!;

// Transporteur mail
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  secure: false,
});

// === GET (Lister les messages) ===
export async function GET() {
  const { data, error } = await supabaseServer
    .from(TABLE)
    .select("id, name, email, phone, message, created_at")
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

// === POST (Créer un message) ===
export async function POST(req: Request) {
  try {
    const newMessage = await req.json();
    const { recaptcha, ...fields } = newMessage;

    // reCAPTCHA
    const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;
    if (!RECAPTCHA_SECRET)
      return NextResponse.json({ error: "Captcha configuration error." }, { status: 500 });
    if (!recaptcha)
      return NextResponse.json({ error: "Captcha non fourni." }, { status: 400 });

    // Vérification Google
    const captchaRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${RECAPTCHA_SECRET}&response=${recaptcha}`,
      }
    );
    const captchaJson = await captchaRes.json();
    if (!captchaJson.success || captchaJson.score < 0.5) {
      return NextResponse.json({ error: "Échec vérification captcha." }, { status: 400 });
    }

    // Insert BDD
    const messageToInsert = {
      ...fields,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabaseServer.from(TABLE).insert(messageToInsert);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Discord
    try {
      if (DISCORD_WEBHOOK) {
        const { name, email, phone, message } = fields;
        const discordMessage = {
          username: "Comets Honfleur ⚾️",
          avatar_url: "https://les-comets-honfleur.vercel.app/images/honfleurcomets.png",
          content: [
            "@everyone",
            ":mega: **Nouveau message sur le site !**",
            `**Nom** : ${name}`,
            `**Email** : ${email}`,
            `**Téléphone** : ${phone || "Non précisé"}`,
            `**Message** : ${message}`,
          ].join("\n"),
        };
        await fetch(DISCORD_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(discordMessage),
        });
      }
    } catch (e) {
      console.error("Erreur d'envoi Discord :", e);
    }

    // Mail admin
    const { name, email, phone, message } = fields;
    const logoPath = path.join(process.cwd(), "public/images/honfleurcomets.png");
    let logoBuffer: Buffer | undefined = undefined;
    try {
      logoBuffer = fs.readFileSync(logoPath);
    } catch (e) {}

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
      from: `"Comets Honfleur" <kevin.bigoni@outlook.fr>`,
      to: "kevin.bigoni@outlook.fr",
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
      await transporter.sendMail(mailOptions);
    } catch (err: any) {
      return NextResponse.json({ error: "Erreur lors de l’envoi du mail." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur interne." }, { status: 500 });
  }
}

// === DELETE (Supprimer un message) ===
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id)
      return NextResponse.json({ error: "ID requis." }, { status: 400 });

    const { error } = await supabaseServer.from(TABLE).delete().eq("id", id);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Erreur lors de la suppression." }, { status: 500 });
  }
}
