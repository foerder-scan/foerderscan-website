"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";

const GEBAEUDETYP_OPTIONS = [
  { value: "efh", label: "Einfamilienhaus" },
  { value: "mfh", label: "Mehrfamilienhaus" },
  { value: "nwg", label: "Nichtwohngebäude" },
];

const MASSNAHME_OPTIONS = [
  { value: "heizung", label: "Heizungsaustausch (KfW 458)", base: 0.3, max: 30000 },
  { value: "daemmung", label: "Gebäudehülle / Dämmung (BAFA)", base: 0.15, max: 30000 },
  { value: "komplett", label: "Komplettsanierung (KfW 261)", base: 0.1, max: 120000 },
  { value: "anlagen", label: "Anlagentechnik (BAFA)", base: 0.15, max: 30000 },
];

const BONUS_OPTIONS = [
  { id: "isfp", label: "iSFP vorhanden", value: 0.05 },
  { id: "wpb", label: "Worst Performing Building", value: 0.1 },
  { id: "geschwindigkeit", label: "Geschwindigkeitsbonus", value: 0.2 },
  { id: "einkommen", label: "Einkommensbonus (≤40k€)", value: 0.3 },
];

function formatEuro(val: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(val);
}

export default function HeroSection() {
  const [gebaeudetyp, setGebaeudetyp] = useState("efh");
  const [massnahme, setMassnahme] = useState("heizung");
  const [investition, setInvestition] = useState(25000);
  const [boni, setBoni] = useState<Set<string>>(new Set());

  const selectedMassnahme =
    MASSNAHME_OPTIONS.find((m) => m.value === massnahme) ?? MASSNAHME_OPTIONS[0];

  const totalRate = Math.min(
    selectedMassnahme.base +
      Array.from(boni).reduce((sum, id) => {
        const b = BONUS_OPTIONS.find((b) => b.id === id);
        return sum + (b?.value ?? 0);
      }, 0),
    0.7
  );

  const foerderfaehig = Math.min(investition, selectedMassnahme.max);
  const foerdersumme = Math.round(foerderfaehig * totalRate);

  const toggleBonus = (id: string) => {
    setBoni((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-b from-[#F8FAFC] to-white overflow-hidden">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EBF5FB] text-[#1B4F72] text-xs font-semibold mb-6 border border-[#AED6F1]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E86C1]" />
              Jetzt in der Beta – kostenlos starten
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-[1.08] tracking-tight mb-6">
              Die passende Förderung
              <span
                className="block"
                style={{
                  background: "linear-gradient(135deg, #1B4F72 0%, #2E86C1 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                in Sekunden statt Stunden.
              </span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
              FörderScan bündelt alle KfW-, BAFA- und Landesförderprogramme auf
              einer Plattform – intelligent gematcht, stets aktuell, mit
              präzisen Förderbetragsberechnungen.
            </p>

            <ul className="space-y-3 mb-10">
              {[
                "70 % weniger Rechercheaufwand für Energieberater",
                "Alle BEG-Segmente: WG, EM und KFN abgedeckt",
                "KI-Agent hält Förderdaten automatisch aktuell",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle2
                    size={17}
                    className="text-[#27AE60] shrink-0 mt-0.5"
                    strokeWidth={2.5}
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/preise"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1B4F72] text-white font-semibold rounded-xl hover:bg-[#154360] transition-colors shadow-sm text-sm cursor-pointer"
              >
                Kostenlos starten
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/ueber-uns#kontakt"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#1B4F72] font-semibold rounded-xl border border-[#AED6F1] hover:bg-[#EBF5FB] transition-colors text-sm cursor-pointer"
              >
                Demo buchen
              </Link>
            </div>
          </div>

          {/* Right: interactive Förderrechner */}
          <div className="relative">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_40px_-12px_rgba(27,79,114,0.18)] p-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-[#EBF5FB] flex items-center justify-center shrink-0">
                  <TrendingUp size={18} className="text-[#1B4F72]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    Förderrechner
                  </div>
                  <div className="text-xs text-slate-500">
                    Schnellkalkulation in Echtzeit
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {/* Gebäudetyp */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                    Gebäudetyp
                  </label>
                  <div className="flex gap-2">
                    {GEBAEUDETYP_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setGebaeudetyp(opt.value)}
                        className={`flex-1 text-xs py-2 px-2 rounded-lg font-medium border transition-all cursor-pointer ${
                          gebaeudetyp === opt.value
                            ? "bg-[#1B4F72] text-white border-[#1B4F72]"
                            : "bg-white text-slate-600 border-slate-200 hover:border-[#2E86C1] hover:text-[#1B4F72]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Maßnahme */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                    Geplante Maßnahme
                  </label>
                  <select
                    value={massnahme}
                    onChange={(e) => setMassnahme(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#2E86C1] focus:border-transparent cursor-pointer"
                  >
                    {MASSNAHME_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Investitionskosten */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                      Investitionskosten
                    </label>
                    <span className="text-sm font-bold text-slate-800">
                      {formatEuro(investition)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5000}
                    max={120000}
                    step={1000}
                    value={investition}
                    onChange={(e) => setInvestition(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#1B4F72]"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>5.000 €</span>
                    <span>120.000 €</span>
                  </div>
                </div>

                {/* Boni */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                    Anwendbare Boni
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {BONUS_OPTIONS.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => toggleBonus(b.id)}
                        className={`text-left text-xs py-2 px-2.5 rounded-lg border transition-all cursor-pointer ${
                          boni.has(b.id)
                            ? "bg-[#EAFAF1] text-[#1E8449] border-[#27AE60] font-semibold"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span className="block font-medium">{b.label}</span>
                        <span className="text-[10px] opacity-70">
                          +{Math.round(b.value * 100)} %
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Result */}
                <div className="bg-gradient-to-br from-[#1B4F72] to-[#154360] rounded-xl p-5 text-white">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-xs font-medium text-blue-200 mb-1">
                        Geschätzte Förderung
                      </div>
                      <div className="text-3xl font-extrabold tracking-tight">
                        {formatEuro(foerdersumme)}
                      </div>
                      <div className="text-xs text-blue-200 mt-1">
                        {Math.round(totalRate * 100)} % von{" "}
                        {formatEuro(foerderfaehig)} förderfähigen Kosten
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-blue-200 mb-1">
                        Eigenanteil
                      </div>
                      <div className="text-lg font-bold">
                        {formatEuro(investition - foerdersumme)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-blue-200">
                      Richtwert ohne Gewähr. Genaue Prüfung mit vollständigen
                      Parametern im Dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-3 -right-3 bg-[#27AE60] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
              Live-Berechnung
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
