"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle2, Zap, Target, Users } from "lucide-react";

const team = [
  {
    name: "Dr. Jan Richter",
    role: "CEO & Co-Founder",
    bio: "15 Jahre Erfahrung in der Energieberatungsbranche. Ehemals Energieeffizienz-Experte, kennt die Schmerzpunkte der Branche aus erster Hand.",
    initials: "JR",
    color: "bg-[#1B4F72]",
  },
  {
    name: "Anna Schulz",
    role: "CTO & Co-Founder",
    bio: "Softwarearchitektin mit Fokus auf KI-gestützte Datenverarbeitung. Zuvor tätig bei einem führenden PropTech-Unternehmen.",
    initials: "AS",
    color: "bg-[#2E86C1]",
  },
  {
    name: "Felix Müller",
    role: "Head of Data & Compliance",
    bio: "Spezialist für BEG-Richtlinien und Förderprogramme. Stellt sicher, dass alle Daten aktuell, vollständig und rechtskonform sind.",
    initials: "FM",
    color: "bg-[#27AE60]",
  },
  {
    name: "Laura Bauer",
    role: "Head of Product",
    bio: "UX-Expertin mit Fokus auf komplexe B2B-Softwareprodukte. Verantwortlich für die progressive Disclosure-Strategie der Plattform.",
    initials: "LB",
    color: "bg-[#154360]",
  },
];

const values = [
  {
    icon: Target,
    title: "Präzision vor Vollständigkeit",
    desc: "Lieber wenige, absolut verlässliche Daten als tausende ungeprüfte Einträge. Jede Zahl in FörderScan ist manuell validiert.",
  },
  {
    icon: Zap,
    title: "Aktuell oder gar nicht",
    desc: "Veraltete Förderdaten schaden mehr als sie nützen. Deshalb ist unser KI-Aktualisierungsagent das Herzstück der Plattform.",
  },
  {
    icon: Users,
    title: "Gebaut für Profis",
    desc: "FörderScan ist kein Consumer-Tool mit professioneller Fassade. Es wurde von Energieberatern für Energieberater konzipiert.",
  },
];

