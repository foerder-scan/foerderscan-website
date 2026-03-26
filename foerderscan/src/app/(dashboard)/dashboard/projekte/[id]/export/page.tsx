import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PrintButton from "./PrintButton";

export default async function ProjektExportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const projekt = await prisma.projekt.findFirst({
    where: { id, userId },
    include: {
      massnahmen: true,
      foerderungen: { include: { programm: true } },
    },
  });
  if (!projekt) notFound();

  const gesamtInvestition = projekt.massnahmen.reduce((s, m) => s + (m.investitionskosten ?? 0), 0);
  const gesamtFoerderung  = projekt.foerderungen.reduce((s, f) => s + (f.beantragterBetrag ?? 0), 0);
  const eigenanteil       = gesamtInvestition - gesamtFoerderung;

  const MASSNAHME_LABEL: Record<string, string> = {
    GEBAEUDEHUELLE: "Gebäudehülle",
    ANLAGENTECHNIK: "Anlagentechnik",
    HEIZUNG: "Heizungsanlage",
    EH_KOMPLETTSANIERUNG: "Effizienzhaus – Komplettsanierung",
    FACHPLANUNG: "Fachplanung & Baubegleitung",
    ENERGIEBERATUNG: "Energieberatung",
  };

  const STATUS_LABEL: Record<string, string> = {
    RECHERCHE: "Recherche",
    ANTRAG_GESTELLT: "Antrag gestellt",
    ZUGESAGT: "Zugesagt",
    ABGERECHNET: "Abgerechnet",
    ABGEBROCHEN: "Abgebrochen",
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  return (
    <>
      {/* Print-Button — nur am Bildschirm sichtbar */}
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-2">
        <a
          href={`/dashboard/projekte/${id}`}
          className="px-4 py-2 text-sm font-semibold border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          ← Zurück
        </a>
        <PrintButton />
      </div>

      {/* Druckbares Dokument */}
      <div className="max-w-2xl mx-auto px-8 py-12 print:max-w-full print:px-0 print:py-0 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1B4F72] flex items-center justify-center">
              <span className="text-white font-extrabold text-xs">FS</span>
            </div>
            <span className="font-extrabold text-[#1B4F72] text-lg">FörderScan</span>
          </div>
          <div className="text-right text-xs text-slate-400">
            <div>Förderbericht</div>
            <div>{new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}</div>
          </div>
        </div>

        {/* Projekttitel */}
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">{projekt.titel}</h1>
        <div className="flex items-center gap-3 mb-8">
          <span className="text-sm text-slate-500">{projekt.kundeName}</span>
          {(projekt.plz || projekt.ort) && (
            <span className="text-sm text-slate-400">· {projekt.plz} {projekt.ort}</span>
          )}
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {STATUS_LABEL[projekt.status]}
          </span>
        </div>

        {/* Gebäudedaten */}
        <section className="mb-8">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Gebäudedaten</h2>
          <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4">
            {projekt.gebaeudetyp && (
              <div>
                <div className="text-xs text-slate-500 mb-0.5">Gebäudetyp</div>
                <div className="text-sm font-semibold text-slate-800">
                  {{ EFH: "Einfamilienhaus", ZFH: "Zweifamilienhaus", MFH: "Mehrfamilienhaus", NWG: "Nichtwohngebäude", DENKMAL: "Denkmalgebäude" }[projekt.gebaeudetyp] ?? projekt.gebaeudetyp}
                </div>
              </div>
            )}
            {projekt.baujahr && (
              <div>
                <div className="text-xs text-slate-500 mb-0.5">Baujahr</div>
                <div className="text-sm font-semibold text-slate-800">{projekt.baujahr}</div>
              </div>
            )}
            {projekt.strasse && (
              <div className="col-span-2">
                <div className="text-xs text-slate-500 mb-0.5">Adresse</div>
                <div className="text-sm font-semibold text-slate-800">{projekt.strasse}, {projekt.plz} {projekt.ort}</div>
              </div>
            )}
          </div>
        </section>

        {/* Maßnahmen */}
        {projekt.massnahmen.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Sanierungsmaßnahmen</h2>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500">Maßnahme</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-500">Investition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projekt.massnahmen.map((m) => (
                    <tr key={m.id}>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {MASSNAHME_LABEL[m.massnahmenart] ?? m.massnahmenart}
                        {m.beschreibung && <span className="block text-xs text-slate-400 mt-0.5">{m.beschreibung}</span>}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-700">
                        {m.investitionskosten != null ? fmt(m.investitionskosten) : "–"}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold">
                    <td className="px-4 py-3 text-slate-800">Gesamt-Investition</td>
                    <td className="px-4 py-3 text-right text-slate-900">{fmt(gesamtInvestition)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Förderprogramme */}
        {projekt.foerderungen.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Förderprogramme</h2>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500">Programm</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500">Art</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-500">Betrag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projekt.foerderungen.map((f) => (
                    <tr key={f.id}>
                      <td className="px-4 py-3 font-medium text-slate-800">{f.programm.name}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{f.programm.foerdergeber}</td>
                      <td className="px-4 py-3 text-right font-semibold text-[#27AE60]">
                        {f.beantragterBetrag != null ? fmt(f.beantragterBetrag) : "–"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Finanzübersicht */}
        {gesamtInvestition > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Finanzübersicht</h2>
            <div className="bg-[#F8FAFC] rounded-xl border border-slate-200 p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Gesamt-Investition</span>
                <span className="font-semibold text-slate-900">{fmt(gesamtInvestition)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Gesamte Förderung</span>
                <span className="font-semibold text-[#27AE60]">− {fmt(gesamtFoerderung)}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-slate-200 pt-3">
                <span className="font-bold text-slate-800">Eigenanteil</span>
                <span className="font-extrabold text-[#1B4F72] text-base">{fmt(eigenanteil)}</span>
              </div>
            </div>
          </section>
        )}

        {/* Notizen */}
        {projekt.notizen && (
          <section className="mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Notizen</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-xl p-4 border border-slate-200">
              {projekt.notizen}
            </p>
          </section>
        )}

        {/* Footer */}
        <div className="pt-6 border-t border-slate-100 text-xs text-slate-400 flex justify-between">
          <span>Erstellt mit FörderScan · foerderscan.de</span>
          <span>Angaben ohne Gewähr</span>
        </div>
      </div>
    </>
  );
}
