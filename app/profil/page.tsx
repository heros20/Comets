"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User2, Mail, BadgeEuro, CheckCircle, XCircle, Pencil, Save, X, Tag } from "lucide-react";

// Types pour players/cotisations
type Player = { first_name: string; last_name: string };
type Cotisation = { prenom: string; nom: string };

export default function ProfilPage() {
  const [isLogged, setIsLogged] = useState<null | boolean>(null);
  const [user, setUser] = useState<any>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<null | "success" | "error">(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [cotisations, setCotisations] = useState<Cotisation[]>([]);
  const [passwordEdit, setPasswordEdit] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const router = useRouter();

  // Fetch profil + joueurs + cotisations
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (!res.ok) throw new Error("Not logged in");
        const json = await res.json();
        if (!json.user) throw new Error("Utilisateur non trouvé");
        setUser(json.user);
        setForm({
          email: json.user.email || "",
          first_name: json.user.first_name || "",
          last_name: json.user.last_name || "",
        });
        setIsLogged(true);
      } catch (error) {
        setIsLogged(false);
      }
    }
    fetchProfile();
    // Récupère la liste players/cotisation (adapter les routes si besoin !)
    fetch("/api/players")
      .then(r => r.json())
      .then(setPlayers)
      .catch(() => setPlayers([]));
    fetch("/api/cotisations")
      .then(r => r.json())
      .then(setCotisations)
      .catch(() => setCotisations([]));
  }, []);

  useEffect(() => {
    if (isLogged === false) {
      router.replace("/login");
    }
  }, [isLogged, router]);

  if (isLogged === null) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="text-orange-700 text-xl font-bold animate-pulse">
          Chargement du profil...
        </span>
      </div>
    );
  }
  if (!user) return null;

  // Gestion changements du form
  const handleChange = (field: string, value: string) => {
    setForm((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Sauvegarde profil
  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          password: passwordEdit ? password : undefined,
        }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erreur");
      setUser({ ...user, ...form });
      setEdit(false);
      setPassword("");
      setPasswordConfirm("");
      setPasswordEdit(false);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (e) {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEdit(false);
    setForm({
      email: user.email || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
    });
    setPassword("");
    setPasswordConfirm("");
    setPasswordEdit(false);
    setSaveStatus(null);
  };

  // Cotisation matching
  const hasCotisation = () => {
    if (!user?.first_name || !user?.last_name) return false;
    const f = user.first_name.trim().toLowerCase();
    const l = user.last_name.trim().toLowerCase();
    const matchPlayer = players.some(
      p =>
        p.first_name?.trim().toLowerCase() === f &&
        p.last_name?.trim().toLowerCase() === l
    );
    const matchCotis = cotisations.some(
      c =>
        c.prenom?.trim().toLowerCase() === f &&
        c.nom?.trim().toLowerCase() === l
    );
    return matchPlayer || matchCotis;
  };

  const categorie = user.categorie || "-";

  return (
    <main className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-extrabold text-orange-700 mb-6 text-center drop-shadow-xl">
        Mon profil joueur
      </h1>
      <div className="bg-white/95 rounded-2xl shadow-2xl px-8 py-7 flex flex-col items-center gap-4 border border-orange-100 backdrop-blur-xl">
        <div className="bg-orange-50 rounded-full w-20 h-20 flex items-center justify-center mb-1 shadow">
          <User2 size={50} className="text-orange-400" />
        </div>
        <div className="w-full flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Mail className="text-red-500" size={18} />
            <span className="font-bold text-gray-800">E-mail :</span>
            {edit ? (
              <input
                type="email"
                value={form.email}
                onChange={e => handleChange("email", e.target.value)}
                className="ml-2 px-2 py-1 rounded border border-orange-200 focus:border-red-500 w-full"
                required
                disabled={true}
              />
            ) : (
              <span className="text-gray-700 ml-2">{user.email}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <User2 className="text-orange-500" size={18} />
            <span className="font-bold text-gray-800">Prénom :</span>
            {edit ? (
              <input
                type="text"
                value={form.first_name}
                onChange={e => handleChange("first_name", e.target.value)}
                className="ml-2 px-2 py-1 rounded border border-orange-200 focus:border-red-500 w-full"
                required
                disabled={saving}
                autoComplete="given-name"
              />
            ) : (
              <span className="text-gray-700 ml-2">{user.first_name || "—"}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <User2 className="text-orange-500" size={18} />
            <span className="font-bold text-gray-800">Nom :</span>
            {edit ? (
              <input
                type="text"
                value={form.last_name}
                onChange={e => handleChange("last_name", e.target.value)}
                className="ml-2 px-2 py-1 rounded border border-orange-200 focus:border-red-500 w-full"
                required
                disabled={saving}
                autoComplete="family-name"
              />
            ) : (
              <span className="text-gray-700 ml-2">{user.last_name || "—"}</span>
            )}
          </div>

          {/* Catégorie visible */}
          <div className="flex items-center gap-2">
            <Tag className="text-orange-500" size={18} />
            <span className="font-bold text-gray-800">Catégorie :</span>
            <span className="ml-2 font-semibold px-3 py-1 rounded-lg bg-orange-100 text-orange-800 shadow text-base">
              {categorie}
            </span>
          </div>

          {/* Modifier mot de passe (expansible) */}
          {edit && (
            <div className="flex flex-col gap-1 mt-2">
              {!passwordEdit ? (
                <button
                  type="button"
                  onClick={() => setPasswordEdit(true)}
                  className="text-sm text-orange-600 hover:text-red-700 font-bold transition"
                >
                  Modifier le mot de passe ?
                </button>
              ) : (
                <>
                  <input
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="px-2 py-1 rounded border border-orange-200 focus:border-red-500 w-full"
                    autoComplete="new-password"
                    disabled={saving}
                  />
                  <input
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={passwordConfirm}
                    onChange={e => setPasswordConfirm(e.target.value)}
                    className="px-2 py-1 rounded border border-orange-200 focus:border-red-500 w-full"
                    autoComplete="new-password"
                    disabled={saving}
                  />
                  {password && passwordConfirm && password !== passwordConfirm && (
                    <span className="text-red-500 text-xs font-bold">Les mots de passe ne correspondent pas.</span>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Boutons édit/sauvegarde */}
        <div className="flex gap-3 mt-4">
          {edit ? (
            <>
              <button
                className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-bold transition disabled:opacity-50"
                onClick={handleSave}
                disabled={
                  saving ||
                  (passwordEdit && (!password || password !== passwordConfirm))
                }
              >
                <Save size={18} />
                Enregistrer
              </button>
              <button
                className="flex items-center gap-1 bg-gray-200 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-xl font-bold transition"
                onClick={handleCancel}
                disabled={saving}
              >
                <X size={18} /> Annuler
              </button>
            </>
          ) : (
            <button
              className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-bold transition"
              onClick={() => setEdit(true)}
            >
              <Pencil size={18} />
              Modifier mon profil
            </button>
          )}
        </div>

        {/* Feedback utilisateur */}
        {saveStatus === "success" && (
          <span className="text-green-600 mt-2 font-bold flex items-center gap-1">
            <CheckCircle size={16} />
            Changements enregistrés !
          </span>
        )}
        {saveStatus === "error" && (
          <span className="text-red-600 mt-2 font-bold flex items-center gap-1">
            <XCircle size={16} />
            Erreur lors de l’enregistrement…
          </span>
        )}

        {/* Cotisation */}
        <div className="w-full mt-8 flex flex-col items-center">
          {hasCotisation() ? (
            <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-xl font-bold shadow-sm">
              <CheckCircle className="text-green-600" size={20} />
              Cotisation payée
              <BadgeEuro className="ml-1 text-green-600" size={18} />
            </span>
          ) : (
            <span className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-xl font-bold shadow-sm">
              <XCircle className="text-red-600" size={20} />
              Cotisation non payée
            </span>
          )}
        </div>
      </div>
    </main>
  );
}
