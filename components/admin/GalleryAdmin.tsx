"use client";
import { useState, useEffect, useRef } from "react";
import { logAdminAction } from "@/utils/adminLog";

export default function GalleryAdmin() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [form, setForm] = useState({ url: "", legend: "" });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInput = useRef<HTMLInputElement>(null);

  // Charger la galerie au montage
  useEffect(() => {
    fetch("/api/gallery")
      .then(res => res.json())
      .then(data => {
        setGallery(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setSuccess(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.url) return;
    setLoading(true);
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      await logAdminAction("Ajouté une image à la galerie");
      // Rechargement complet pour récupérer l'id généré
      const data = await (await fetch("/api/gallery")).json();
      setGallery(data);
      setForm({ url: "", legend: "" });
      setSuccess(true);
    }
    setLoading(false);
  }

  async function handleDelete(id: number) {
    setLoading(true);
    const res = await fetch("/api/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      await logAdminAction("Supprimé une image de la galerie");
      setGallery(gallery.filter(img => img.id !== id));
    }
    setLoading(false);
  }

  // UPLOAD local
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setForm((f) => ({ ...f, url }));
      setSuccess(false);
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setForm((f) => ({ ...f, url }));
      setSuccess(false);
    };
    reader.readAsDataURL(file);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-700 mb-4">Gérer la galerie photo</h2>
      <form onSubmit={handleAdd} className="flex flex-col gap-3 mb-6">
        <div
          className="flex flex-col md:flex-row gap-3"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            name="url"
            value={form.url}
            onChange={handleChange}
            placeholder="Lien de l'image (URL) ou uploader ci-dessous"
            className="flex-1 px-4 py-2 border border-red-300 rounded-md"
          />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="px-4 py-2 bg-orange-200 hover:bg-orange-300 text-orange-900 rounded font-semibold border border-orange-400"
          >
            📁 Choisir une image
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <input
          name="legend"
          value={form.legend}
          onChange={handleChange}
          placeholder="Légende (facultatif)"
          className="px-4 py-2 border border-orange-300 rounded-md"
        />
        {form.url && (
          <div className="flex items-center gap-3">
            <img src={form.url} alt="Preview" className="w-24 h-20 object-cover rounded shadow border border-orange-200" />
            <span className="text-gray-500 text-sm">Prévisualisation</span>
          </div>
        )}
        <button type="submit" className="mt-1 px-8 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold" disabled={loading}>
          Ajouter
        </button>
      </form>
      {success && <div className="mb-4 text-green-600">✔️ Image ajoutée à la galerie !</div>}

      {gallery.length === 0 && (
        <div className="text-gray-500 text-center py-8">Aucune image pour l’instant…</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gallery.map((img) => (
          <div key={img.id} className="relative rounded-xl shadow-lg overflow-hidden group">
            <img
              src={img.url}
              alt={img.legend || `Photo`}
              className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {img.legend && (
              <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-sm px-3 py-2">
                {img.legend}
              </div>
            )}
            <button
              onClick={() => handleDelete(img.id)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-800 text-white px-2 py-1 rounded-full text-xs shadow-lg transition"
              title="Supprimer cette image"
              disabled={loading}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 text-sm text-gray-400 text-center">
        <b>Astuce :</b> Tu peux aussi <span className="underline">glisser-déposer</span> une image sur le formulaire d’ajout.
      </div>
    </div>
  );
}
