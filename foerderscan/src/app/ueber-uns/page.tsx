"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2, Zap, Target, Users, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const values = [
  {
    icon: Target,
    title: "Präzision vor Vollständigkeit",
    desc: "Lieber wenige, absolut verlässliche Daten als tausende ungeprüfte Einträge. Jede Zahl in FörderScan ist manuell validiert.",
  },
  {
    icon: Zap,
    title: "Aktuell oder gar nicht",
    desc: "Veraltete Förderdaten schaden mehr als sie nützen. Deshalb ist der automatische Aktualisierungs-Cron das Herzstück der Plattform.",
  },
  {
    icon: Users,
    title: "Gebaut für Profis",
    desc: "FörderScan ist kein Consumer-Tool mit professioneller Fassade. Es wurde von Grund auf für den täglichen Einsatz von Energieberatern konzipiert.",
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      if (!res.ok) throw new Error("Fehler beim Senden");
      setSubmitted(true);
    } catch {
      setError("Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie direkt an info@foerderscan.de.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-[#F8FAFC] border-b border-slate-100">
        <motion.div
          className="section-container max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EBF5FB] text-[#1B4F72] text-xs font-semibold mb-6 border border-[#AED6F1]">
            Über FörderScan
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.08]">
            Ein echtes Problem.
            <span className="block" style={{
              background: "linear-gradient(135deg, #1B4F72 0%, #2E86C1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Eine klare Lösung.
            </span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Die Förderlandschaft für energetische Sanierung ist fragmentiert,
            komplex und ändert sich ständig. FörderScan bündelt alles auf einer
            Plattform – intelligent, aktuell, verlässlich.
          </p>
        </motion.div>
      </section>

      {/* Mission */}
      <section className="py-16 lg:py-20 bg-white">
        <motion.div
          className="section-container"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-4">
                Die Mission
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
                FörderScan schließt diese Lücke – mit echter Datenqualität
                und einer Plattform, die für den täglichen Profieinsatz gebaut ist.
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
        </motion.div>
      </section>

      {/* Gründer */}
      <section className="py-16 lg:py-20 bg-[#F8FAFC] border-t border-slate-100">
        <motion.div
          className="section-container"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Der Gründer</h2>
            <p className="text-base text-slate-500 max-w-lg mx-auto">
              FörderScan ist ein Bootstrapped-Projekt — gebaut von einer Person, die das Problem aus erster Hand kennt.
            </p>
          </div>
          <div className="max-w-sm mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-[#1B4F72] text-white text-xl font-bold flex items-center justify-center mx-auto mb-5">
                TF
              </div>
              <div className="text-base font-bold text-slate-900 mb-1">Tobias Feuerbach</div>
              <div className="text-sm text-[#2E86C1] font-semibold mb-4">Gründer & Entwickler</div>
              <p className="text-sm text-slate-500 leading-relaxed">
                FörderScan ist aus einem echten Frustrationspunkt entstanden: Die deutsche Förderlandschaft
                ist für Energieberater und Eigentümer gleichermaßen unübersichtlich. Ich habe FörderScan
                gebaut, um das zu ändern — mit echter Datenqualität und einem Tool, das im Alltag wirklich funktioniert.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact */}
      <section id="kontakt" className="py-16 lg:py-24 bg-white border-t border-slate-100">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Info */}
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-4">
                Sprechen Sie mit mir
              </h2>
              <p className="text-base text-slate-600 leading-relaxed mb-8">
                Ob Demo-Termin, Feedback oder allgemeine Fragen – ich antworte
                innerhalb eines Werktages persönlich.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-9 h-9 rounded-lg bg-[#EBF5FB] flex items-center justify-center shrink-0">
                    <Mail size={16} className="text-[#1B4F72]" />
                  </div>
                  info@foerderscan.de
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200 p-6">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center h-full py-8">
                  <CheckCircle2 size={40} className="text-[#27AE60] mb-4" strokeWidth={1.5} />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Nachricht gesendet!</h3>
                  <p className="text-sm text-slate-500">
                    Ich melde mich innerhalb eines Werktages bei Ihnen.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="type" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Ich möchte …
                    </label>
                    <select
                      id="type"
                      value={formState.type}
                      onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2E86C1] cursor-pointer"
                    >
                      <option value="demo">Eine Demo buchen</option>
                      <option value="info">Allgemeine Informationen</option>
                      <option value="feedback">Feedback geben</option>
                      <option value="enterprise">Enterprise anfragen</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="Max Mustermann"
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E86C1]"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                        Unternehmen
                      </label>
                      <input
                        id="company"
                        type="text"
                        value={formState.company}
                        onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                        placeholder="Optional"
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E86C1]"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      E-Mail
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="max@beispiel.de"
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E86C1]"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Nachricht
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Wie kann ich Ihnen helfen?"
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E86C1] resize-none"
                    />
                  </div>
                  {error && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[#1B4F72] text-white font-semibold py-3 rounded-xl hover:bg-[#154360] transition-colors text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                    {loading ? "Wird gesendet …" : "Nachricht senden"}
                  </button>
                  <p className="text-xs text-slate-400 text-center">
                    Mit dem Absenden stimmen Sie unserer{" "}
                    <a href="/datenschutz" className="underline hover:text-slate-600">
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
