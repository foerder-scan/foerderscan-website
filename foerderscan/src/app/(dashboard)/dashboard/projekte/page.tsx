import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  FolderKanban,
  Plus,
  ArrowRight,
  MapPin,
  Euro,
} from "lucide-react";

async function getProjekte(userId: string) {
  return prisma.projekt.findMany({
    where: { userId },
    include: {
      massnahmen: true,
      foerderungen: { include: { programm: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

const STATUS: Record<string, { label: string; color: string }> = {
  RECHERCHE: { label: "Recherche", color: "bg-slate-100 text-slate-600" },
  ANTRAG_GESTELLT: { label: "Antrag gestellt", color: "bg-blue-100 text-blue-700" },
  ZUGESAGT: { label: "Zugesagt", color: "bg-green-100 text-green-700" },
  ABGERECHNET: { label: "Abgerechnet", color: "bg-emerald-100 text-emerald-700" },
  ABGEBROCHEN: { label: "Abgebrochen", color: "bg-red-100 text-red-600" },
};

export default async function ProjektePage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const projekte = await getProjekte(userId);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Projekte</h1>
          <p className="text-sm text-slate-500 mt-0.5">{projekte.length} Projekt{projekte.length !== 1 ? "e" : ""}</p>
        </div>
        <Link
          href="/dashboard/projekte/neu"
          className="inline-flex items-center gap-2 bg-[#1B4F72] hover:bg-[#154360] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
        >
          <Plus size={15} /> Neues Projekt
        </Link>
      </div>

      {projekte.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center py-20 text-center px-6">
          <FolderKanban size={40} className="text-slate-300 mb-4" strokeWidth={1.25} />
          <h2 className="text-base font-bold text-slate-800 mb-1">Noch keine Projekte</h2>
          <p className="text-sm text-slate-500 mb-6 max-w-sm">
            Legen Sie Ihr erstes Sanierungsprojekt an und finden Sie passende Förderprogramme.
          </p>
          <Link
            href="/dashboard/projekte/neu"
            className="inline-flex items-center gap-2 bg-[#1B4F72] hover:bg-[#154360] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <Plus size={15} /> Erstes Projekt anlegen
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          {projekte.map((p) => {
            const st = STATUS[p.status];
            const foerdersumme = p.foerderungen.reduce((s, f) => s + (f.beantragterBetrag ?? 0), 0);
            const gesamtInvestition = p.massnahmen.reduce((s, m) => s + (m.investitionskosten ?? 0), 0);
            return (
              <Link
                key={p.id}
                href={`/dashboard/projekte/${p.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#EBF5FB] flex items-center justify-center shrink-0 mt-0.5">
                    <FolderKanban size={16} className="text-[#1B4F72]" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">{p.titel}</div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 flex-wrap">
                      <span>{p.kundeName}</span>
                      {p.ort && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-0.5">
                            <MapPin size={10} /> {p.plz} {p.ort}
                          </span>
                        </>
                      )}
                      {p.massnahmen.length > 0 && (
                        <>
                          <span>·</span>
                          <span>{p.massnahmen.length} Maßnahme{p.massnahmen.length !== 1 ? "n" : ""}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 ml-4">
                  {gesamtInvestition > 0 && (
                    <div className="hidden sm:block text-right">
                      <div className="text-[10px] text-slate-400">Investition</div>
                      <div className="text-xs font-semibold text-slate-700 flex items-center gap-0.5">
                        <Euro size={10} />
                        {new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 }).format(gesamtInvestition)}
                      </div>
                    </div>
                  )}
                  {foerdersumme > 0 && (
                    <div className="hidden sm:block text-right">
                      <div className="text-[10px] text-slate-400">Förderung</div>
                      <div className="text-xs font-bold text-[#27AE60]">
                        {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(foerdersumme)}
                      </div>
                    </div>
                  )}
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${st.color}`}>{st.label}</span>
                  <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
