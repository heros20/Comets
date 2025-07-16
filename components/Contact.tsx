"use client";
import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

// --- FONCTION DE FILTRAGE --- //
function sanitizeInput(str: string, maxLen = 200) {
  return (
    str
      .replace(/[<>"'`{}$;]/g, "") // Enlève balises HTML/SVG et trucs dangereux
      .replace(/(script|onerror|onload)/gi, "") // Désactive scripts connus
      .substring(0, maxLen)
  );
}

export default function Contact() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    message: "",
    hp: "", // Champ honeypot
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- On nettoie tout à chaque frappe
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    if (name === "hp") {
      setForm(f => ({ ...f, [name]: value }));
      return;
    }
    setForm(f => ({
      ...f,
      [name]: sanitizeInput(value, name === "message" ? 1000 : 64),
    }));
    setSuccess(false);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Blocage si honeypot rempli
    if (form.hp) {
      setLoading(false);
      setError("Erreur : validation anti-spam.");
      return;
    }

    // Validation basique côté client (serveur doit faire pareil)
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
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.firstname} ${form.lastname}`.trim(),
          email: form.email,
          phone: form.phone,
          message: form.message,
        }),
      });
      setSuccess(true);
      setForm({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        message: "",
        hp: "",
      });
    } catch {
      setError("Erreur lors de l’envoi. Merci de réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact – Honfleur Baseball Club&nbsp;: Les Comets
          </h2>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Un projet, une question, une envie de rejoindre l’équipe ?
            <strong> Contactez le club de baseball Les Comets d’Honfleur</strong> et vivez la passion du baseball en Normandie&nbsp;!
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulaire */}
          <div className="p-8 bg-white/95 backdrop-blur rounded-2xl shadow-lg">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
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
                <div className="mt-4 text-red-600 font-semibold" aria-live="polite">
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-4 text-green-600 font-semibold" aria-live="polite">
                  ✔️ Message envoyé ! Merci, on revient vers toi très vite.
                </div>
              )}
            </form>
          </div>
          {/* Infos de contact */}
          <div className="space-y-8" aria-label="Informations de contact club de baseball Honfleur">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Stade+Municipal+Honfleur+14600"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 bg-white/95 backdrop-blur rounded-2xl shadow hover:bg-red-50 transition"
              aria-label="Adresse club baseball Honfleur"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-red-700">Adresse</h4>
                  <p className="text-gray-600">
                    Terrain de Baseball à l'espace sportif René le Floch
                    <br />
                    Avenue de la brigade Piron
                    <br />
                    14600 Honfleur, France
                  </p>
                </div>
              </div>
            </a>
            <a
              href="tel:+33612345678"
              className="block p-6 bg-white/95 backdrop-blur rounded-2xl shadow hover:bg-orange-50 transition"
              aria-label="Téléphone club baseball Honfleur"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-orange-700">Téléphone</h4>
                  <p className="text-gray-600">06.30.32.30.76</p>
                </div>
              </div>
            </a>
            <a
              href="mailto:contact@comets-honfleur.fr"
              className="block p-6 bg-white/95 backdrop-blur rounded-2xl shadow hover:bg-yellow-50 transition"
              aria-label="Email club baseball Honfleur"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-red-500 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-yellow-700">Email</h4>
                  <p className="text-gray-600">honfleurcomets@gmail.com</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
