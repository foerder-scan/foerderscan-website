import Link from "next/link";
import { ArrowRight, Zap, Clock, ShieldCheck } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    text: "Spart 2–3 Stunden Recherche pro Projekt",
  },
  {
    icon: ShieldCheck,
    text: "Immer aktuelle Förderdaten – automatisch geprüft",
  },
  {
    icon: Zap,
    text: "Passende Programme in Sekunden gefunden",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-[#F8FAFC]">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EBF5FB] text-[#1B4F72] text-xs font-semibold mb-6 border border-[#AED6F1]">
            Jetzt in der Beta
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Seien Sie einer der Ersten
          </h2>
          <p className="text-base text-slate-500 max-w-xl mx-auto mb-10">
            FörderScan befindet sich im Aufbau. Beta-Nutzer bekommen
            kostenlosen Zugang, direkten Draht zum Gründer und prägen aktiv
            die Roadmap.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 px-5 py-4 flex items-start gap-3 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-[#EBF5FB] flex items-center justify-center shrink-0 mt-0.5">
                  <b.icon size={15} className="text-[#1B4F72]" strokeWidth={1.75} />
                </div>
                <span className="text-sm text-slate-700 leading-snug">{b.text}</span>
              </div>
            ))}
          </div>

          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-[#1B4F72] hover:bg-[#154360] text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm cursor-pointer"
          >
            Kostenlos starten <ArrowRight size={15} />
          </Link>
          <p className="text-xs text-slate-400 mt-3">
            Keine Kreditkarte erforderlich · Free-Plan verfügbar
          </p>
        </div>
      </div>
    </section>
  );
}
