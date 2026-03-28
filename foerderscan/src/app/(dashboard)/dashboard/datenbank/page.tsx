import { prisma } from "@/lib/prisma";
import { Foerdergeber, Foerdersegment } from "@prisma/client";
import {
  Database,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import DatenbankFilter from "./DatenbankFilter";

const VALID_FOERDERGEBER = new Set(Object.values(Foerdergeber));
const VALID_SEGMENT = new Set(Object.values(Foerdersegment));

const VALID_BUNDESLAENDER = new Set(["BW","BY","BE","BB","HB","HH","HE","MV","NI","NW","RP","SL","SN","ST","SH","TH"]);

async function getProgramme(foerdergeber?: string, segment?: string, search?: string, bundesland?: string) {
  return prisma.foerderProgramm.findMany({
    where: {
      ...(foerdergeber && VALID_FOERDERGEBER.has(foerdergeber as Foerdergeber)
        ? { foerdergeber: foerdergeber as Foerdergeber }
        : {}),
      ...(segment && VALID_SEGMENT.has(segment as Foerdersegment)
        ? { foerdersegment: segment as Foerdersegment }
        : {}),
      ...(bundesland && VALID_BUNDESLAENDER.has(bundesland)
        ? { bundesland }
        : {}),
      ...(search ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { kurzname: { contains: search, mode: "insensitive" } },
          { beschreibung: { contains: search, mode: "insensitive" } },
        ],
      } : {}),
    },
    include: { boni: true },
    orderBy: [{ status: "asc" }, { foerdergeber: "asc" }, { name: "asc" }],
  });
}

const STATUS_DISPLAY: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  AKTIV: { label: "Aktiv", icon: CheckCircle2, color: "text-[#27AE60]" },
  AUSLAUFEND: { label: "Auslaufend", icon: Clock, color: "text-amber-500" },
  ANGEKUENDIGT: { label: "Angekündigt", icon: AlertTriangle, color: "text-blue-500" },
  BEENDET: { label: "Beendet", icon: XCircle, color: "text-slate-400" },
};

const FOERDERGEBER_BADGE: Record<string, string> = {
  KFW: "bg-blue-50 text-blue-700 border-blue-100",
  BAFA: "bg-[#EBF5FB] text-[#1B4F72] border-[#1B4F72]/20",
  LAND: "bg-emerald-50 text-emerald-700 border-emerald-100",
  KOMMUNE: "bg-purple-50 text-purple-700 border-purple-100",
  EU: "bg-amber-50 text-amber-700 border-amber-100",
};

const ART_BADGE: Record<string, string> = {
  ZUSCHUSS: "bg-[#EAFAF1] text-[#27AE60]",
  TILGUNGSZUSCHUSS: "bg-blue-50 text-blue-700",
  KREDIT: "bg-slate-100 text-slate-600",
  STEUERBONUS: "bg-amber-50 text-amber-600",
  KOMBINATION: "bg-purple-50 text-purple-700",
};

const ART_LABEL: Record<string, string> = {
  ZUSCHUSS: "Zuschuss",
  TILGUNGSZUSCHUSS: "Tilgungszuschuss",
  KREDIT: "Kredit",
  STEUERBONUS: "Steuerbonus",
  KOMBINATION: "Kombination",
};

export default async function DatenbankPage({
  searchParams,
}: {
  searchParams: Promise<{ foerdergeber?: string; segment?: string; q?: string; bundesland?: string }>;
}) {
  const params = await searchParams;
  const programme = await getProgramme(params.foerdergeber, params.segment, params.q, params.bundesland);

  const aktiv = programme.filter((p) => p.status === "AKTIV").length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Förderdatenbank</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {aktiv} aktive Programme · {programme.length} gesamt
          </p>
        </div>
      </div>

      {/* Filter */}
      <DatenbankFilter
        initialFoerdergeber={params.foerdergeber ?? "alle"}
        initialSegment={params.segment ?? "alle"}
        initialSearch={params.q ?? ""}
        initialBundesland={params.bundesland ?? "alle"}
      />

      {/* Programme */}
      {programme.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 flex flex-col items-center py-16 text-center px-6">
          <Database size={32} className="text-slate-300 mb-3" strokeWidth={1.25} />
          <p className="text-sm text-slate-500">Keine Programme gefunden.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {programme.map((p) => {
            const statusInfo = STATUS_DISPLAY[p.status] ?? STATUS_DISPLAY.AKTIV;
            const StatusIcon = statusInfo.icon;
            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl border p-5 transition-all ${
                  p.status === "BEENDET"
                    ? "border-slate-100 opacity-60"
                    : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${FOERDERGEBER_BADGE[p.foerdergeber] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                        {p.foerdergeber}
                      </span>
                      {p.bundesland && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {p.bundesland}
                        </span>
                      )}
                      {p.kurzname && (
                        <span className="text-xs font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                          {p.kurzname}
                        </span>
                      )}
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ART_BADGE[p.foerderart] ?? "bg-slate-100 text-slate-600"}`}>
                        {ART_LABEL[p.foerderart] ?? p.foerderart}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mb-1">{p.name}</h3>

                    {p.beschreibung && (
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
                        {p.beschreibung}
                      </p>
                    )}

                    <div className="flex items-center gap-4 flex-wrap text-xs">
                        <div>
                          <span className="text-slate-400">Basis: </span>
                          <span className="font-semibold text-slate-700">
                            {(Number(p.basisfördersatz) * 100).toFixed(0)} % – max. {(Number(p.maxFoerdersatz) * 100).toFixed(0)} %
                          </span>
                        </div>
                      {p.maxFoerderfaehigeKosten != null && (
                        <div>
                          <span className="text-slate-400">Kostendecker: </span>
                          <span className="font-semibold text-slate-700">
                            {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(p.maxFoerderfaehigeKosten)}
                          </span>
                        </div>
                      )}
                      {p.gueltigBis && (
                        <div>
                          <span className="text-slate-400">Gültig bis: </span>
                          <span className="font-semibold text-slate-700">
                            {new Date(p.gueltigBis).toLocaleDateString("de-DE")}
                          </span>
                        </div>
                      )}
                    </div>

                    {p.boni.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {p.boni.map((b) => (
                          <span key={b.id} className="text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">
                            +{(Number(b.bonusSatz) * 100).toFixed(0)} % {b.bezeichnung}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className={`flex items-center gap-1 text-xs font-semibold ${statusInfo.color}`}>
                      <StatusIcon size={12} /> {statusInfo.label}
                    </div>
                    {p.quellUrl && (
                      <a
                        href={p.quellUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-semibold text-[#1B4F72] hover:text-[#154360] transition-colors"
                      >
                        Quelle <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
