"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Home,
  Building2,
  Zap,
  Flame,
  Wind,
  Sun,
  Droplets,
  ChevronRight,
  Download,
  RefreshCw,
  Info,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

const MASSNAHME_TO_ENUM: Record<string, string[]> = {
  komplettsanierung: ["EH_KOMPLETTSANIERUNG"],
  heizung: ["HEIZUNG"],
  daemmung: ["GEBAEUDEHUELLE"],
  fenster: ["GEBAEUDEHUELLE"],
  lueftung: ["ANLAGENTECHNIK"],
  solar: ["ANLAGENTECHNIK"],
};

interface DbProgramm {
  id: string;
  name: string;
  foerdergeber: string;
  foerderart: string;
  effektivSatz: number;
  maxFoerderfaehigeKosten: number | null;
  quellUrl: string | null;
  aktiveBoni: string[];
}

type Gebaeudetyp = "EFH" | "ZFH" | "MFH" | "NWG";
type Massnahme = "komplettsanierung" | "heizung" | "daemmung" | "fenster" | "lueftung" | "solar";

interface BerechnungsInput {
  gebaeudetyp: Gebaeudetyp;
  baujahr: number;
  massnahme: Massnahme;
  investition: number;
  boniSerienSanierung: boolean;
  boniEEKlasse: boolean;
  boniNiedrigEinkommen: boolean;
  boniErneuerbareEnergie: boolean;
}

interface FoerderErgebnis {
  programm: string;
  foerdergeber: string;
  art: string;
  foerdersatz: number;
  maxFoerdersumme: number;
  berechneterBetrag: number;
  kostendeckel: number;
  hinweis?: string;
  bedingung?: string;
}

// ─── Calculation Logic ────────────────────────────────────────────────────────

