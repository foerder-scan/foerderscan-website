"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const FOERDERGEBER = ["KFW", "BAFA", "LAND", "KOMMUNE", "EU"];
const FOERDERSEGMENT = ["BEG_WG", "BEG_EM", "BEG_KFN", "EBW", "LANDESFOERDERUNG", "STEUERLICH", "SONSTIGE"];
const FOERDERART = ["ZUSCHUSS", "TILGUNGSZUSCHUSS", "KREDIT", "STEUERBONUS", "KOMBINATION"];
const STATUS = ["AKTIV", "AUSLAUFEND", "ANGEKUENDIGT", "BEENDET"];

interface Props {
  initial?: {
    id: string;
    name: string;
    kurzname: string | null;
    foerdergeber: string;
    foerdersegment: string;
    foerderart: string;
    basisfördersatz: number;
    maxFoerdersatz: number;
    maxFoerderfaehigeKosten: number | null;
    status: string;
    beschreibung: string | null;
    quellUrl: string | null;
  };
}

export default function ProgrammForm({ initial }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    kurzname: initial?.kurzname ?? "",
    foerdergeber: initial?.foerdergeber ?? "KFW",
    foerdersegment: initial?.foerdersegment ?? "BEG_WG",
    foerderart: initial?.foerderart ?? "ZUSCHUSS",
    basisfördersatz: initial ? (Number(initial.basisfördersatz) * 100).toFixed(0) : "15",
    maxFoerdersatz: initial ? (Number(initial.maxFoerdersatz) * 100).toFixed(0) : "20",
    maxFoerderfaehigeKosten: initial?.maxFoerderfaehigeKosten?.toString() ?? "",
    status: initial?.status ?? "AKTIV",
    beschreibung: initial?.beschreibung ?? "",
    quellUrl: initial?.quellUrl ?? "",
  });

  const isEdit = !!initial;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const body = {
      ...form,
      basisfördersatz: Number(form.basisfördersatz) / 100,
      maxFoerdersatz: Number(form.maxFoerdersatz) / 100,
      maxFoerderfaehigeKosten: form.maxFoerderfaehigeKosten ? Number(form.maxFoerderfaehigeKosten) : null,
    };

    const url = isEdit ? `/api/admin/programme/${initial!.id}` : "/api/admin/programme";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);
    if (res.ok) router.push("/dashboard/admin/programme");
  }

  const field = (label: string, key: keyof typeof form, type = "text", placeholder = "") => (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2E86C1] focus:border-transparent"
      />
    </div>
  );

  const select = (label: string, key: keyof typeof form, options: string[]) => (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      <select
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2E86C1] focus:border-transparent bg-white"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("Programmname *", "name", "text", "z.B. BEG Einzelmaßnahmen – Zuschuss")}
        {field("Kurzname", "kurzname", "text", "z.B. BEG EM")}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {select("Fördergeber *", "foerdergeber", FOERDERGEBER)}
        {select("Segment *", "foerdersegment", FOERDERSEGMENT)}
        {select("Förderart *", "foerderart", FOERDERART)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {field("Basis-Fördersatz % *", "basisfördersatz", "number", "15")}
        {field("Max. Fördersatz % *", "maxFoerdersatz", "number", "70")}
        {field("Max. förderf. Kosten (€)", "maxFoerderfaehigeKosten", "number", "30000")}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {select("Status *", "status", STATUS)}
        {field("Quell-URL", "quellUrl", "url", "https://www.kfw.de/...")}
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Beschreibung</label>
        <textarea
          rows={4}
          value={form.beschreibung}
          onChange={(e) => setForm((f) => ({ ...f, beschreibung: e.target.value }))}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2E86C1] focus:border-transparent resize-none"
          placeholder="Kurze Beschreibung des Programms..."
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-[#1B4F72] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#154360] transition-colors cursor-pointer disabled:opacity-60"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {isEdit ? "Änderungen speichern" : "Programm anlegen"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/admin/programme")}
          className="text-sm text-slate-500 hover:text-slate-700 px-4 py-2.5 cursor-pointer"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
