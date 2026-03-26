"use client";

import { useState } from "react";
import { BarChart3, Calculator, ArrowRightLeft, CheckCircle2, AlertCircle, Info } from "lucide-react";

type Szenario = {
  typ: string;
  label: string;
  investitionskosten: number;
  wohneinheiten: number;
  hatISFP: boolean;
  hatWPB: boolean;
  hatSerSan: boolean;
  hatEEKlasse: boolean;
  ehStufe: string;
  istSelbstgenutzt: boolean;
  haushaltseinkommen: number;
};

type Ergebnis = {
  foerderfaehigeKosten: number;
  foerdersatz: number;
  foerderbetrag: number;
  aufschlaege: Record<string, number>;
  hinweise: string[];
};

const PROGRAMM_TYPEN = [
  { value: "BEG_EM_HEIZUNG", label: "KfW 458 – BEG EM Heizung" },
  { value: "BEG_EM_GEBAEUDEHUELLE", label: "BAFA – BEG EM Gebäudehülle" },
  { value: "BEG_WG", label: "KfW 261 – BEG WG Komplettsanierung" },
  { value: "STEUER_35C", label: "§ 35c EStG – Steuerbonus" },
];

const DEFAULT_SZENARIO: Szenario = {
  typ: "BEG_EM_HEIZUNG",
  label: "Szenario A",
  investitionskosten: 25000,
  wohneinheiten: 1,
  hatISFP: false,
  hatWPB: false,
  hatSerSan: false,
  hatEEKlasse: false,
  ehStufe: "55",
  istSelbstgenutzt: true,
  haushaltseinkommen: 60000,
};

