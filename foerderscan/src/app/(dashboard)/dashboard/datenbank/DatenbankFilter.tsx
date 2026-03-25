"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

const FOERDERGEBER = [
  { value: "alle", label: "Alle Fördergeber" },
  { value: "KFW", label: "KfW" },
  { value: "BAFA", label: "BAFA" },
  { value: "LAND", label: "Land" },
  { value: "KOMMUNE", label: "Kommune" },
];

const SEGMENTE = [
  { value: "alle", label: "Alle Segmente" },
  { value: "BEG_WG", label: "BEG Wohngebäude" },
  { value: "BEG_EM", label: "BEG Einzelmaßnahmen" },
  { value: "BEG_KFN", label: "BEG KfW Kredit" },
  { value: "EBW", label: "Energieberatung" },
  { value: "STEUERLICH", label: "Steuerlich" },
  { value: "SONSTIGE", label: "Sonstige" },
];

interface Props {
  initialFoerdergeber: string;
  initialSegment: string;
  initialSearch: string;
}

export default function DatenbankFilter({ initialFoerdergeber, initialSegment, initialSearch }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const [foerdergeber, setFoerdergeber] = useState(initialFoerdergeber);
  const [segment, setSegment] = useState(initialSegment);
  const [search, setSearch] = useState(initialSearch);

  const applyFilter = (newFg?: string, newSeg?: string, newQ?: string) => {
    const fg = newFg ?? foerdergeber;
    const seg = newSeg ?? segment;
    const q = newQ ?? search;
    const params = new URLSearchParams();
    if (fg !== "alle") params.set("foerdergeber", fg);
    if (seg !== "alle") params.set("segment", seg);
    if (q) params.set("q", q);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center gap-3 flex-wrap">
        <SlidersHorizontal size={14} className="text-slate-400 shrink-0" />

        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              applyFilter(undefined, undefined, e.target.value);
            }}
            placeholder="Programm suchen…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-colors"
          />
        </div>

        {/* Foerdergeber */}
        <select
          value={foerdergeber}
          onChange={(e) => {
            setFoerdergeber(e.target.value);
            applyFilter(e.target.value, undefined, undefined);
          }}
          className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-colors bg-white cursor-pointer"
        >
          {FOERDERGEBER.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        {/* Segment */}
        <select
          value={segment}
          onChange={(e) => {
            setSegment(e.target.value);
            applyFilter(undefined, e.target.value, undefined);
          }}
          className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] transition-colors bg-white cursor-pointer"
        >
          {SEGMENTE.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
