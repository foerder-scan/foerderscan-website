"use client";

import { useState } from "react";
import { Sparkles, Plus, ExternalLink, Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface MatchResult {
  id: string;
  name: string;
  kurzname: string | null;
  foerdergeber: string;
  foerderart: string;
  status: string;
  effektivSatz: number;
  basisfördersatz: number;
  maxFoerdersatz: number;
  maxFoerderfaehigeKosten: number | null;
  aktiveBoni: string[];
  quellUrl: string | null;
}

interface Props {
  projektId: string;
  gebaeudetyp: string;
  massnahmenarten: string[];
  onFoerderungAdded?: () => void;
}

const FOERDERGEBER_COLOR: Record<string, string> = {
  KFW:    "bg-blue-50 text-blue-700 border-blue-100",
  BAFA:   "bg-[#EBF5FB] text-[#1B4F72] border-[#1B4F72]/20",
  LAND:   "bg-emerald-50 text-emerald-700 border-emerald-100",
  KOMMUNE:"bg-purple-50 text-purple-700 border-purple-100",
  EU:     "bg-amber-50 text-amber-700 border-amber-100",
};

const ART_LABEL: Record<string, string> = {
  ZUSCHUSS:          "Zuschuss",
  TILGUNGSZUSCHUSS:  "Tilgungszuschuss",
  KREDIT:            "Kredit",
  STEUERBONUS:       "Steuerbonus",
  KOMBINATION:       "Kombination",
};

export default function MatchingSection({ projektId, gebaeudetyp, massnahmenarten, onFoerderungAdded }: Props) {
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [hatISFP, setHatISFP] = useState(false);
  const [hatEEKlasse, setHatEEKlasse] = useState(false);

  const runMatching = async () => {
    setLoading(true);
    setExpanded(true);
    try {
      const res = await fetch("/api/matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gebaeudetyp, massnahmenarten, hatISFP, hatEEKlasse }),
      });
      const data = await res.json();
      setResults(data.results ?? []);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (programmId: string) => {
    setAdding(programmId);
    try {
      await fetch("/api/foerderungen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projektId, programmId }),
      });
      onFoerderungAdded?.();
    } finally {
      setAdding(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200">
      <button
        onClick={() => {
          if (!results) runMatching();
          else setExpanded(!expanded);
        }}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50 rounded-2xl transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
            <Sparkles size={14} className="text-amber-500" strokeWidth={1.75} />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-slate-800">Passendes Matching</div>
            <div className="text-xs text-slate-500">KI-basierte Programmempfehlungen</div>
          </div>
        </div>
        {results ? (
          expanded ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />
        ) : (
          <span className="text-xs font-semibold text-[#1B4F72] bg-[#EBF5FB] px-2.5 py-1 rounded-full">
            Jetzt starten →
          </span>
        )}
      </button>

      {expanded && (
        <div className="border-t border-slate-100">
          {/* Bonus-Filter */}
          <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={hatISFP}
                onChange={(e) => { setHatISFP(e.target.checked); setResults(null); }}
                className="rounded border-slate-300 text-[#1B4F72]"
              />
              Sanierungsfahrplan (iSFP) vorhanden
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={hatEEKlasse}
                onChange={(e) => { setHatEEKlasse(e.target.checked); setResults(null); }}
                className="rounded border-slate-300 text-[#1B4F72]"
              />
              Erneuerbare Energien Klasse
            </label>
            {results === null && (
              <button
                onClick={runMatching}
                className="ml-auto text-xs font-semibold text-[#1B4F72] hover:text-[#154360] cursor-pointer"
              >
                Neu berechnen →
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={20} className="animate-spin text-slate-400" />
            </div>
          ) : results && results.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">
              Keine passenden Programme für dieses Projekt gefunden.
            </div>
          ) : results ? (
            <div className="divide-y divide-slate-100">
              {results.slice(0, 8).map((r) => (
                <div key={r.id} className="px-5 py-4 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${FOERDERGEBER_COLOR[r.foerdergeber] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                        {r.foerdergeber}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        {ART_LABEL[r.foerderart] ?? r.foerderart}
                      </span>
                      {r.status === "AUSLAUFEND" && (
                        <span className="text-[10px] font-semibold text-amber-600">Auslaufend</span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-slate-800 truncate">{r.name}</div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs font-bold text-[#27AE60]">
                        {(r.effektivSatz * 100).toFixed(0)} % Förderung
                      </span>
                      {r.aktiveBoni.length > 0 && r.aktiveBoni.map((b) => (
                        <span key={b} className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.5 rounded-full">
                          + {b}
                        </span>
                      ))}
                      {r.maxFoerderfaehigeKosten != null && (
                        <span className="text-[10px] text-slate-400">
                          max. {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(r.maxFoerderfaehigeKosten)} förderfähig
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {r.quellUrl && (
                      <a
                        href={r.quellUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-[#1B4F72] transition-colors cursor-pointer"
                        title="Quelle öffnen"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                    <button
                      onClick={() => handleAdd(r.id)}
                      disabled={adding === r.id}
                      className="flex items-center gap-1 text-xs font-semibold text-[#1B4F72] hover:text-[#154360] border border-[#1B4F72]/20 hover:border-[#1B4F72]/40 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      title="Zum Projekt hinzufügen"
                    >
                      {adding === r.id ? <Loader2 size={11} className="animate-spin" /> : <Plus size={11} />}
                      Hinzufügen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
