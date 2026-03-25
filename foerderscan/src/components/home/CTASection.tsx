import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const points = [
  "Keine Kreditkarte erforderlich",
  "Sofortiger Zugang zu allen Bundesförderprogrammen",
  "DSGVO-konform & Made in Germany",
];

export default function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="section-container">
        <div className="bg-gradient-to-br from-[#1B4F72] via-[#1B4F72] to-[#154360] rounded-3xl px-8 py-14 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-blue-200 text-xs font-semibold mb-6 border border-white/20">
              Jetzt kostenlos starten
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4 max-w-2xl mx-auto">
              Schluss mit stundenlanger Förderrecherche
            </h2>
            <p className="text-base text-blue-200 mb-8 max-w-lg mx-auto">
              Registrieren Sie sich kostenlos und entdecken Sie, welche
              Förderprogramme für Ihr nächstes Projekt in Frage kommen.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <Link
                href="/preise"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[#1B4F72] font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-sm cursor-pointer"
              >
                Kostenlos starten <ArrowRight size={16} />
              </Link>
              <Link
                href="/ueber-uns#kontakt"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20 text-sm cursor-pointer"
              >
                Demo anfragen
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-2">
              {points.map((p) => (
                <div key={p} className="flex items-center gap-2 text-xs text-blue-200">
                  <CheckCircle2 size={13} className="text-[#27AE60] shrink-0" strokeWidth={2.5} />
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
