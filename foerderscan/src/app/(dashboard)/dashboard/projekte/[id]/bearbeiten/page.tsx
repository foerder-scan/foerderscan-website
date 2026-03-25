"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Trash2, AlertTriangle } from "lucide-react";

const STATUS_OPTIONEN = [
  { value: "RECHERCHE", label: "Recherche" },
  { value: "ANTRAG_GESTELLT", label: "Antrag gestellt" },
  { value: "ZUGESAGT", label: "Zugesagt" },
  { value: "ABGERECHNET", label: "Abgerechnet" },
  { value: "ABGEBROCHEN", label: "Abgebrochen" },
];

const GEBAEUDETYP_OPTIONEN = [
  { value: "EFH", label: "Einfamilienhaus" },
  { value: "ZFH", label: "Zweifamilienhaus" },
  { value: "MFH", label: "Mehrfamilienhaus (≥ 3 WE)" },
  { value: "NWG", label: "Nichtwohngebäude" },
];

export default function ProjektBearbeitenPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    titel: "",
    kundeName: "",
    kundeEmail: "",
    strasse: "",
    plz: "",
    ort: "",
    gebaeudetyp: "EFH",
    baujahr: "",
    notizen: "",
    status: "RECHERCHE",
  });

  // Load existing project
  useEffect(() => {
    fetch(`/api/projekte/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return; }
        setForm({
          titel: data.titel ?? "",
          kundeName: data.kundeName ?? "",
          kundeEmail: data.kundeEmail ?? "",
          strasse: data.strasse ?? "",
          plz: data.plz ?? "",
          ort: data.ort ?? "",
          gebaeudetyp: data.gebaeudetyp ?? "EFH",
          baujahr: data.baujahr ? String(data.baujahr) : "",
          notizen: data.notizen ?? "",
          status: data.status ?? "RECHERCHE",
        });
      })
      .catch(() => setError("Projekt konnte nicht geladen werden"))
      .finally(() => setLoading(false));
  }, [id]);

  const setField = (key: keyof typeof form, val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/projekte/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          baujahr: form.baujahr ? Number(form.baujahr) : null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Speichern fehlgeschlagen");
      }
      router.push(`/dashboard/projekte/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetch(`/api/projekte/${id}`, { method: "DELETE" });
      router.push("/dashboard/projekte");
    } catch {
      setError("Löschen fehlgeschlagen");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-slate-400" />
      </div>
    );
  }

  const inputClass = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-colors";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/dashboard/projekte/${id}`}
          className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft size={15} />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Projekt bearbeiten</h1>
          <p className="text-sm text-slate-500 mt-0.5">Änderungen werden sofort gespeichert</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800">Projektstatus</h2>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONEN.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setField("status", s.value)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  form.status === s.value
                    ? "bg-[#1B4F72] text-white border-[#1B4F72]"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projektinformationen */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800">Projektinformationen</h2>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Projekttitel *</label>
            <input required type="text" value={form.titel} onChange={(e) => setField("titel", e.target.value)} placeholder="z. B. Sanierung EFH Musterstraße" className={inputClass} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Kundenname *</label>
              <input required type="text" value={form.kundeName} onChange={(e) => setField("kundeName", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">E-Mail Kunde</label>
              <input type="email" value={form.kundeEmail} onChange={(e) => setField("kundeEmail", e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Gebäudedaten */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800">Gebäudedaten</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Straße & Hausnummer</label>
              <input type="text" value={form.strasse} onChange={(e) => setField("strasse", e.target.value)} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">PLZ</label>
                <input type="text" maxLength={5} value={form.plz} onChange={(e) => setField("plz", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Ort</label>
                <input type="text" value={form.ort} onChange={(e) => setField("ort", e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Gebäudetyp</label>
              <select value={form.gebaeudetyp} onChange={(e) => setField("gebaeudetyp", e.target.value)} className={`${inputClass} bg-white cursor-pointer`}>
                {GEBAEUDETYP_OPTIONEN.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Baujahr</label>
              <input type="number" value={form.baujahr} onChange={(e) => setField("baujahr", e.target.value)} min={1800} max={2024} placeholder="1985" className={inputClass} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Interne Notizen</label>
            <textarea rows={3} value={form.notizen} onChange={(e) => setField("notizen", e.target.value)} placeholder="Hinweise, Besonderheiten…" className={`${inputClass} resize-none`} />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="flex gap-3 pb-6">
          <Link
            href={`/dashboard/projekte/${id}`}
            className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold py-3 rounded-xl transition-colors text-center cursor-pointer"
          >
            Abbrechen
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-[#1B4F72] hover:bg-[#154360] disabled:opacity-60 text-white text-sm font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Wird gespeichert…" : "Speichern"}
          </button>
        </div>
      </form>

      {/* Delete zone */}
      <div className="bg-white rounded-2xl border border-red-100 p-5 mb-6">
        <h3 className="text-sm font-bold text-red-700 mb-1">Projekt löschen</h3>
        <p className="text-xs text-slate-500 mb-3">
          Alle Maßnahmen und Förderungen dieses Projekts werden unwiderruflich gelöscht.
        </p>
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-2 text-xs font-semibold text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Trash2 size={13} /> Projekt löschen
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-100 px-3 py-2 rounded-xl">
              <AlertTriangle size={12} /> Wirklich löschen?
            </div>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
            >
              {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
              {deleting ? "Wird gelöscht…" : "Ja, löschen"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              Abbrechen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