function berechneForederung(input: BerechnungsInput): FoerderErgebnis[] {
  const ergebnisse: FoerderErgebnis[] = [];
  const inv = input.investition;

  if (input.massnahme === "komplettsanierung") {
    // KfW 261 – Bundesförderung Effizientes Gebäude
    const kostendeckel = input.gebaeudetyp === "EFH" || input.gebaeudetyp === "ZFH" ? 150000 : 150000;
    const basis = Math.min(inv, kostendeckel);
    let satz = 0.15;
    if (input.boniSerienSanierung) satz += 0.15;
    if (input.boniEEKlasse) satz += 0.05;
    satz = Math.min(satz, 0.35);
    ergebnisse.push({
      programm: "KfW 261 – BEG Wohngebäude",
      foerdergeber: "KfW",
      art: "Tilgungszuschuss",
      foerdersatz: satz,
      maxFoerdersumme: kostendeckel,
      berechneterBetrag: Math.round(basis * satz),
      kostendeckel,
      hinweis: "Antrag vor Baubeginn stellen",
      bedingung: input.boniSerienSanierung ? "Serieller Sanierungsfahrplan (iSFP) nachgewiesen" : undefined,
    });
  }

  if (input.massnahme === "heizung") {
    // BEG EM – Heizungsförderung
    const kostendeckel = 30000;
    const basis = Math.min(inv, kostendeckel);
    let satz = 0.30;
    if (input.boniErneuerbareEnergie) satz += 0.05; // Klimageschwindigkeitsbonus
    if (input.boniNiedrigEinkommen) satz += 0.30; // Einkommensbonus
    satz = Math.min(satz, 0.70);
    ergebnisse.push({
      programm: "BAFA BEG EM – Heizungsförderung",
      foerdergeber: "BAFA",
      art: "Zuschuss",
      foerdersatz: satz,
      maxFoerdersumme: kostendeckel,
      berechneterBetrag: Math.round(basis * satz),
      kostendeckel,
      hinweis: "Förderung gilt für Wärmepumpen, Pellet- und Solarthermie",
      bedingung: input.boniNiedrigEinkommen ? "Zu versteuerndes Haushaltseinkommen ≤ 40.000 €" : undefined,
    });

    // § 35c EStG
    if (!input.boniNiedrigEinkommen) {
      ergebnisse.push({
        programm: "§ 35c EStG – Steuerliche Förderung",
        foerdergeber: "Finanzamt",
        art: "Steuerbonus",
        foerdersatz: 0.20,
        maxFoerdersumme: 40000,
        berechneterBetrag: Math.round(Math.min(inv, 200000) * 0.20),
        kostendeckel: 200000,
        hinweis: "Alternativ zur BAFA-Förderung (keine Kumulierung möglich)",
      });
    }
  }

  if (input.massnahme === "daemmung") {
    // BEG EM Gebäudehülle
    const kostendeckel = 60000;
    const basis = Math.min(inv, kostendeckel);
    const satz = 0.15;
    ergebnisse.push({
      programm: "BAFA BEG EM – Gebäudehülle",
      foerdergeber: "BAFA",
      art: "Zuschuss",
      foerdersatz: satz,
      maxFoerdersumme: kostendeckel,
      berechneterBetrag: Math.round(basis * satz),
      kostendeckel,
      hinweis: "Fachplaner-Bestätigung (Energieberater) erforderlich",
    });
  }

  if (input.massnahme === "fenster") {
    const kostendeckel = 60000;
    const basis = Math.min(inv, kostendeckel);
    ergebnisse.push({
      programm: "BAFA BEG EM – Fenster & Türen",
      foerdergeber: "BAFA",
      art: "Zuschuss",
      foerdersatz: 0.15,
      maxFoerdersumme: kostendeckel,
      berechneterBetrag: Math.round(basis * 0.15),
      kostendeckel,
    });
  }

  if (input.massnahme === "lueftung") {
    const kostendeckel = 60000;
    const basis = Math.min(inv, kostendeckel);
    ergebnisse.push({
      programm: "BAFA BEG EM – Anlagentechnik",
      foerdergeber: "BAFA",
      art: "Zuschuss",
      foerdersatz: 0.15,
      maxFoerdersumme: kostendeckel,
      berechneterBetrag: Math.round(basis * 0.15),
      kostendeckel,
      hinweis: "Gilt für Lüftungsanlagen mit Wärmerückgewinnung",
    });
  }

  if (input.massnahme === "solar") {
    ergebnisse.push({
      programm: "KfW 270 – Erneuerbare Energien",
      foerdergeber: "KfW",
      art: "Kredit",
      foerdersatz: 0,
      maxFoerdersumme: 150000000,
      berechneterBetrag: 0,
      kostendeckel: 150000000,
      hinweis: "Zinsgünstiger Kredit bis 150 Mio. €. Förderrechner zeigt nur direkte Zuschüsse.",
    });
  }

  return ergebnisse;
}

// ─── UI Components ────────────────────────────────────────────────────────────

const GEBAEUDE: { value: Gebaeudetyp; label: string; sub: string; icon: React.ElementType }[] = [
  { value: "EFH", label: "Einfamilienhaus", sub: "1–2 Wohneinheiten", icon: Home },
  { value: "ZFH", label: "Zweifamilienhaus", sub: "2 Wohneinheiten", icon: Home },
  { value: "MFH", label: "Mehrfamilienhaus", sub: "≥ 3 Wohneinheiten", icon: Building2 },
  { value: "NWG", label: "Nichtwohngebäude", sub: "Gewerbe / öffentlich", icon: Building2 },
];

const MASSNAHMEN: { value: Massnahme; label: string; icon: React.ElementType; color: string }[] = [
  { value: "komplettsanierung", label: "Komplettsanierung", icon: Zap, color: "text-[#1B4F72]" },
  { value: "heizung", label: "Heizungsanlage", icon: Flame, color: "text-orange-500" },
  { value: "daemmung", label: "Dämmung", icon: Wind, color: "text-[#27AE60]" },
  { value: "fenster", label: "Fenster & Türen", icon: Home, color: "text-[#2E86C1]" },
  { value: "lueftung", label: "Lüftung", icon: Droplets, color: "text-cyan-500" },
  { value: "solar", label: "Solaranlage", icon: Sun, color: "text-amber-500" },
];

