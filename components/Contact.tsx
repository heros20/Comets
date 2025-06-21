"use client";
import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    message: "",
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setSuccess(false);
  }

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);
  await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: `${form.firstname} ${form.lastname}`.trim(),
      email: form.email,
      phone: form.phone,
      message: form.message,
      // Pas besoin d'envoyer 'date', le serveur gère 'created_at' automatiquement
    }),
  });
  setLoading(false);
  setSuccess(true);
  setForm({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    message: "",
  });
}

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-red-600 to-orange-500">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Nous Contacter</h2>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Prêt à rejoindre l'aventure ? Contacte-nous dès maintenant !
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulaire */}
          <div className="p-8 bg-white/95 backdrop-blur rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-red-700 mb-6">Formulaire de Contact</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Parlez-nous de votre expérience au baseball, vos motivations..."
                  rows={4}
                  className="border-orange-200 focus:border-red-500 rounded px-3 py-2 w-full"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white text-lg py-3 rounded-full transition"
              >
                {loading ? "Envoi en cours..." : "Envoyer le Message"}
              </button>
              {success && (
                <div className="mt-4 text-green-600 font-semibold">
                  ✔️ Message envoyé ! Merci, on revient vers toi très vite.
                </div>
              )}
            </form>
          </div>
          {/* Infos de contact */}
          <div className="space-y-8">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Stade+Municipal+Honfleur+14600"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 bg-white/95 backdrop-blur rounded-2xl shadow hover:bg-red-50 transition"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-red-700">Adresse</h4>
                  <p className="text-gray-600">
                    Stade Municipal d'Honfleur
                    <br />
                    14600 Honfleur, France
                  </p>
                </div>
              </div>
            </a>
            <a
              href="tel:+33612345678"
              className="block p-6 bg-white/95 backdrop-blur rounded-2xl shadow hover:bg-orange-50 transition"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-orange-700">Téléphone</h4>
                  <p className="text-gray-600">06 12 34 56 78</p>
                </div>
              </div>
            </a>
            <a
              href="mailto:contact@comets-honfleur.fr"
              className="block p-6 bg-white/95 backdrop-blur rounded-2xl shadow hover:bg-yellow-50 transition"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-red-500 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-yellow-700">Email</h4>
                  <p className="text-gray-600">contact@comets-honfleur.fr</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
