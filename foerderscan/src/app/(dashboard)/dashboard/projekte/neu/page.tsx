"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";

type MassnahmeArt =
  | "GEBAEUDEHUELLE"
  | "ANLAGENTECHNIK"
  | "HEIZUNG"
  | "EH_KOMPLETTSANIERUNG"
  | "FACHPLANUNG"
  | "ENERGIEBERATUNG";

interface MassnahmeInput {
  massnahmenart: MassnahmeArt;
  investitionskosten: string;
  beschreibung: string;
}

const MASSNAHME_OPTIONEN: { value: MassnahmeArt; label: string }[] = [
  { value: "GEBAEUDEHUELLE", label: "Gebäudehülle (Dämmung, Fenster, Türen)" },
  { value: "ANLAGENTECHNIK", label: "Anlagentechnik (Lüftung, Solar)" },
  { value: "HEIZUNG", label: "Heizungsanlage (Wärmepumpe, Pellet, …)" },
  { value: "EH_KOMPLETTSANIERUNG", label: "Effizienzhaus – Komplettsanierung" },
  { value: "FACHPLANUNG", label: "Fachplanung & Baubegleitung" },
  { value: "ENERGIEBERATUNG", label: "Energieberatung (iSFP / EBW)" },
];

const GEBAEUDETYP_OPTIONEN = [
  { value: "EFH", label: "Einfamilienhaus" },
  { value: "ZFH", label: "Zweifamilienhaus" },
  { value: "MFH", label: "Mehrfamilienhaus (≥ 3 WE)" },
  { value: "NWG", label: "Nichtwohngebäude" },
];

export default function NeuesProjektPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
  });

  const [massnahmen, setMassnahmen] = useState<MassnahmeInput[]>([
    { massnahmenart: "HEIZUNG", investitionskosten: "", beschreibung: "" },
  ]);

  const setField = (key: keyof typeof form, val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const addMassnahme = () =>
    setMassnahmen((p) => [...p, { massnahmenart: "GEBAEUDEHUELLE", investitionskosten: "", beschreibung: "" }]);

  const removeMassnahme = (i: number) =>
    setMassnahmen((p) => p.filter((_, idx) => idx !== i));

  const updateMassnahme = (i: number, key: keyof MassnahmeInput, val: string) =>
    setMassnahmen((p) => p.map((m, idx) => (idx === i ? { ...m, [key]: val } : m)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/projekte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          baujahr: form.baujahr ? Number(form.baujahr) : null,
          massnahmen: massnahmen.map((m) => ({
            ...m,
            investitionskosten: m.investitionskosten ? Number(m.investitionskosten) : null,
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Fehler beim Anlegen");
      }
      const data = await res.json();
      router.push(`/dashboard/projekte/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/projekte"
          className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft size={15} />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Neues Projekt</h1>
          <p className="text-sm text-slate-500 mt-0.5">Sanierungsprojekt anlegen und Förderung ermitteln</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Projektinformationen */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800">Projektinformationen</h2>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Projekttitel *</label>
            <input
              required
              type="text"
              value={form.titel}
              onChange={(e) => setField("titel", e.target.value)}
              placeholder="z. B. Sanierung EFH Musterstraße 1"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Kundenname *</label>
              <input
                required
                type="text"
                value={form.kundeName}
                onChange={(e) => setField("kundeName", e.target.value)}
                placeholder="Max Mustermann"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">E-Mail Kunde</label>
              <input
                type="email"
                value={form.kundeEmail}
                onChange={(e) => setField("kundeEmail", e.target.value)}
                placeholder="max@muster.de"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Gebäudedaten */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-800">Gebäudedaten</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Straße & Hausnummer</label>
              <input
                type="text"
                value={form.strasse}
                onChange={(e) => setField("strasse", e.target.value)}
                placeholder="Musterstraße 1"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">PLZ</label>
                <input
                  type="text"
                  value={form.plz}
                  onChange={(e) => setField("plz", e.target.value)}
                  placeholder="12345"
                  maxLength={5}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Ort</label>
                <input
                  type="text"
                  value={form.ort}
                  onChange={(e) => setField("ort", e.target.value)}
                  placeholder="Berlin"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Gebäudetyp</label>
              <select
                value={form.gebaeudetyp}
                onChange={(e) => setField("gebaeudetyp", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-colors bg-white cursor-pointer"
              >
                {GEBAEUDETYP_OPTIONEN.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Baujahr</label>
              <input
                type="number"
                value={form.baujahr}
                onChange={(e) => setField("baujahr", e.target.value)}
                placeholder="1985"
                min={1800}
                max={2024}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Maßnahmen */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">Sanierungsmaßnahmen</h2>
            <button
              type="button"
              onClick={addMassnahme}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#1B4F72] hover:text-[#154360] cursor-pointer transition-colors"
            >
              <Plus size={13} /> Maßnahme hinzufügen
            </button>
          </div>

          {massnahmen.map((m, i) => (
            <div key={i} className="border border-slate-100 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Maßnahme {i + 1}</span>
                {massnahmen.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMassnahme(i)}
                    className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Art der Maßnahme</label>
                  <select
                    value={m.massnahmenart}
                    onChange={(e) => updateMassnahme(i, "massnahmenart", e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-colors bg-white cursor-pointer"
                  >
                    {MASSNAHME_OPTIONEN.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Investitionskosten (€)</label>
                  <input
                    type="number"
                    value={m.investitionskosten}
                    onChange={(e) => updateMassnahme(i, "investitionskosten", e.target.value)}
                    placeholder="25000"
                    min={0}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Notizen zur Maßnahme</label>
                <input
                  type="text"
                  value={m.beschreibung}
                  onChange={(e) => updateMassnahme(i, "beschreibung", e.target.value)}
                  placeholder="z. B. Luft-Wasser-Wärmepumpe 10 kW"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-colors"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Notizen */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <label className="text-xs font-semibold text-slate-600 mb-1 block">Interne Notizen</label>
          <textarea
            value={form.notizen}
            onChange={(e) => setField("notizen", e.target.value)}
            rows={3}
            placeholder="Hinweise, Besonderheiten, nächste Schritte..."
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-colors resize-none"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3 pb-6">
          <Link
            href="/dashboard/projekte"
            className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold py-3 rounded-xl transition-colors text-center cursor-pointer"
          >
            Abbrechen
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#1B4F72] hover:bg-[#154360] disabled:opacity-60 text-white text-sm font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            {loading ? "Wird angelegt…" : "Projekt anlegen"}
          </button>
        </div>
      </form>
    </div>
  );
}