export default function UeberUnsPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    type: "demo",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-[#F8FAFC] border-b border-slate-100">
        <div className="section-container max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EBF5FB] text-[#1B4F72] text-xs font-semibold mb-6 border border-[#AED6F1]">
            Über FörderScan
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.08]">
            Wir lösen ein echtes Problem
            <span className="block" style={{
              background: "linear-gradient(135deg, #1B4F72 0%, #2E86C1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              der deutschen Energieberatung.
            </span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Die Förderlandschaft für energetische Sanierung ist fragmentiert,
            komplex und ändert sich ständig. FörderScan bündelt alles auf einer
            Plattform – intelligent, aktuell, verlässlich.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-4">
                Unsere Mission
              </h2>
              <p className="text-base text-slate-600 leading-relaxed mb-4">
                Energieberater in Deutschland investieren durchschnittlich 2–3
                Stunden pro Projekt allein in die manuelle Recherche von
                Förderprogrammen – KfW-Merkblätter, BAFA-Infoblätter,
                Landesrichtlinien, kommunale Programme.
              </p>
              <p className="text-base text-slate-600 leading-relaxed mb-6">
                Gleichzeitig fehlt privaten Eigentümern der Zugang zu einer
                verständlichen Übersicht ihrer Fördermöglichkeiten. Das
                Ergebnis: Milliarden an verfügbaren Fördermitteln werden nicht
                abgerufen.
              </p>
              <p className="text-base font-semibold text-[#1B4F72]">
                FörderScan schließt diese Lücke – mit KI, echter Datenqualität
                und einer Plattform, die für den täglichen Profieinsatz gebaut
                ist.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {values.map((v, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-xl border border-slate-200 bg-[#F8FAFC]"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#EBF5FB] flex items-center justify-center shrink-0">
                    <v.icon size={18} className="text-[#1B4F72]" strokeWidth={1.75} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 mb-1">{v.title}</div>
                    <div className="text-xs text-slate-500 leading-relaxed">{v.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 lg:py-20 bg-[#F8FAFC] border-t border-slate-100">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Das Team</h2>
            <p className="text-base text-slate-500 max-w-lg mx-auto">
              Erfahrene Köpfe aus Energieberatung, Softwareentwicklung und
              Produktdesign.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-5 text-center hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-14 h-14 rounded-full ${member.color} text-white text-lg font-bold flex items-center justify-center mx-auto mb-4`}
                >
                  {member.initials}
                </div>
                <div className="text-sm font-bold text-slate-900">{member.name}</div>
                <div className="text-xs text-[#2E86C1] font-semibold mb-3">{member.role}</div>
                <p className="text-xs text-slate-500 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="kontakt" className="py-16 lg:py-24 bg-white border-t border-slate-100">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Info */}
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-4">
                Sprechen Sie mit uns
              </h2>
              <p className="text-base text-slate-600 leading-relaxed mb-8">
                Ob Demo-Termin, Partneranfrage oder allgemeine Fragen – wir
                antworten innerhalb eines Werktages.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-9 h-9 rounded-lg bg-[#EBF5FB] flex items-center justify-center shrink-0">
                    <Mail size={16} className="text-[#1B4F72]" />
                  </div>
                  kontakt@foerderscan.de
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-9 h-9 rounded-lg bg-[#EBF5FB] flex items-center justify-center shrink-0">
                    <Phone size={16} className="text-[#1B4F72]" />
                  </div>
                  +49 (0)89 123 456 78
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-9 h-9 rounded-lg bg-[#EBF5FB] flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-[#1B4F72]" />
                  </div>
                  Maximilianstraße 1, 80539 München
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200 p-6">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center h-full py-8">
                  <CheckCircle2
                    size={40}
                    className="text-[#27AE60] mb-4"
                    strokeWidth={1.5}
                  />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Nachricht gesendet!
                  </h3>
                  <p className="text-sm text-slate-500">
                    Wir melden uns innerhalb eines Werktages bei Ihnen.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="type"
                      className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide"
                    >
                      Ich möchte …
                    </label>
                    <select
                      id="type"
                      value={formState.type}
                      onChange={(e) =>
                        setFormState({ ...formState, type: e.target.value })
                      }
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2E86C1] cursor-pointer"
                    >
                      <option value="demo">Eine Demo buchen</option>
                      <option value="info">Allgemeine Informationen</option>
                      <option value="partner">Partnerschaft anfragen</option>
                      <option value="enterprise">Enterprise anfragen</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) =>
                          setFormState({ ...formState, name: e.target.value })
                        }
                        placeholder="Max Mustermann"
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E86C1]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide"
                      >
                        Unternehmen
                      </label>
                      <input
                        id="company"
                        type="text"
                        value={formState.company}
                        onChange={(e) =>
                          setFormState({ ...formState, company: e.target.value })
                        }
                        placeholder="Optional"
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E86C1]"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide"
                    >
                      E-Mail
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      placeholder="max@beispiel.de"
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E86C1]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide"
                    >
                      Nachricht
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formState.message}
                      onChange={(e) =>
                        setFormState({ ...formState, message: e.target.value })
                      }
                      placeholder="Wie können wir Ihnen helfen?"
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E86C1] resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#1B4F72] text-white font-semibold py-3 rounded-xl hover:bg-[#154360] transition-colors text-sm cursor-pointer"
                  >
                    <Send size={15} />
                    Nachricht senden
                  </button>
                  <p className="text-xs text-slate-400 text-center">
                    Mit dem Absenden stimmen Sie unserer{" "}
                    <a href="#" className="underline hover:text-slate-600">
                      Datenschutzerklärung
                    </a>{" "}
                    zu.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
