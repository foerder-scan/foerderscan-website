import { ClipboardList, Zap, FileCheck } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Daten eingeben",
    desc: "Standort, Gebäudetyp, geplante Maßnahme und relevante Parameter in wenigen Sekunden erfassen – ohne Fachwissen erforderlich.",
    detail: "PLZ, Gebäudetyp, Maßnahme, EH-Stufe",
  },
  {
    icon: Zap,
    step: "02",
    title: "Förderungen erhalten",
    desc: "Die KI-Matching-Engine analysiert alle passenden Programme und berechnet Förderhöhen inklusive aller anwendbaren Boni automatisch.",
    detail: "KfW 261/458, BAFA, Landesförderung + Boni",
  },
  {
    icon: FileCheck,
    step: "03",
    title: "Antrag vorbereiten",
    desc: "Professionelle PDF-Berichte für Kunden, vorbereitete Textbausteine für die TPB und automatische Kumulierungsprüfung auf Knopfdruck.",
    detail: "PDF-Report, TPB-Bausteine, Fristentracking",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 lg:py-28 bg-[#F8FAFC]">
      <div className="section-container">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EBF5FB] text-[#1B4F72] text-xs font-semibold mb-4 border border-[#AED6F1]">
            So funktioniert es
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Vom Objekt zur Förderung in 3 Schritten
          </h2>
          <p className="text-base text-slate-500 max-w-xl mx-auto">
            FörderScan reduziert stundenlange Recherchearbeit auf einen
            strukturierten, reproduzierbaren Prozess.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          {/* Connector line desktop */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-gradient-to-r from-[#AED6F1] via-[#2E86C1] to-[#AED6F1] z-0" />

          {steps.map((s, i) => (
            <div
              key={i}
              className="relative bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#EBF5FB] flex items-center justify-center z-10">
                  <s.icon size={20} className="text-[#1B4F72]" strokeWidth={1.75} />
                </div>
                <span className="text-3xl font-black text-slate-100 select-none">
                  {s.step}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">{s.desc}</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F8FAFC] rounded-lg border border-slate-200 text-xs font-medium text-slate-600">
                {s.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