const FOERDERGEBER_COLOR: Record<string, string> = {
  KfW: "bg-blue-50 text-blue-700 border-blue-100",
  BAFA: "bg-[#EBF5FB] text-[#1B4F72] border-blue-100",
  Finanzamt: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

function formatEur(val: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(val);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FoerderrechnerPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [input, setInput] = useState<BerechnungsInput>({
    gebaeudetyp: "EFH",
    baujahr: 1990,
    massnahme: "heizung",
    investition: 25000,
    boniSerienSanierung: false,
    boniEEKlasse: false,
    boniNiedrigEinkommen: false,
    boniErneuerbareEnergie: true,
  });

  const [dbProgramme, setDbProgramme] = useState<DbProgramm[]>([]);
  const [dbLoading, setDbLoading] = useState(false);

  const ergebnisse = berechneForederung(input);
  const gesamtFoerderung = ergebnisse.reduce((sum, e) => sum + e.berechneterBetrag, 0);
  const gesamtFoerdersatz = input.investition > 0 ? gesamtFoerderung / input.investition : 0;

  // Fetch DB programs when entering step 3
  useEffect(() => {
    if (step !== 3) return;
    setDbLoading(true);
    fetch("/api/matching", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gebaeudetyp: input.gebaeudetyp,
        massnahmenarten: MASSNAHME_TO_ENUM[input.massnahme] ?? [],
        hatISFP: input.boniSerienSanierung,
        hatEEKlasse: input.boniEEKlasse,
      }),
    })
      .then((r) => r.json())
      .then((d) => setDbProgramme(d.results ?? []))
      .catch(() => setDbProgramme([]))
      .finally(() => setDbLoading(false));
  }, [step, input.gebaeudetyp, input.massnahme, input.boniSerienSanierung, input.boniEEKlasse]);

  const reset = useCallback(() => {
    setStep(1);
    setInput({
      gebaeudetyp: "EFH",
      baujahr: 1990,
      massnahme: "heizung",
      investition: 25000,
      boniSerienSanierung: false,
      boniEEKlasse: false,
      boniNiedrigEinkommen: false,
      boniErneuerbareEnergie: true,
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Förderrechner</h1>
          <p className="text-sm text-slate-500 mt-0.5">Passende BEG-Förderprogramme in Echtzeit berechnen</p>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <RefreshCw size={13} /> Zurücksetzen
        </button>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => setStep(s as 1 | 2 | 3)}
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors cursor-pointer ${
                step === s
                  ? "bg-[#1B4F72] text-white"
                  : step > s
                  ? "bg-[#27AE60] text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {step > s ? <CheckCircle2 size={14} /> : s}
            </button>
            <span className={`text-xs font-semibold ${step === s ? "text-slate-800" : "text-slate-400"}`}>
              {s === 1 ? "Gebäude" : s === 2 ? "Maßnahme & Investition" : "Ergebnis"}
            </span>
            {s < 3 && <ChevronRight size={14} className="text-slate-300" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Step 1: Gebäude */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
              <h2 className="text-sm font-bold text-slate-800">Gebäudedaten</h2>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-2 block">Gebäudetyp</label>
                <div className="grid grid-cols-2 gap-3">
                  {GEBAEUDE.map((g) => {
                    const Icon = g.icon;
                    const active = input.gebaeudetyp === g.value;
                    return (
                      <button
                        key={g.value}
                        onClick={() => setInput((p) => ({ ...p, gebaeudetyp: g.value }))}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          active
                            ? "border-[#1B4F72] bg-[#EBF5FB]"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? "bg-[#1B4F72]" : "bg-slate-100"}`}>
                          <Icon size={15} className={active ? "text-white" : "text-slate-400"} />
                        </div>
                        <div>
                          <div className={`text-xs font-semibold ${active ? "text-[#1B4F72]" : "text-slate-700"}`}>{g.label}</div>
                          <div className="text-[10px] text-slate-400">{g.sub}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-2 block">
                  Baujahr: <span className="text-slate-900">{input.baujahr}</span>
                </label>
                <input
                  type="range"
                  min={1900}
                  max={2023}
                  step={1}
                  value={input.baujahr}
                  onChange={(e) => setInput((p) => ({ ...p, baujahr: Number(e.target.value) }))}
                  className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#1B4F72]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1900</span><span>1960</span><span>1990</span><span>2010</span><span>2023</span>
                </div>
                {input.baujahr < 1979 && (
                  <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                    <AlertCircle size={12} /> Gebäude vor 1979: Erhöhte Förderfähigkeit möglich
                  </p>
                )}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-[#1B4F72] hover:bg-[#154360] text-white text-sm font-semibold py-3 rounded-xl transition-colors cursor-pointer"
              >
                Weiter zur Maßnahme
              </button>
            </div>
          )}

          {/* Step 2: Maßnahme & Investition */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
              <h2 className="text-sm font-bold text-slate-800">Sanierungsmaßnahme</h2>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-2 block">Welche Maßnahme planen Sie?</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {MASSNAHMEN.map((m) => {
                    const Icon = m.icon;
                    const active = input.massnahme === m.value;
                    return (
                      <button
                        key={m.value}
                        onClick={() => setInput((p) => ({ ...p, massnahme: m.value }))}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          active
                            ? "border-[#1B4F72] bg-[#EBF5FB]"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <Icon size={14} className={active ? "text-[#1B4F72]" : m.color} />
                        <span className={`text-xs font-semibold ${active ? "text-[#1B4F72]" : "text-slate-700"}`}>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-2 block">
                  Investitionskosten:{" "}
                  <span className="text-slate-900">{formatEur(input.investition)}</span>
                </label>
                <input
                  type="range"
                  min={5000}
                  max={200000}
                  step={1000}
                  value={input.investition}
                  onChange={(e) => setInput((p) => ({ ...p, investition: Number(e.target.value) }))}
                  className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#1B4F72]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>5 T€</span><span>50 T€</span><span>100 T€</span><span>150 T€</span><span>200 T€</span>
                </div>
              </div>

              {/* Boni */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-3 block">Förderboni (falls zutreffend)</label>
                <div className="space-y-2">
                  {[
                    { key: "boniErneuerbareEnergie" as const, label: "Klimageschwindigkeitsbonus (+5%)", hint: "Austausch Öl-/Gasheizung bis 31.12.2028" },
                    { key: "boniNiedrigEinkommen" as const, label: "Einkommensbonus (+30%)", hint: "Haushaltseinkomm ≤ 40.000 €/Jahr" },
                    { key: "boniSerienSanierung" as const, label: "Seriensanierungsbonus (+15%)", hint: "Serieller Sanierungsfahrplan (iSFP)" },
                    { key: "boniEEKlasse" as const, label: "EE-Klasse Bonus (+5%)", hint: "Nachweis Erneuerbare-Energien-Klasse" },
                  ].map((b) => (
                    <label key={b.key} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={input[b.key]}
                        onChange={(e) => setInput((p) => ({ ...p, [b.key]: e.target.checked }))}
                        className="mt-0.5 accent-[#1B4F72] cursor-pointer"
                      />
                      <div>
                        <div className="text-xs font-semibold text-slate-800">{b.label}</div>
                        <div className="text-[11px] text-slate-500">{b.hint}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Zurück
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-[#1B4F72] hover:bg-[#154360] text-white text-sm font-semibold py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Förderung berechnen
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Ergebnisse */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-slate-800">Passende Förderprogramme</h2>
                  <span className="text-xs text-slate-500">{ergebnisse.length} Programme gefunden</span>
                </div>

                {ergebnisse.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle size={32} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Keine direkten Zuschüsse für diese Kombination.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ergebnisse.map((e, i) => (
                      <div key={i} className="border border-slate-100 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="text-sm font-bold text-slate-900">{e.programm}</div>
                            {e.bedingung && (
                              <div className="text-[11px] text-amber-600 mt-0.5 flex items-center gap-1">
                                <AlertCircle size={10} /> {e.bedingung}
                              </div>
                            )}
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${FOERDERGEBER_COLOR[e.foerdergeber] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                            {e.foerdergeber}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mt-3">
                          <div>
                            <div className="text-[10px] text-slate-400">Förderart</div>
                            <div className="text-xs font-semibold text-slate-700">{e.art}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400">Fördersatz</div>
                            <div className="text-xs font-semibold text-slate-700">
                              {e.foerdersatz > 0 ? `${(e.foerdersatz * 100).toFixed(0)} %` : "–"}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400">Förderbetrag</div>
                            <div className="text-sm font-extrabold text-[#27AE60]">
                              {e.berechneterBetrag > 0 ? formatEur(e.berechneterBetrag) : "Kredit"}
                            </div>
                          </div>
                        </div>
                        {e.hinweis && (
                          <div className="mt-2 flex items-start gap-1.5 text-[11px] text-slate-500">
                            <Info size={11} className="mt-0.5 shrink-0" /> {e.hinweis}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DB Programs from live database */}
              {(dbLoading || dbProgramme.length > 0) && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-slate-800">Live aus Ihrer Förderdatenbank</h2>
                    {dbLoading && <Loader2 size={14} className="animate-spin text-slate-400" />}
                  </div>
                  {!dbLoading && dbProgramme.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-4">Keine weiteren Programme in der Datenbank.</p>
                  )}
                  {!dbLoading && dbProgramme.length > 0 && (
                    <div className="space-y-2">
                      {dbProgramme.slice(0, 5).map((p) => (
                        <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="text-sm font-semibold text-slate-800 truncate">{p.name}</div>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${FOERDERGEBER_COLOR[p.foerdergeber] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                                {p.foerdergeber}
                              </span>
                              {p.aktiveBoni.map((b) => (
                                <span key={b} className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.5 rounded-full">+{b}</span>
                              ))}
                            </div>
                          </div>
                          <span className="text-sm font-extrabold text-[#27AE60] shrink-0">
                            {(p.effektivSatz * 100).toFixed(0)} %
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Anpassen
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 bg-[#27AE60] hover:bg-[#1E8449] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  <Download size={14} /> Als Projekt speichern
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Live summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sticky top-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Live-Zusammenfassung</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Gebäudetyp</span>
                <span className="text-xs font-semibold text-slate-800">
                  {GEBAEUDE.find((g) => g.value === input.gebaeudetyp)?.label}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Baujahr</span>
                <span className="text-xs font-semibold text-slate-800">{input.baujahr}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Maßnahme</span>
                <span className="text-xs font-semibold text-slate-800">
                  {MASSNAHMEN.find((m) => m.value === input.massnahme)?.label}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Investition</span>
                <span className="text-xs font-semibold text-slate-800">{formatEur(input.investition)}</span>
              </div>

              <div className="border-t border-slate-100 pt-3 mt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-500">Geschätzte Förderung</span>
                  <span className="text-lg font-extrabold text-[#27AE60]">{formatEur(gesamtFoerderung)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">Eigenanteil</span>
                  <span className="text-sm font-bold text-slate-900">{formatEur(input.investition - gesamtFoerderung)}</span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Fördersatz</span>
                    <span>{(gesamtFoerdersatz * 100).toFixed(0)} %</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#27AE60] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(gesamtFoerdersatz * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
              Unverbindliche Schätzung. Finale Förderhöhen hängen von Antragsvoraussetzungen und verfügbaren Kontingenten ab.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
