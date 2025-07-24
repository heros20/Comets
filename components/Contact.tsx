"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

// TypeScript : typage explicite des paramètres
function sanitizeInput(str: string, maxLen: number = 200): string {
  return (
    str
      .replace(/[<>"'`{}$;]/g, "")
      .replace(/(script|onerror|onload)/gi, "")
      .substring(0, maxLen)
  );
}

type FormType = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  message: string;
  hp: string;
};

export default function Contact() {
  const [form, setForm] = useState<FormType>({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    message: "",
    hp: "",
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // On charge le script Google reCAPTCHA v3 au montage
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) return;
    if ((window as any).grecaptcha) return;
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    if (name === "hp") {
      setForm(f => ({ ...f, [name]: value }));
      return;
    }
    setForm(f => ({
      ...f,
      [name]: sanitizeInput(
        value,
        name === "message" ? 1000 : 64
      ),
    }));
    setSuccess(false);
    setError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.hp) {
      setLoading(false);
      setError("Erreur : validation anti-spam.");
      return;
    }
    if (
      !form.firstname ||
      !form.lastname ||
      !form.email ||
      !form.message ||
      !/^[\w-.]+@[\w-]+\.[\w-.]+$/.test(form.email)
    ) {
      setLoading(false);
      setError("Merci de remplir tous les champs obligatoires.");
      return;
    }

    try {
      let recaptchaToken = "";
      // Pour TypeScript, on cast window pour grecaptcha
      if (
        typeof window !== "undefined" &&
        (window as any).grecaptcha &&
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
      ) {
        recaptchaToken = await (window as any).grecaptcha.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
          { action: "submit" }
        );
      } else {
        setLoading(false);
        setError("reCAPTCHA non chargé. Merci de recharger la page.");
        return;
      }

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.firstname} ${form.lastname}`.trim(),
          email: form.email,
          phone: form.phone,
          message: form.message,
          recaptcha: recaptchaToken,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "Erreur lors de l’envoi.");
      }

      setSuccess(true);
      setForm({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        message: "",
        hp: "",
      });
    } catch (err: any) {
      setError(
        err?.message === "Échec vérification captcha."
          ? "Vérification de sécurité échouée, réessaye !"
          : "Erreur lors de l’envoi. Merci de réessayer."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* GLOW "COMÈTE" */}
      <div
        className="
          pointer-events-none
          absolute -z-10 left-1/2 top-28
          -translate-x-1/2 w-[800px] h-[300px]
          bg-gradient-to-tr from-orange-200 via-red-300 to-yellow-100
          rounded-full blur-3xl
        "
      />
      <section id="contact" className="flex-1 py-14">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Texte du dessus en BOITE */}
          <div className="mx-auto max-w-3xl mb-12 bg-white/90 rounded-2xl shadow-xl ring-2 ring-orange-200/80 backdrop-blur p-8 text-center relative z-20">
            <h2 className="text-4xl md:text-5xl font-bold text-black drop-shadow-md mb-3">
              Contact – Honfleur Baseball Club&nbsp;: Les Comets
            </h2>
            <p className="text-xl text-black/90 max-w-2xl mx-auto">
              Un projet, une question, une envie de rejoindre l’équipe ? <br />
              <strong className="font-bold text-orange-700">
                Contactez le club de baseball Les Comets d’Honfleur
              </strong>{" "}
              et vivez la passion du baseball en Normandie&nbsp;!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formulaire */}
            <div className="p-8 bg-white/95 backdrop-blur rounded-2xl shadow-2xl ring-2 ring-orange-200/70">
              <h3 className="text-2xl font-bold text-red-700 mb-6">
                Formulaire de contact : baseball Honfleur
              </h3>
              <form
                className="space-y-6"
                onSubmit={handleSubmit}
                aria-label="Formulaire d’adhésion et contact club de baseball Honfleur"
                autoComplete="off"
              >
                {/* --- Honeypot anti-spam --- */}
                <div style={{ display: "none" }}>
                  <label>
                    Laissez ce champ vide
                    <input
                      type="text"
                      name="hp"
                      value={form.hp}
                      onChange={handleChange}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Prénom
                    </label>
                    <input
                      name="firstname"
                      value={form.firstname}
                      onChange={handleChange}
                      placeholder="Votre prénom"
                      className="border-orange-200 focus:border-red-500 rounded px-3 py-2 w-full"
                      required
                      autoComplete="given-name"
                      maxLength={32}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Nom
                    </label>
                    <input
                      name="lastname"
                      value={form.lastname}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      className="border-orange-200 focus:border-red-500 rounded px-3 py-2 w-full"
                      required
                      autoComplete="family-name"
                      maxLength={32}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="votre.email@exemple.com"
                    className="border-orange-200 focus:border-red-500 rounded px-3 py-2 w-full"
                    required
                    autoComplete="email"
                    maxLength={64}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Téléphone
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Votre numéro de téléphone"
                    className="border-orange-200 focus:border-red-500 rounded px-3 py-2 w-full"
                    autoComplete="tel"
                    maxLength={18}
                    pattern="^[0-9+ ]*$"
                    inputMode="tel"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Parlez-nous de votre expérience au baseball, vos motivations, ou posez vos questions sur l’équipe de Honfleur…"
                    rows={4}
                    className="border-orange-200 focus:border-red-500 rounded px-3 py-2 w-full"
                    required
                    maxLength={1000}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white text-lg py-3 rounded-full transition"
                  aria-label="Envoyer le message au club de baseball Les Comets Honfleur"
                >
                  {loading ? "Envoi en cours..." : "Envoyer le Message"}
                </button>
                {error && (
                  <div
                    className="mt-4 text-red-600 font-semibold"
                    aria-live="polite"
                  >
                    {error}
                  </div>
                )}
                {success && (
                  <div
                    className="mt-4 text-green-600 font-semibold"
                    aria-live="polite"
                  >
                    ✔️ Message envoyé ! Merci, on revient vers toi très vite.
                  </div>
                )}
              </form>
            </div>
            {/* Infos de contact – Effet subtil */}
            <div className="space-y-8">
              {[
                {
                  icon: <MapPin className="h-6 w-6 text-white" />,
                  title: "Adresse",
                  subtitle: (
                    <>
                      Terrain de Baseball à l'espace sportif René le Floch
                      <br />
                      Avenue de la brigade Piron
                      <br />
                      14600 Honfleur, France
                    </>
                  ),
                  href: "https://www.google.com/maps/search/?api=1&query=Stade+Municipal+Honfleur+14600",
                  colorFrom: "from-red-500",
                  colorTo: "to-orange-500",
                  border: "border-orange-200",
                },
                {
                  icon: <Phone className="h-6 w-6 text-white" />,
                  title: "Téléphone",
                  subtitle: <>06.30.32.30.76</>,
                  href: "tel:+33630323076",
                  colorFrom: "from-orange-500",
                  colorTo: "to-yellow-500",
                  border: "border-yellow-200",
                },
                {
                  icon: <Mail className="h-6 w-6 text-white" />,
                  title: "Email",
                  subtitle: <>honfleurcomets@gmail.com</>,
                  href: "mailto:contact@comets-honfleur.fr",
                  colorFrom: "from-yellow-500",
                  colorTo: "to-red-500",
                  border: "border-red-200",
                },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    group block p-6 bg-white/95 rounded-2xl shadow-lg
                    border ${item.border} backdrop-blur
                    transition-all duration-300
                    hover:shadow-2xl hover:-translate-y-1 hover:border-orange-400
                  `}
                  aria-label={item.title + " club baseball Honfleur"}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 ${item.colorFrom} ${item.colorTo} bg-gradient-to-br rounded-full flex items-center justify-center shadow group-hover:brightness-110 transition`}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-black">{item.title}</h4>
                      <p className="text-gray-700">{item.subtitle}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
