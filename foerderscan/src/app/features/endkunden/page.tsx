import Link from "next/link";
import {
  Search,
  ShieldCheck,
  BookOpen,
  UserCheck,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  CircleDot,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Förder-Schnellcheck",
    desc: "In wenigen Klicks zur persönlichen Förderübersicht – ohne Fachkenntnisse. Einfach Postleitzahl, Gebäudetyp und geplante Maßnahme angeben.",
    points: [
      "Keine Registrierung für den ersten Check erforderlich",
      "Verständliche Fragen statt komplizierter Fachbegriffe",
      "Ergebnis in unter 2 Minuten",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Ampel-Berechtigungsprüfung",
    desc: "Das Ergebnis des Schnellchecks wird übersichtlich mit einer Ampel-Logik dargestellt – sofort erkennbar, welche Programme in Frage kommen.",
    points: [
      "Grün: Hohe Wahrscheinlichkeit der Förderfähigkeit",
      "Gelb: Weitere Prüfung empfohlen",
      "Rot: Aktuell nicht förderfähig (mit Begründung)",
    ],
  },
  {
    icon: TrendingUp,
    title: "Visualisierung Ihrer Fördersumme",
    desc: "Sehen Sie auf einen Blick, wie viel Förderung Sie potenziell erhalten können – als konkreten Euro-Betrag, nicht als abstrakte Prozentzahl.",
    points: [
      "Geschätzte Fördersumme klar hervorgehoben",
      "Eigenanteil und Nettokosten transparent dargestellt",
      "Vergleich verschiedener Maßnahmen möglich",
    ],
  },
  {
    icon: BookOpen,
    title: "Verständliche Erklärungen",
    desc: 'Was bedeutet "BEG EM 458"? Was ist ein iSFP? FörderScan erklärt alle Fachbegriffe in Alltagssprache – ohne Vorkenntnisse verständlich.',
    points: [
      "Glossar aller Förder-Fachbegriffe",
      "Erklärungen direkt im Kontext des Ergebnisses",
      "Schritt-für-Schritt-Anleitung zum Antrag",
    ],
  },
  {
    icon: UserCheck,
    title: "Energieberater-Finder",
    desc: "Für den Förderantrag brauchen Sie einen zugelassenen Energieeffizienz-Experten. FörderScan vermittelt zertifizierte EEE in Ihrer Region.",
    points: [
      "Suche nach PLZ und Maßnahmentyp",
      "Nur EEE auf der offiziellen Expertenliste",
      "Direkter Kontakt via Plattform",
    ],
  },
];

const steps = [
  { label: "PLZ eingeben", sub: "Standort bestimmt regionale Programme" },
  { label: "Gebäude beschreiben", sub: "Typ, Alter, geplante Maßnahme" },
  { label: "Ergebnisse erhalten", sub: "Passende Programme mit Förderhöhe" },
  { label: "Berater finden", sub: "Zertifizierten EEE kontaktieren" },
];

export default function EndkundenFeaturesPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#155d33] to-[#27AE60] text-white">
        <div className="section-container">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-green-100 text-xs font-semibold mb-6 border border-white/20">
              Für Eigentümer (B2C)
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-[1.08]">
              Ihre Förderung –
              <span className="block text-green-200">einfach erklärt.</span>
            </h1>
            <p className="text-lg text-green-100 leading-relaxed mb-8 max-w-2xl">
              Sie planen eine Sanierung oder einen Neubau und wissen nicht,
              welche Förderung Ihnen zusteht? FörderScan zeigt es Ihnen in
              wenigen Minuten – ohne Fachwissen.
            </p>
            <Link
              href="/preise"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1E8449] font-bold rounded-xl hover:bg-green-50 transition-colors text-sm cursor-pointer"
            >
              Jetzt kostenlos prüfen <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works mini */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="section-container">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="text-center min-w-[140px]">
                  <div className="w-8 h-8 rounded-full bg-[#EAFAF1] border-2 border-[#27AE60] text-[#1E8449] text-sm font-bold flex items-center justify-center mx-auto mb-2">
                    {i + 1}
                  </div>
                  <div className="text-sm font-semibold text-slate-800">{step.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{step.sub}</div>
                </div>
                {i < steps.length - 1 && (
                  <CircleDot
                    size={16}
                    className="text-slate-300 shrink-0 hidden sm:block mx-2"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28 bg-[#F8FAFC]">
        <div className="section-container">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Was FörderScan für Sie tut
            </h2>
            <p className="text-base text-slate-500 max-w-xl mx-auto">
              Keine komplizierten Formulare. Keine Fachbegriffe, die Sie erst
              googeln müssen. Nur klare Ergebnisse.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EAFAF1] flex items-center justify-center mb-4">
                  <f.icon size={20} className="text-[#1E8449]" strokeWidth={1.75} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{f.desc}</p>
                <ul className="space-y-1.5">
                  {f.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2
                        size={13}
                        className="text-[#27AE60] shrink-0 mt-0.5"
                        strokeWidth={2.5}
                      />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="section-container text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-4">
            Finden Sie jetzt Ihre Förderung
          </h2>
          <p className="text-base text-slate-500 mb-8 max-w-md mx-auto">
            Kostenloser Schnellcheck – kein Anmeldung, keine Kreditkarte.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/preise"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#27AE60] text-white font-bold rounded-xl hover:bg-[#1E8449] transition-colors text-sm cursor-pointer"
            >
              Kostenlos starten <ArrowRight size={15} />
            </Link>
            <Link
              href="/features/energieberater"
              className="text-sm font-semibold text-slate-600 hover:text-[#1B4F72] transition-colors"
            >
              Sind Sie Energieberater? →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