function SzenarioForm({ value, onChange, label }: { value: Szenario; onChange: (s: Szenario) => void; label: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
      <h3 className="text-sm font-bold text-slate-800">{label}</h3>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Förderprogramm</label>
        <select
          value={value.typ}
          onChange={(e) => onChange({ ...value, typ: e.target.value })}
          className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
        >
          {PROGRAMM_TYPEN.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Investitionskosten (€)</label>
          <input
            type="number"
            min={0}
            value={value.investitionskosten}
            onChange={(e) => onChange({ ...value, investitionskosten: Number(e.target.value) })}
            className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Wohneinheiten</label>
          <input
            type="number"
            min={1}
            max={100}
            value={value.wohneinheiten}
            onChange={(e) => onChange({ ...value, wohneinheiten: Number(e.target.value) })}
            className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
          />
        </div>
      </div>

      {value.typ === "BEG_WG" && (
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">EH-Stufe</label>
          <select
            value={value.ehStufe}
            onChange={(e) => onChange({ ...value, ehStufe: e.target.value })}
            className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
          >
            {["40", "55", "70", "85", "DENKMAL"].map((s) => (
              <option key={s} value={s}>Effizienzhaus {s}</option>
            ))}
          </select>
        </div>
      )}

      {value.typ === "BEG_EM_HEIZUNG" && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Selbstgenutzt</label>
            <button
              onClick={() => onChange({ ...value, istSelbstgenutzt: !value.istSelbstgenutzt })}
              className={`w-full text-xs font-semibold py-2 rounded-xl border transition-colors cursor-pointer ${value.istSelbstgenutzt ? "bg-[#1B4F72] text-white border-[#1B4F72]" : "border-slate-200 text-slate-600"}`}
            >
              {value.istSelbstgenutzt ? "Ja" : "Nein"}
            </button>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Einkommen (€/Jahr)</label>
            <input
              type="number"
              min={0}
              value={value.haushaltseinkommen}
              onChange={(e) => onChange({ ...value, haushaltseinkommen: Number(e.target.value) })}
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
            />
          </div>
        </div>
      )}

      {/* Boni-Toggles */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-2">Boni</label>
        <div className="space-y-2">
          {[
            { key: "hatISFP", label: "iSFP-Bonus (+5%)", show: ["BEG_EM_GEBAEUDEHUELLE", "BEG_EM_HEIZUNG"] },
            { key: "hatWPB", label: "WPB-Bonus (+10%)", show: ["BEG_WG"] },
            { key: "hatSerSan", label: "SerSan-Bonus (+15%)", show: ["BEG_WG"] },
            { key: "hatEEKlasse", label: "EE-/NH-Klasse (+5%)", show: ["BEG_WG", "BEG_EM_HEIZUNG"] },
          ]
            .filter((b) => b.show.includes(value.typ))
            .map((bonus) => (
              <label key={bonus.key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value[bonus.key as keyof Szenario] as boolean}
                  onChange={(e) => onChange({ ...value, [bonus.key]: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-[#1B4F72] cursor-pointer"
                />
                <span className="text-xs text-slate-700">{bonus.label}</span>
              </label>
            ))}
        </div>
      </div>
    </div>
  );
}

function ErgebnisCard({ ergebnis, investitionskosten, label, isBest }: { ergebnis: Ergebnis; investitionskosten: number; label: string; isBest: boolean }) {
  const nettokosten = investitionskosten - ergebnis.foerderbetrag;
  const foerdersatzPct = Math.round(ergebnis.foerdersatz * 100);

  return (
    <div className={`rounded-2xl border p-5 space-y-4 ${isBest ? "border-[#27AE60] bg-[#EAFAF1]" : "border-slate-200 bg-white"}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">{label}</h3>
        {isBest && (
          <span className="text-[10px] font-bold text-[#27AE60] bg-white px-2 py-0.5 rounded-full border border-[#27AE60]/30">
            Beste Option
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-3 border border-slate-100">
          <div className="text-xl font-extrabold text-[#1B4F72]">
            {ergebnis.foerderbetrag.toLocaleString("de-DE")} €
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Förderbetrag</div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-slate-100">
          <div className="text-xl font-extrabold text-slate-900">
            {foerdersatzPct} %
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Fördersatz</div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-slate-100">
          <div className="text-xl font-extrabold text-slate-700">
            {ergebnis.foerderfaehigeKosten.toLocaleString("de-DE")} €
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Förderf. Kosten</div>
        </div>
        <div className={`rounded-xl p-3 border ${nettokosten > 0 ? "bg-white border-slate-100" : "bg-[#EAFAF1] border-[#27AE60]/20"}`}>
          <div className={`text-xl font-extrabold ${nettokosten > 0 ? "text-slate-900" : "text-[#27AE60]"}`}>
            {nettokosten.toLocaleString("de-DE")} €
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Nettokosten</div>
        </div>
      </div>

      {/* Aufschläge */}
      <div className="space-y-1">
        {Object.entries(ergebnis.aufschlaege).map(([key, val]) => (
          <div key={key} className="flex justify-between text-xs">
            <span className="text-slate-500 capitalize">{key}</span>
            <span className="font-semibold text-slate-700">+{Math.round(val * 100)} %</span>
          </div>
        ))}
      </div>

      {ergebnis.hinweise.length > 0 && (
        <div className="space-y-1.5">
          {ergebnis.hinweise.map((h, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-500">
              <Info size={11} className="shrink-0 mt-0.5" />
              {h}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function VergleichPage() {
  const [szenarioA, setSzenarioA] = useState<Szenario>({ ...DEFAULT_SZENARIO, label: "Szenario A", typ: "BEG_EM_HEIZUNG" });
  const [szenarioB, setSzenarioB] = useState<Szenario>({ ...DEFAULT_SZENARIO, label: "Szenario B", typ: "BEG_WG", ehStufe: "55" });
  const [ergebnisA, setErgebnisA] = useState<Ergebnis | null>(null);
  const [ergebnisB, setErgebnisB] = useState<Ergebnis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const berechnen = async () => {
    setLoading(true);
    setError("");
    try {
      const [resA, resB] = await Promise.all([
        fetch("/api/foerderrechner", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            programmTyp: szenarioA.typ,
            investitionskosten: szenarioA.investitionskosten,
            wohneinheiten: szenarioA.wohneinheiten,
            hatISFP: szenarioA.hatISFP,
            hatWPB: szenarioA.hatWPB,
            hatSerSan: szenarioA.hatSerSan,
            hatEEKlasse: szenarioA.hatEEKlasse,
            ehStufe: szenarioA.ehStufe,
            istSelbstgenutzt: szenarioA.istSelbstgenutzt,
            haushaltseinkommen: szenarioA.haushaltseinkommen,
          }),
        }),
        fetch("/api/foerderrechner", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            programmTyp: szenarioB.typ,
            investitionskosten: szenarioB.investitionskosten,
            wohneinheiten: szenarioB.wohneinheiten,
            hatISFP: szenarioB.hatISFP,
            hatWPB: szenarioB.hatWPB,
            hatSerSan: szenarioB.hatSerSan,
            hatEEKlasse: szenarioB.hatEEKlasse,
            ehStufe: szenarioB.ehStufe,
            istSelbstgenutzt: szenarioB.istSelbstgenutzt,
            haushaltseinkommen: szenarioB.haushaltseinkommen,
          }),
        }),
      ]);

      const dataA = await resA.json();
      const dataB = await resB.json();

      if (!resA.ok) throw new Error(`Szenario A: ${dataA.error}`);
      if (!resB.ok) throw new Error(`Szenario B: ${dataB.error}`);

      setErgebnisA(dataA.ergebnis);
      setErgebnisB(dataB.ergebnis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler bei der Berechnung");
    } finally {
      setLoading(false);
    }
  };

  const bestIsA = ergebnisA && ergebnisB && ergebnisA.foerderbetrag >= ergebnisB.foerderbetrag;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Förder-Vergleichstool</h1>
        <p className="text-sm text-slate-500 mt-0.5">Side-by-Side-Vergleich verschiedener Förderkombinationen für dasselbe Projekt</p>
      </div>

      {/* Kumulierungshinweis */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 leading-relaxed">
          <strong>Kumulierungsregel:</strong> Maximale Förderquote aus öffentlichen Mitteln: 60 %. BEG und § 35c EStG können nicht für dieselbe Maßnahme kombiniert werden.
        </p>
      </div>

      {/* Szenarien-Konfiguration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SzenarioForm value={szenarioA} onChange={setSzenarioA} label="Szenario A" />
        <div className="relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 md:hidden">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
              <ArrowRightLeft size={14} className="text-slate-400" />
            </div>
          </div>
          <SzenarioForm value={szenarioB} onChange={setSzenarioB} label="Szenario B" />
        </div>
      </div>

      <button
        onClick={berechnen}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[#1B4F72] hover:bg-[#154360] text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Berechnung läuft …
          </>
        ) : (
          <>
            <Calculator size={15} />
            Szenarien vergleichen
          </>
        )}
      </button>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* Ergebnisse */}
      {ergebnisA && ergebnisB && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-[#1B4F72]" />
            <h2 className="text-sm font-bold text-slate-800">Vergleichsergebnis</h2>
          </div>

          {/* Differenz-Banner */}
          <div className="bg-[#EBF5FB] border border-[#1B4F72]/20 rounded-xl px-5 py-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500 mb-0.5">
                {bestIsA ? "Szenario A" : "Szenario B"} bringt mehr Förderung
              </div>
              <div className="text-2xl font-extrabold text-[#1B4F72]">
                +{Math.abs(ergebnisA.foerderbetrag - ergebnisB.foerderbetrag).toLocaleString("de-DE")} €
              </div>
            </div>
            <CheckCircle2 size={28} className="text-[#27AE60]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ErgebnisCard
              ergebnis={ergebnisA}
              investitionskosten={szenarioA.investitionskosten}
              label="Szenario A"
              isBest={!!bestIsA}
            />
            <ErgebnisCard
              ergebnis={ergebnisB}
              investitionskosten={szenarioB.investitionskosten}
              label="Szenario B"
              isBest={!bestIsA}
            />
          </div>
        </div>
      )}
    </div>
  );
}
