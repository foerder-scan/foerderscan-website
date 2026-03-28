"use client";

import Link from "next/link";
import {
  BrainCircuit,
  FolderKanban,
  FileBarChart2,
  RefreshCw,
  Calculator,
  GitCompare,
  Bell,
  Code2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

const mainFeatures = [
  {
    icon: BrainCircuit,
    title: "Intelligente Matching-Engine",
    desc: "Geben Sie Standort, Gebäudetyp, Maßnahme und EH-Stufe ein – die Engine liefert sofort eine priorisierte Liste aller passenden Förderprogramme mit konkreten Betragsberechnungen.",
    points: [
      "KfW 261, 358/359, 458 und alle BAFA-Programme",
      "Landes- und Kommunalförderungen nach PLZ",
      "Automatische Boni-Kalkulation (iSFP, WPB, SerSan, EE/NH)",
    ],
  },
  {
    icon: Calculator,
    title: "Präziser Förderhöhenrechner",
    desc: "Berechnet Förderhöhen nach den exakten Regelwerken der BEG-Richtlinie – inklusive Kostenobergrenzen, additiver Boni-Systematik und dem 70 %-Cap bei KfW 458.",
    points: [
      "Förderfähige Kosten nach programmspezifischen Deckeln",
      "Boni additiv: Basis + Geschwindigkeit + Einkommen + Effizienz",
      "Kumulierungsprüfung gegen die 60 %-Gesamtförderquote",
    ],
  },
  {
    icon: FolderKanban,
    title: "Mandantenverwaltung",
    desc: "Alle Kundenprojekte strukturiert auf einem Blick. Von der ersten Recherche bis zur Abrechnung – mit Statustracking, Dokumenten-Upload und Fristenmanagement.",
    points: [
      "Status-Workflow: Recherche → Antrag → Zugesagt → Abgerechnet",
      "Dokumente: BzA, TPB, Liefer-/Leistungsverträge",
      "Bewilligungszeitraum-Timer mit Erinnerungs-Alerts",
    ],
  },
  {
    icon: GitCompare,
    title: "Förder-Vergleichstool",
    desc: "Vergleichen Sie verschiedene Förderkombinationen für dasselbe Projekt nebeneinander und finden Sie die optimale Strategie für Ihren Kunden.",
    points: [
      "BEG WG Komplettsanierung vs. schrittweise BEG EM",
      "BEG vs. § 35c EStG für identische Maßnahmen",
      "Visualisierung der Nettokosten nach Förderung",
    ],
  },
  {
    icon: FileBarChart2,
    title: "Export & Berichtswesen",
    desc: "Professionelle Kundenberichte auf Knopfdruck – mit Förderübersicht, Berechnungsgrundlagen und den nächsten Schritten.",
    points: [
      "PDF-Report: Förderübersicht für den Kunden",
      "DOCX-Export: Textbausteine für die TPB",
      "CSV-Export für eigene Kalkulationstools",
    ],
  },
  {
    icon: RefreshCw,
    title: "KI-Aktualisierungsagent",
    desc: 'Der "Förderungs-Spion" überwacht täglich alle relevanten Quellen – KfW-Merkblätter, BAFA-Infoblätter, Bundesanzeiger, Landesförderbanken – und aktualisiert die Datenbank automatisch.',
    points: [
      "Überwacht KfW, BAFA, 16 Landesförderbanken & Kommunen",
      "NLP-basierte Erkennung von Konditionsänderungen",
      "Human-in-the-Loop: Redaktionelle Freigabe bei kritischen Änderungen",
    ],
  },
  {
    icon: Bell,
    title: "Förder-Alerts",
    desc: "Werden Sie automatisch benachrichtigt, wenn sich relevante Förderprogramme ändern – per E-Mail und Push-Notification (ab Professional-Tier).",
    points: [
      "Personalisierte Alerts nach gespeicherten Maßnahmentypen",
      "Sofortbenachrichtigung bei BEG-Richtlinienänderungen",
      "Wöchentlicher Änderungs-Newsletter",
    ],
  },
  {
    icon: Code2,
    title: "API-Zugang",
    desc: "Integrieren Sie die FörderScan-Matching-Engine direkt in Ihre eigene Software – mit vollständiger REST API und Webhook-System.",
    points: [
      "RESTful API: Matching, Rechner, Förderdatenbank",
      "Webhook-Callbacks bei Programmänderungen",
      "Rate Limit: 100 Req/Min (Pro) · 1.000 Req/Min (Enterprise)",
    ],
  },
];

export default function EnergieberaterFeaturesPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#0D2B3E] to-[#1B4F72] text-white">
        <div className="section-container">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-blue-200 text-xs font-semibold mb-6 border border-white/20">
              Für Energieberater (B2B)
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-[1.08]">
              Das professionelle Werkzeug für
              <span className="block text-[#5DADE2]">Energieeffizienz-Experten</span>
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed mb-8 max-w-2xl">
              FörderScan ist entwickelt für EEE auf der Energieeffizienz-Expertenliste.
              Von der Matching-Engine bis zum fertigen Kundenbericht – alles in einer Plattform.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/preise"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1B4F72] font-bold rounded-xl hover:bg-blue-50 transition-colors text-sm cursor-pointer"
              >
                Kostenlos starten <ArrowRight size={15} />
              </Link>
              <Link
                href="/ueber-uns#kontakt"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20 text-sm cursor-pointer"
              >
                Demo buchen
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="section-container">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Alle Features im Überblick
            </h2>
            <p className="text-base text-slate-500 max-w-xl mx-auto">
              Entwickelt für den professionellen Einsatz – von der ersten
              Projektanlage bis zum fertigen Förderbericht.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {mainFeatures.map((f, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF5FB] flex items-center justify-center shrink-0">
                    <f.icon size={20} className="text-[#1B4F72]" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{f.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed mt-1">{f.desc}</p>
                  </div>
                </div>
                <ul className="space-y-2 pl-14">
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#F8FAFC] border-t border-slate-100">
        <motion.div
          className="section-container text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-extrabold text-slate-900 mb-4">
            Bereit, Ihren Workflow zu optimieren?
          </h2>
          <p className="text-base text-slate-500 mb-8 max-w-md mx-auto">
            Starten Sie kostenlos und erleben Sie, wie FörderScan Ihre
            Recherchezeit um 70 % reduziert.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/preise"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B4F72] text-white font-bold rounded-xl hover:bg-[#154360] transition-colors text-sm cursor-pointer"
            >
              Jetzt kostenlos starten <ArrowRight size={15} />
            </Link>
            <Link
              href="/preise"
              className="text-sm font-semibold text-[#1B4F72] hover:text-[#154360] transition-colors"
            >
              Preise vergleichen →
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
