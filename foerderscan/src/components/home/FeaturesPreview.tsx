import Link from "next/link";
import {
  BrainCircuit,
  FolderKanban,
  FileBarChart2,
  RefreshCw,
  Search,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const beraterFeatures = [
  {
    icon: BrainCircuit,
    title: "Intelligente Matching-Engine",
    desc: "Parametrisierte Eingabe liefert priorisierte Förderliste mit exakten Betragsberechnungen inkl. aller Boni.",
  },
  {
    icon: FolderKanban,
    title: "Mandantenverwaltung",
    desc: "Projekte pro Kunde anlegen, Statustracking von Recherche bis Abrechnung, Fristenmanagement mit Alerts.",
  },
  {
    icon: FileBarChart2,
    title: "Export & Berichtswesen",
    desc: "PDF-Reports für Kunden, DOCX-Textbausteine für die TPB, CSV für eigene Kalkulationstools.",
  },
  {
    icon: RefreshCw,
    title: "KI-Aktualisierungsagent",
    desc: "Automatische Überwachung aller Förderquellen. Änderungen werden erkannt, validiert und direkt eingepflegt.",
  },
];

const endkundenFeatures = [
  {
    icon: Search,
    title: "Förder-Schnellcheck",
    desc: "Ohne Fachkenntnisse in 2 Minuten zur persönlichen Förderübersicht – verständlich erklärt.",
  },
  {
    icon: ShieldCheck,
    title: "Berechtigungsprüfung",
    desc: "Ampel-Logik zeigt direkt: grün förderfähig, gelb prüfenswert, rot nicht förderfähig.",
  },
];

function FeatureCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group">
      <div className="w-9 h-9 rounded-lg bg-[#EBF5FB] flex items-center justify-center shrink-0 group-hover:bg-[#D6EAF8] transition-colors">
        <Icon size={18} className="text-[#1B4F72]" strokeWidth={1.75} />
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-800 mb-1">{title}</div>
        <div className="text-xs text-slate-500 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

export default function FeaturesPreview() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="section-container">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EBF5FB] text-[#1B4F72] text-xs font-semibold mb-4 border border-[#AED6F1]">
            Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Für jeden Anwendungsfall das richtige Werkzeug
          </h2>
          <p className="text-base text-slate-500 max-w-xl mx-auto">
            FörderScan unterscheidet klar zwischen den Bedürfnissen
            professioneller Energieberater und privater Eigentümer.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Energieberater card */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-br from-[#1B4F72] to-[#2E86C1] px-6 py-5">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-white text-xs font-semibold mb-3 border border-white/20">
                Für Energieberater (B2B)
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                Professionelles Beratungswerkzeug
              </h3>
              <p className="text-sm text-blue-100">
                Für EEE auf der Energieeffizienz-Expertenliste
              </p>
            </div>
            <div className="p-4 space-y-1">
              {beraterFeatures.map((f) => (
                <FeatureCard key={f.title} {...f} />
              ))}
            </div>
            <div className="px-6 pb-5">
              <Link
                href="/features/energieberater"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B4F72] hover:text-[#154360] transition-colors cursor-pointer"
              >
                Alle Features ansehen <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Endkunden card */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-br from-[#1E8449] to-[#27AE60] px-6 py-5">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-white text-xs font-semibold mb-3 border border-white/20">
                Für Eigentümer (B2C)
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                Verständliche Förderübersicht
              </h3>
              <p className="text-sm text-green-100">
                Ohne Fachkenntnisse zur passenden Förderung
              </p>
            </div>
            <div className="p-4 space-y-1">
              {endkundenFeatures.map((f) => (
                <FeatureCard key={f.title} {...f} />
              ))}
              {/* Pricing teaser */}
              <div className="mx-4 mt-2 p-4 bg-[#F8FAFC] rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Verfügbare Pakete
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["Free", "Starter · 29 €/Mo", "Professional · 79 €/Mo", "Enterprise"].map(
                    (tier) => (
                      <span
                        key={tier}
                        className="text-xs px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 font-medium"
                      >
                        {tier}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 pb-5">
              <Link
                href="/features/endkunden"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E8449] hover:text-[#155d33] transition-colors cursor-pointer"
              >
                Alle Features ansehen <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
