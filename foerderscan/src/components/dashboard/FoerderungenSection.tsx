"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import FoerderungHinzufuegenModal from "./FoerderungHinzufuegenModal";

interface Foerderung {
  id: string;
  beantragterBetrag: number | null;
  antragsDatum: string | null;
  programm: {
    name: string;
    foerdergeber: string;
    foerderart: string;
  };
}

interface Props {
  projektId: string;
  initialFoerderungen: Foerderung[];
}

export default function FoerderungenSection({ projektId, initialFoerderungen }: Props) {
  const [foerderungen, setFoerderungen] = useState(initialFoerderungen);
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const reload = async () => {
    const res = await fetch(`/api/foerderungen?projektId=${projektId}`);
    const data = await res.json();
    setFoerderungen(data);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await fetch(`/api/foerderungen?id=${id}`, { method: "DELETE" });
    setFoerderungen((p) => p.filter((f) => f.id !== id));
    setDeletingId(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h2 className="text-sm font-bold text-slate-800">Förderprogramme</h2>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/foerderrechner"
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1 transition-colors"
          >
            Rechner <SquareArrowOutUpRight size={11} />
          </Link>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#1B4F72] hover:text-[#154360] cursor-pointer transition-colors"
          >
            <Plus size={13} /> Hinzufügen
          </button>
        </div>
      </div>

      {foerderungen.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-slate-400 mb-3">Noch keine Förderung zugeordnet</p>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs font-semibold text-[#1B4F72] hover:underline cursor-pointer"
          >
            Förderprogramm hinzufügen →
          </button>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {foerderungen.map((f) => (
            <div key={f.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-800 truncate">{f.programm.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {f.programm.foerdergeber} · {f.programm.foerderart === "ZUSCHUSS" ? "Zuschuss" : f.programm.foerderart === "TILGUNGSZUSCHUSS" ? "Tilgungszuschuss" : f.programm.foerderart}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {f.beantragterBetrag != null && f.beantragterBetrag > 0 && (
                  <span className="text-sm font-bold text-[#27AE60]">
                    {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(f.beantragterBetrag)}
                  </span>
                )}
                <button
                  onClick={() => handleDelete(f.id)}
                  disabled={deletingId === f.id}
                  className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-40"
                  aria-label="Förderung entfernen"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <FoerderungHinzufuegenModal
          projektId={projektId}
          onClose={() => setShowModal(false)}
          onAdded={reload}
        />
      )}
    </div>
  );
}
