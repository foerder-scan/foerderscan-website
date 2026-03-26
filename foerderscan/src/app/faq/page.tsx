"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Zap } from "lucide-react";

const faqs = [
  {
    category: "Allgemein",
    items: [
      {
        q: "Was ist FörderScan?",
        a: "FörderScan ist eine SaaS-Plattform, die Energieberater und Eigentümer dabei unterstützt, passende Förderprogramme für energetische Sanierungen zu finden. Die Plattform bündelt KfW-, BAFA- und Landesprogramme und matcht sie automatisch mit Ihren Projekten.",
      },
      {
        q: "Für wen ist FörderScan geeignet?",
        a: "FörderScan richtet sich an zwei Zielgruppen: Energieberater (iSFP-Aussteller, BEG-Sachverständige), die täglich mit Förderprogrammen arbeiten, und private Eigentümer, die schnell herausfinden möchten, welche Förderungen für ihr Gebäude verfügbar sind.",
      },
      {
        q: "Wie aktuell sind die Förderdaten?",
        a: "Die Datenbank wird täglich automatisch geprüft. Programme, die auslaufen oder sich ändern, werden als 'Auslaufend' markiert. Abgelaufene Programme werden als 'Beendet' archiviert und sind weiterhin für Referenzzwecke einsehbar.",
      },
    ],
  },
  {
    category: "Preise & Abonnement",
    items: [
      {
        q: "Gibt es einen kostenlosen Plan?",
        a: "Ja. Der Free-Plan erlaubt bis zu 3 Projekte, den Förderrechner und einen Basis-Zugang zur Förderdatenbank – dauerhaft kostenlos, keine Kreditkarte erforderlich.",
      },
      {
        q: "Kann ich jederzeit kündigen?",
        a: "Ja. Abonnements können monatlich gekündigt werden. Nach der Kündigung bleibt der Zugang bis zum Ende des bezahlten Zeitraums aktiv. Es gibt keine Mindestlaufzeit.",
      },
      {
        q: "Gibt es Rabatte für Energieberatungsbüros?",
        a: "Für Teams und Büros mit mehreren Nutzern empfehlen sich der Professional- oder Enterprise-Plan. Enterprise beinhaltet unbegrenzte Nutzer und White-Label-Optionen. Kontaktieren Sie uns für ein individuelles Angebot.",
      },
      {
        q: "Wie funktioniert die Abrechnung?",
        a: "Die Abrechnung erfolgt monatlich per Kreditkarte oder SEPA-Lastschrift über Stripe. Rechnungen werden automatisch per E-Mail zugestellt.",
      },
    ],
  },
  {
    category: "Datenschutz & Sicherheit",
    items: [
      {
        q: "Wo werden meine Daten gespeichert?",
        a: "Alle Daten werden in einer PostgreSQL-Datenbank bei Neon (Frankfurt, EU-Central-1) gespeichert. Die Webanwendung läuft auf Vercel (Edge-Netzwerk). Alle Verbindungen sind SSL-verschlüsselt.",
      },
      {
        q: "Werden meine Projektdaten weitergegeben?",
        a: "Nein. Ihre Projektdaten sind privat und werden ausschließlich für die Erbringung des Dienstes verwendet. Es erfolgt keine Weitergabe an Dritte zu Werbe- oder Analysezwecken.",
      },
      {
        q: "Ist FörderScan DSGVO-konform?",
        a: "Ja. FörderScan ist vollständig DSGVO-konform. Alle Datenverarbeitungen sind in der Datenschutzerklärung dokumentiert. Sie können Ihre Daten jederzeit exportieren oder löschen lassen.",
      },
    ],
  },
  {
    category: "Technisches",
    items: [
      {
        q: "Welche Browser werden unterstützt?",
        a: "FörderScan funktioniert in allen modernen Browsern: Chrome, Firefox, Safari und Edge (jeweils aktuelle Version). Der Dienst ist vollständig responsiv und funktioniert auch auf Smartphones und Tablets.",
      },
      {
        q: "Gibt es eine API?",
        a: "Eine REST-API ist im Professional- und Enterprise-Plan verfügbar. Damit können Sie FörderScan-Daten in Ihre eigenen Systeme (CRM, ERP, Berechnungstools) integrieren. Dokumentation auf Anfrage.",
      },
      {
        q: "Kann ich Daten exportieren?",
        a: "Ja. Projekte können als PDF exportiert werden. Ein vollständiger Datenexport (CSV/JSON) ist über das Profil-Portal verfügbar.",
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left cursor-pointer group"
      >
        <span className="text-sm font-semibold text-slate-800 group-hover:text-[#1B4F72] transition-colors">
          {q}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 mt-0.5 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="text-sm text-slate-600 leading-relaxed pb-5">{a}</p>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-16 bg-[#F8FAFC] border-b border-slate-100">
        <div className="section-container max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EBF5FB] text-[#1B4F72] text-xs font-semibold mb-6 border border-[#AED6F1]">
            Häufige Fragen
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            FAQ
          </h1>
          <p className="text-base text-slate-500">
            Antworten auf die häufigsten Fragen zu FörderScan.
            Nicht dabei? Schreiben Sie uns:{" "}
            <a href="mailto:info@foerderscan.de" className="text-[#1B4F72] font-semibold hover:underline">
              info@foerderscan.de
            </a>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="section-container max-w-3xl mx-auto space-y-10">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="text-xs font-bold text-[#1B4F72] uppercase tracking-widest mb-2 px-1">
                {section.category}
              </h2>
              <div className="bg-white rounded-2xl border border-slate-200 px-6 divide-y divide-slate-100">
                {section.items.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#F8FAFC] border-t border-slate-100">
        <div className="section-container max-w-xl mx-auto text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#1B4F72] text-white flex items-center justify-center mx-auto mb-4">
            <Zap size={20} strokeWidth={2} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">Noch Fragen?</h2>
          <p className="text-sm text-slate-500 mb-6">
            Ich antworte persönlich innerhalb eines Werktages.
          </p>
          <Link
            href="/ueber-uns#kontakt"
            className="inline-flex items-center gap-2 bg-[#1B4F72] hover:bg-[#154360] text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm cursor-pointer"
          >
            Kontakt aufnehmen
          </Link>
        </div>
      </section>
    </div>
  );
}
