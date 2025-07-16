"use client";
import { useState, useEffect, useRef } from "react";
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
async function deleteNews(id: number) {
  await fetch(`/api/news/${id}`, { method: "DELETE" });
}

export default function NewsAdmin() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", content: "", image_url: "", legend: "" });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    setLoading(true);
    await addNews(form);
    setForm({ title: "", content: "", image_url: "", legend: "" });
    setLoading(false);
    fetchNews().then(setNewsList);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Supprimer cet article ?")) return;
    await deleteNews(id);
    setNewsList(list => list.filter(n => n.id !== id));
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-700 mb-6">Actualités / Articles du club</h2>
      <form onSubmit={handleSubmit} className="bg-orange-50 p-5 rounded-xl mb-8 shadow space-y-4">
        <div>
          <label className="block font-semibold mb-1">Titre de l’article</label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={form.title}
            required
            maxLength={120}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Texte de l’article</label>
          <textarea
            className="border rounded px-3 py-2 w-full min-h-[90px]"
            value={form.content}
            required
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Image principale (upload JPG/PNG, &lt; 350Ko)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            className="border rounded px-3 py-2 w-full"
          />
          {uploading && <div className="text-orange-600 mt-2">Compression et upload en cours…</div>}
          {form.image_url && (
            <img src={form.image_url} alt="Aperçu" className="mt-2 h-24 rounded shadow" />
          )}
          <input
            type="text"
            className="mt-2 border rounded px-3 py-1 w-full"
            placeholder="Légende photo (optionnel)"
            value={form.legend}
            onChange={e => setForm(f => ({ ...f, legend: e.target.value }))}
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 rounded-full font-bold bg-gradient-to-r from-orange-500 to-red-600 text-white shadow hover:from-orange-600 hover:to-red-700 transition"
          disabled={loading}
        >
          {loading ? "Publication…" : "Publier l’article"}
        </button>
      </form>

      <div className="space-y-6">
        {newsList.length === 0 && (
          <div className="text-gray-500 text-center">Aucune actualité publiée.</div>
        )}
        {newsList.map(news => (
          <div key={news.id} className="bg-white rounded-xl shadow flex items-center gap-5 p-4 relative">
            {news.image_url && (
              <img src={news.image_url} alt="Illustration" className="h-20 w-20 object-cover rounded-lg shadow" />
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
            <button
              className="absolute top-2 right-2 text-red-600 font-bold hover:text-red-900"
              title="Supprimer"
              onClick={() => handleDelete(news.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
