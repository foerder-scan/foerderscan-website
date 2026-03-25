"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Search, Plus, Loader2, CheckCircle2, ExternalLink } from "lucide-react";

interface Programm {
  id: string;
  name: string;
  kurzname: string | null;
  foerdergeber: string;
  foerderart: string;
  basisfördersatz: number;
  maxFoerdersatz: number;
  maxFoerderfaehigeKosten: number | null;
  status: string;
  quellUrl: string | null;
  boni: { id: string; bezeichnung: string; bonusSatz: number }[];
}

interface Props {
  projektId: string;
  onClose: () => void;
  onAdded: () => void;
}

const FOERDERGEBER_BADGE: Record<string, string> = {
  KFW: "bg-blue-50 text-blue-700",
  BAFA: "bg-[#EBF5FB] text-[#1B4F72]",
  LAND: "bg-emerald-50 text-emerald-700",
};

export default function FoerderungHinzufuegenModal({ projektId, onClose, onAdded }: Props) {
  const [query, setQuery] = useState("");
  const [programme, setProgramme] = useState<Programm[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<string | null>(null);
  const [betrag, setBetrag] = useState<Record<string, string>>({});

  const loadProgramme = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ q: query });
      const res = await fetch(`/api/foerderprogramme?${params}`);
      const data = await res.json();
      setProgramme(data);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const t = setTimeout(loadProgramme, 300);
    return () => clearTimeout(t);
  }, [loadProgramme]);

  const handleAdd = async (programmId: string) => {
    setAdding(programmId);
    try {
      await fetch("/api/foerderungen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projektId,
          programmId,
          beantragterBetrag: betrag[programmId] ? Number(betrag[programmId]) : null,
        }),
      });
      onAdded();
      onClose();
    } finally {
      setAdding(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800">Förderprogramm zuordnen</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-slate-100">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Programm suchen…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-colors"
              autoFocus
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={20} className="animate-spin text-slate-400" />
            </div>
          ) : programme.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">Keine Programme gefunden</div>
          ) : (
            programme.map((p) => (
              <div key={p.id} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${FOERDERGEBER_BADGE[p.foerdergeber] ?? "bg-slate-100 text-slate-600"}`}>
                        {p.foerdergeber}
                      </span>
                      {p.kurzname && (
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{p.kurzname}</span>
                      )}
                      <span className={`text-[10px] font-semibold ${p.status === "AKTIV" ? "text-[#27AE60]" : "text-amber-600"}`}>
                        {p.status === "AKTIV" ? "Aktiv" : "Auslaufend"}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-800">{p.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {(Number(p.basisfördersatz) * 100).toFixed(0)}–{(Number(p.maxFoerdersatz) * 100).toFixed(0)} %
                      {p.maxFoerderfaehigeKosten != null && ` · max. ${new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(p.maxFoerderfaehigeKosten)}`}
                    </div>
                    {p.boni.length > 0 && (
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {p.boni.map((b) => (
                          <span key={b.id} className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.5 rounded-full font-semibold">
                            +{(Number(b.bonusSatz) * 100).toFixed(0)} % {b.bezeichnung}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {p.quellUrl && (
                    <a href={p.quellUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#1B4F72] shrink-0 cursor-pointer transition-colors">
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="number"
                    value={betrag[p.id] ?? ""}
                    onChange={(e) => setBetrag((prev) => ({ ...prev, [p.id]: e.target.value }))}
                    placeholder="Betrag (€)"
                    min={0}
                    className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-colors"
                  />
                  <button
                    onClick={() => handleAdd(p.id)}
                    disabled={adding === p.id}
                    className="flex items-center gap-1.5 bg-[#1B4F72] hover:bg-[#154360] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {adding === p.id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Plus size={13} />
                    )}
                    Zuordnen
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
          <CheckCircle2 size={12} className="text-[#27AE60]" />
          Nur aktive und auslaufende Programme werden angezeigt
        </div>
      </div>
    </div>
  );
}
