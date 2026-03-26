import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Home,
  CheckCircle2,
  Clock,
  FileText,
  Euro,
  Pencil,
  Download,
} from "lucide-react";
import FoerderungenSection from "@/components/dashboard/FoerderungenSection";
import MatchingSection from "@/components/dashboard/MatchingSection";

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  RECHERCHE: { label: "Recherche", color: "text-slate-600", bg: "bg-slate-100" },
  ANTRAG_GESTELLT: { label: "Antrag gestellt", color: "text-blue-700", bg: "bg-blue-100" },
  ZUGESAGT: { label: "Zugesagt", color: "text-green-700", bg: "bg-green-100" },
  ABGERECHNET: { label: "Abgerechnet", color: "text-emerald-700", bg: "bg-emerald-100" },
  ABGEBROCHEN: { label: "Abgebrochen", color: "text-red-600", bg: "bg-red-100" },
};

const MASSNAHME_LABEL: Record<string, string> = {
  GEBAEUDEHUELLE: "Gebäudehülle",
  ANLAGENTECHNIK: "Anlagentechnik",
  HEIZUNG: "Heizungsanlage",
  EH_KOMPLETTSANIERUNG: "Effizienzhaus – Komplettsanierung",
  FACHPLANUNG: "Fachplanung & Baubegleitung",
  ENERGIEBERATUNG: "Energieberatung",
};

async function getProjekt(id: string, userId: string) {
  return prisma.projekt.findFirst({
    where: { id, userId },
    include: {
      massnahmen: true,
      foerderungen: {
        include: { programm: true },
      },
    },
  });
}

export default async function ProjektDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const projektResult = await getProjekt(id, userId);
  if (!projektResult) notFound();
  const projekt = projektResult!;

  const st = STATUS[projekt.status];
  const gesamtInvestition = projekt.massnahmen.reduce((s, m) => s + (m.investitionskosten ?? 0), 0);
  const gesamtFoerderung = projekt.foerderungen.reduce((s, f) => s + (f.beantragterBetrag ?? 0), 0);
  const eigenanteil = gesamtInvestition - gesamtFoerderung;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Link
            href="/dashboard/projekte"
            className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors mt-0.5 cursor-pointer"
          >
            <ArrowLeft size={15} />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{projekt.titel}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${st.bg} ${st.color}`}>
                {st.label}
              </span>
              {projekt.ort && (
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin size={10} /> {projekt.plz} {projekt.ort}
                </span>
              )}
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar size={10} /> {new Date(projekt.createdAt).toLocaleDateString("de-DE")}
              </span>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href={`/dashboard/projekte/${projekt.id}/export`}
            className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Download size={12} /> PDF
          </Link>
          <Link
            href={`/dashboard/projekte/${projekt.id}/bearbeiten`}
            className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Pencil size={12} /> Bearbeiten
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Gesamtinvestition", value: gesamtInvestition > 0 ? `${new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(gesamtInvestition)}` : "–", icon: Euro, color: "text-slate-600", bg: "bg-slate-50" },
          { label: "Förderung beantragt", value: gesamtFoerderung > 0 ? `${new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(gesamtFoerderung)}` : "–", icon: CheckCircle2, color: "text-[#27AE60]", bg: "bg-[#EAFAF1]" },
          { label: "Eigenanteil", value: eigenanteil > 0 ? `${new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(eigenanteil)}` : "–", icon: Euro, color: "text-[#1B4F72]", bg: "bg-[#EBF5FB]" },
          { label: "Maßnahmen", value: projekt.massnahmen.length, icon: Home, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
              <s.icon size={15} className={s.color} strokeWidth={1.75} />
            </div>
            <div className="text-lg font-extrabold text-slate-900">{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-5">
          {/* Maßnahmen */}
          <div className="bg-white rounded-2xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800">Sanierungsmaßnahmen</h2>
            </div>
            {projekt.massnahmen.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">Keine Maßnahmen eingetragen</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {projekt.massnahmen.map((m) => (
                  <div key={m.id} className="px-5 py-3.5 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        {MASSNAHME_LABEL[m.massnahmenart] ?? m.massnahmenart}
                      </div>
                      {m.beschreibung && (
                        <div className="text-xs text-slate-500 mt-0.5">{m.beschreibung}</div>
                      )}
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      {m.investitionskosten != null && m.investitionskosten > 0 && (
                        <div className="text-sm font-bold text-slate-700">
                          {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(m.investitionskosten)}
                        </div>
                      )}
                      {m.investitionskosten != null && m.investitionskosten > 0 && (
                        <div className="text-xs text-slate-400 mt-0.5">geplant</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* KI-Matching */}
          <MatchingSection
            projektId={projekt.id}
            gebaeudetyp={projekt.gebaeudetyp ?? ""}
            massnahmenarten={projekt.massnahmen.map((m) => m.massnahmenart)}
          />

          {/* Förderungen */}
          <FoerderungenSection
            projektId={projekt.id}
            initialFoerderungen={projekt.foerderungen.map((f) => ({
              id: f.id,
              beantragterBetrag: f.beantragterBetrag,
              antragsDatum: f.antragsDatum ? f.antragsDatum.toISOString() : null,
              programm: {
                name: f.programm.name,
                foerdergeber: f.programm.foerdergeber,
                foerderart: f.programm.foerderart,
              },
            }))}
          />
        </div>

        {/* Right: Details */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Projektdetails</h3>
            <div className="space-y-3">
              <div>
                <div className="text-[10px] text-slate-400 mb-0.5">Kunde</div>
                <div className="text-sm font-semibold text-slate-800">{projekt.kundeName}</div>
                {projekt.kundeEmail && <div className="text-xs text-slate-500">{projekt.kundeEmail}</div>}
              </div>
              {(projekt.plz || projekt.ort) && (
                <div>
                  <div className="text-[10px] text-slate-400 mb-0.5">Adresse</div>
                  <div className="text-sm text-slate-700">
                    {projekt.strasse && <div>{projekt.strasse}</div>}
                    <div>{projekt.plz} {projekt.ort}</div>
                  </div>
                </div>
              )}
              {projekt.gebaeudetyp && (
                <div>
                  <div className="text-[10px] text-slate-400 mb-0.5">Gebäudetyp</div>
                  <div className="text-sm text-slate-700">{projekt.gebaeudetyp}</div>
                </div>
              )}
              {projekt.baujahr && (
                <div>
                  <div className="text-[10px] text-slate-400 mb-0.5">Baujahr</div>
                  <div className="text-sm text-slate-700">{projekt.baujahr}</div>
                </div>
              )}
            </div>
          </div>

          {projekt.notizen && (
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5">
              <div className="flex items-start gap-2">
                <FileText size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-amber-800 mb-1">Notizen</div>
                  <p className="text-xs text-amber-700 leading-relaxed">{projekt.notizen}</p>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Verlauf</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#EBF5FB] flex items-center justify-center shrink-0">
                  <CheckCircle2 size={11} className="text-[#1B4F72]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-700">Projekt angelegt</div>
                  <div className="text-[11px] text-slate-400">
                    {new Date(projekt.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <Clock size={11} className="text-slate-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400">Antrag ausstehend</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
