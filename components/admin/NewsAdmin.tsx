"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";

async function fetchNews() {
  const res = await fetch("/api/news");
  return await res.json();
}
async function addNews(news: any) {
  const res = await fetch("/api/news", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(news),
  });
  return await res.json();
}
async function updateNews(id: number, news: any) {
  const res = await fetch(`/api/news/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(news),
  });
  return await res.json();
}
async function deleteNews(id: number) {
  await fetch(`/api/news/${id}`, { method: "DELETE" });
}

export default function NewsAdmin() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", content: "", image_url: "" });
  const [category, setCategory] = useState("");
  const [formError, setFormError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const CATEGORIES = [
    { value: "", label: "-- Choisis une catégorie --" },
    { value: "Cadet - ", label: "Cadet" },
    { value: "12U - ", label: "12U" },
    { value: "15U - ", label: "15U" },
    { value: "Séniors - ", label: "Séniors" },
  ];

  useEffect(() => {
    fetchNews().then(setNewsList);
  }, []);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.35,
        maxWidthOrHeight: 1280,
        useWebWorker: true,
      });

      const formData = new FormData();
      formData.append("file", compressed, compressed.name);

      const res = await fetch("/api/upload-news-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setForm(f => ({ ...f, image_url: data.url }));
    } catch (err: any) {
      alert("Erreur lors de l'upload : " + err.message);
    }
    setUploading(false);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (!category) {
      setFormError("Merci de choisir une catégorie pour l’article.");
      return;
    }
    if (!form.title.trim()) {
      setFormError("Merci de renseigner un titre d’article.");
      return;
    }
    if (!form.content.trim()) {
      setFormError("Merci de rédiger le texte de l’article.");
      return;
    }

    setFormError("");
    setLoading(true);

    if (editingId) {
      await updateNews(editingId, { ...form, title: category + form.title });
    } else {
      await addNews({ ...form, title: category + form.title });
    }
    setForm({ title: "", content: "", image_url: "" });
    setCategory("");
    setEditingId(null);
    setLoading(false);
    fetchNews().then(setNewsList);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleEdit(news: any) {
    const cat = CATEGORIES.find(c => news.title.startsWith(c.value))?.value || "";
    const titleSansCat = cat ? news.title.replace(cat, "") : news.title;
    setForm({
      title: titleSansCat,
      content: news.content,
      image_url: news.image_url || ""
    });
    setCategory(cat);
    setEditingId(news.id);
    setFormError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleCancelEdit() {
    setForm({ title: "", content: "", image_url: "" });
    setCategory("");
    setEditingId(null);
    setFormError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Supprimer cet article ?")) return;
    await deleteNews(id);
    setNewsList(list => list.filter(n => n.id !== id));
    if (editingId === id) handleCancelEdit();
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-700 mb-6">Actualités / Articles du club</h2>
      <form onSubmit={handleSubmit} className="bg-orange-50 p-5 rounded-xl mb-8 shadow space-y-4">

        {/* MESSAGE D'ERREUR */}
        {formError && (
          <div className="mb-3 py-2 px-4 bg-red-100 text-red-700 rounded text-center font-bold border border-red-300 shadow">
            {formError}
          </div>
        )}

        {/* Sélecteur catégorie + titre */}
        <div>
          <label className="block font-semibold mb-1">Titre de l’article</label>
          <div className="flex gap-2">
            <select
              className="border rounded px-2 py-2 font-bold text-orange-700"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <input
              className="border rounded px-3 py-2 flex-1"
              value={form.title}
              maxLength={120}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Titre de l’article"
              disabled={category === ""}
            />
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Texte de l’article</label>
          <textarea
            className="border rounded px-3 py-2 w-full min-h-[90px]"
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">
            Image principale (upload JPG/PNG, &lt; 350Ko)
            <span className="text-gray-400 italic font-normal"> (optionnel)</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            className="border rounded px-3 py-2 w-full"
          />
          {uploading && <div className="text-orange-600 mt-2">Compression et upload en cours…</div>}
          {form.image_url && (
            <div className="mt-2">
              <Image
                src={form.image_url}
                alt="Aperçu"
                width={96}
                height={96}
                className="rounded shadow"
                style={{ objectFit: "cover", width: 96, height: 96 }}
                unoptimized={form.image_url.startsWith("data:")}
              />
            </div>
          )}
        </div>
        <div className="flex gap-4 items-center">
          <button
            type="submit"
            className="px-6 py-2 rounded-full font-bold bg-gradient-to-r from-orange-500 to-red-600 text-white shadow hover:from-orange-600 hover:to-red-700 transition"
            disabled={loading}
          >
            {loading
              ? (editingId ? "Mise à jour…" : "Publication…")
              : (editingId ? "Mettre à jour l’article" : "Publier l’article")
            }
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 rounded-full font-bold bg-gray-300 hover:bg-gray-400 text-gray-800 shadow"
            >
              Annuler la modification
            </button>
          )}
        </div>
      </form>

      <div className="space-y-6">
        {newsList.length === 0 && (
          <div className="text-gray-500 text-center">Aucune actualité publiée.</div>
        )}
        {newsList.map(news => (
          <div key={news.id} className="bg-white rounded-xl shadow flex items-center gap-5 p-4 relative">
            {news.image_url && (
              <Image
                src={news.image_url}
                alt="Illustration"
                width={80}
                height={80}
                className="h-20 w-20 object-cover rounded-lg shadow"
                style={{ objectFit: "cover", width: 80, height: 80 }}
                unoptimized={news.image_url.startsWith("data:")}
              />
            )}
            <div className="flex-1">
              <div className="font-bold text-lg text-orange-700">{news.title}</div>
              <div className="text-gray-600 text-sm line-clamp-2">{news.content}</div>
              <div className="text-xs text-gray-400 mt-1">
                {news.created_at && (
                  <>Publié le {new Date(news.created_at).toLocaleDateString("fr-FR")}</>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 absolute top-2 right-2">
              <button
                className="text-red-600 font-bold hover:text-red-900"
                title="Supprimer"
                onClick={() => handleDelete(news.id)}
              >
                ×
              </button>
              <button
                className="text-blue-600 font-bold hover:text-blue-900"
                title="Modifier"
                onClick={() => handleEdit(news)}
              >
                ✎
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
