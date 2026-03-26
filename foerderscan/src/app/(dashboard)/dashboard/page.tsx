import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FolderKanban, Calculator, Database, TrendingUp, Clock, AlertTriangle, ArrowRight, Plus, Bell, Sparkles, ExternalLink } from "lucide-react";

async function getDashboardData(userId: string) {
  const vor30Tagen = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [projekte, programmeCount, neueProgramme, ablaufwarnungen] = await Promise.all([
    prisma.projekt.findMany({
      where: { userId },
      include: { massnahmen: true, foerderungen: { include: { programm: true } } },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.foerderProgramm.count({ where: { status: "AKTIV" } }),
    // Programme neu oder geändert in letzten 30 Tagen
    prisma.foerderProgramm.findMany({
      where: {
        status: { in: ["AKTIV", "AUSLAUFEND", "ANGEKUENDIGT"] },
        letzteModifikation: { gte: vor30Tagen },
      },
      orderBy: { letzteModifikation: "desc" },
      take: 5,
      select: { id: true, name: true, foerdergeber: true, status: true, letzteModifikation: true, basisfördersatz: true },
    }),
    // Aktive Projekte mit AUSLAUFEND-Programmen
    prisma.projektFoerderung.findMany({
      where: {
        projekt: { userId, status: { notIn: ["ABGERECHNET", "ABGEBROCHEN"] } },
        programm: { status: "AUSLAUFEND" },
      },
      include: {
        projekt: { select: { id: true, titel: true } },
        programm: { select: { name: true, gueltigBis: true } },
      },
      take: 5,
    }),
  ]);

  return { projekte, programmeCount, neueProgramme, ablaufwarnungen };
}

const statusLabel: Record<string, { label: string; color: string }> = {
  RECHERCHE: { label: "Recherche", color: "bg-slate-100 text-slate-600" },
  ANTRAG_GESTELLT: { label: "Antrag gestellt", color: "bg-blue-100 text-blue-700" },
  ZUGESAGT: { label: "Zugesagt", color: "bg-green-100 text-green-700" },
  ABGERECHNET: { label: "Abgerechnet", color: "bg-emerald-100 text-emerald-700" },
  ABGEBROCHEN: { label: "Abgebrochen", color: "bg-red-100 text-red-600" },
};

export default async function DashboardHome() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const { projekte, programmeCount, neueProgramme, ablaufwarnungen } = await getDashboardData(userId);

  const totalFoerderung = projekte.reduce((sum, p) => {
    return sum + p.foerderungen.reduce((s, f) => s + (f.beantragterBetrag ?? 0), 0);
  }, 0);

  const aktiv = projekte.filter((p) => !["ABGERECHNET", "ABGEBROCHEN"].includes(p.status)).length;

  const stats = [
    { label: "Aktive Projekte", value: aktiv, icon: FolderKanban, color: "text-[#1B4F72]", bg: "bg-[#EBF5FB]" },
    { label: "Förderprogramme", value: programmeCount, icon: Database, color: "text-[#2E86C1]", bg: "bg-blue-50" },
    { label: "Beantragte Förderung", value: `${(totalFoerderung / 1000).toFixed(0)} T€`, icon: TrendingUp, color: "text-[#27AE60]", bg: "bg-[#EAFAF1]" },
    { label: "Offene Anträge", value: projekte.filter((p) => p.status === "ANTRAG_GESTELLT").length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon size={18} className={s.color} strokeWidth={1.75} />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projekte */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800">Aktuelle Projekte</h2>
            <Link
              href="/dashboard/projekte"
              className="text-xs font-semibold text-[#1B4F72] hover:text-[#154360] flex items-center gap-1"
            >
              Alle <ArrowRight size={12} />
            </Link>
          </div>
          {projekte.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <FolderKanban size={32} className="text-slate-300 mb-3" strokeWidth={1.25} />
              <p className="text-sm text-slate-500 mb-4">Noch keine Projekte angelegt</p>
              <Link
                href="/dashboard/projekte/neu"
                className="inline-flex items-center gap-2 text-sm font-semibold bg-[#1B4F72] text-white px-4 py-2 rounded-xl hover:bg-[#154360] transition-colors cursor-pointer"
              >
                <Plus size={14} /> Erstes Projekt anlegen
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {projekte.map((p) => {
                const st = statusLabel[p.status];
                const foerdersumme = p.foerderungen.reduce((s, f) => s + (f.beantragterBetrag ?? 0), 0);
                return (
                  <Link
                    key={p.id}
                    href={`/dashboard/projekte/${p.id}`}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-800 truncate">{p.titel}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{p.kundeName} · {p.plz} {p.ort}</div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      {foerdersumme > 0 && (
                        <span className="text-xs font-bold text-[#27AE60]">
                          {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(foerdersumme)}
                        </span>
                      )}
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${st.color}`}>{st.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-bold text-slate-800 mb-4">Schnellzugriff</h2>
            <div className="space-y-2">
              {[
                { href: "/dashboard/foerderrechner", icon: Calculator, label: "Förderrechner starten", color: "text-[#1B4F72]", bg: "bg-[#EBF5FB]" },
                { href: "/dashboard/projekte/neu", icon: Plus, label: "Neues Projekt anlegen", color: "text-[#27AE60]", bg: "bg-[#EAFAF1]" },
                { href: "/dashboard/datenbank", icon: Database, label: "Förderdatenbank", color: "text-[#2E86C1]", bg: "bg-blue-50" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center`}>
                    <item.icon size={15} className={item.color} strokeWidth={2} />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{item.label}</span>
                  <ArrowRight size={13} className="text-slate-300 ml-auto group-hover:text-slate-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Ablaufwarnungen */}
          {ablaufwarnungen.length > 0 && (
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} className="text-amber-500" strokeWidth={2} />
                <span className="text-xs font-bold text-amber-800">Ablaufwarnungen ({ablaufwarnungen.length})</span>
              </div>
              <div className="space-y-2">
                {ablaufwarnungen.map((f) => (
                  <Link
                    key={f.projekt.id + f.programm.name}
                    href={`/dashboard/projekte/${f.projekt.id}`}
                    className="flex items-start justify-between gap-2 text-xs hover:opacity-80 transition-opacity"
                  >
                    <div>
                      <div className="font-semibold text-amber-900 truncate">{f.programm.name}</div>
                      <div className="text-amber-700">{f.projekt.titel}</div>
                    </div>
                    {f.programm.gueltigBis && (
                      <span className="shrink-0 text-amber-600 font-semibold">
                        bis {new Date(f.programm.gueltigBis).toLocaleDateString("de-DE", { day: "2-digit", month: "short" })}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Förder-News */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell size={13} className="text-[#1B4F72]" />
                <span className="text-xs font-bold text-slate-800">Förder-News</span>
              </div>
              <span className="text-[10px] text-slate-400">letzte 30 Tage</span>
            </div>
            {neueProgramme.length === 0 ? (
              <p className="text-xs text-slate-400">Keine Änderungen in den letzten 30 Tagen.</p>
            ) : (
              <div className="space-y-2.5">
                {neueProgramme.map((p) => (
                  <Link
                    key={p.id}
                    href="/dashboard/datenbank"
                    className="flex items-start justify-between gap-2 hover:opacity-80 transition-opacity"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-800 truncate">{p.name}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          p.status === "AUSLAUFEND" ? "bg-amber-50 text-amber-700" :
                          p.status === "ANGEKUENDIGT" ? "bg-blue-50 text-blue-700" :
                          "bg-[#EAFAF1] text-[#27AE60]"
                        }`}>
                          {p.status === "AUSLAUFEND" ? "Auslaufend" : p.status === "ANGEKUENDIGT" ? "Neu" : "Aktiv"}
                        </span>
                        <span className="text-[10px] text-slate-400">{p.foerdergeber}</span>
                      </div>
                    </div>
                    <ExternalLink size={11} className="text-slate-300 shrink-0 mt-1" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
