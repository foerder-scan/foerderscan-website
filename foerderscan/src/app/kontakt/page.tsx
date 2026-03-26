"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2, Calendar } from "lucide-react";
import Link from "next/link";

const CONTACT_TYPES = [
  { value: "demo", label: "Demo anfragen" },
  { value: "support", label: "Support" },
  { value: "sales", label: "Verkauf / Enterprise" },
  { value: "partnership", label: "Partnerschaft" },
  { value: "other", label: "Sonstiges" },
];

export default function KontaktPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "", type: "demo" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Fehler beim Senden");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1B4F72] to-[#2E86C1] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <Mail size={12} />
            Kontakt
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Sprechen Sie mit uns
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto leading-relaxed">
            Fragen zur Plattform, Demo-Wunsch oder Enterprise-Anfrage — wir antworten innerhalb von 24 Stunden.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left: Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4">Kontaktdaten</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EBF5FB] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail size={15} className="text-[#1B4F72]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 mb-0.5">E-Mail</div>
                    <a href="mailto:info@foerderscan.de" className="text-sm font-semibold text-slate-800 hover:text-[#1B4F72] transition-colors">
                      info@foerderscan.de
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EBF5FB] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={15} className="text-[#1B4F72]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 mb-0.5">Adresse</div>
                    <div className="text-sm text-slate-700 leading-relaxed">
                      Tobias Feuerbach<br />
                      Diedesfelderstr. 2b<br />
                      67487 Maikammer
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Demo buchen</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                30-minütige Live-Demo der Plattform — speziell für Energieberater und Planungsbüros.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1B4F72] bg-[#EBF5FB] px-3 py-2.5 rounded-xl">
                <Calendar size={13} />
                Demo via E-Mail anfragen
              </div>
            </div>

            <div className="border-t border-slate-100 pt-8">
              <h2 className="text-sm font-bold text-slate-900 mb-3">Antwortzeiten</h2>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Support-Anfragen</span>
                  <span className="font-semibold text-slate-800">24h</span>
                </div>
                <div className="flex justify-between">
                  <span>Demo-Anfragen</span>
                  <span className="font-semibold text-slate-800">48h</span>
                </div>
                <div className="flex justify-between">
                  <span>Enterprise-Anfragen</span>
                  <span className="font-semibold text-slate-800">24h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            {sent ? (
              <div className="bg-[#EAFAF1] border border-[#27AE60]/30 rounded-2xl p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#27AE60]/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={28} className="text-[#27AE60]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Nachricht gesendet</h3>
                <p className="text-sm text-slate-600 mb-6">
                  Wir haben Ihre Anfrage erhalten und melden uns innerhalb von 24 Stunden.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", company: "", message: "", type: "demo" }); }}
                  className="text-sm font-semibold text-[#1B4F72] hover:underline cursor-pointer"
                >
                  Weitere Nachricht senden
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 space-y-5">
                <h2 className="text-lg font-bold text-slate-900 mb-1">Nachricht senden</h2>

                {/* Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Betreff</label>
                  <div className="flex flex-wrap gap-2">
                    {CONTACT_TYPES.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setForm({ ...form, type: t.value })}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                          form.type === t.value
                            ? "bg-[#1B4F72] text-white border-[#1B4F72]"
                            : "border-slate-200 text-slate-600 hover:border-[#1B4F72]/40"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Name *</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Max Mustermann"
                      className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">E-Mail *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="max@beispiel.de"
                      className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Unternehmen / Büro</label>
                  <input
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Energieberatung Mustermann GmbH"
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nachricht *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Beschreiben Sie Ihr Anliegen oder Ihre Frage …"
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] resize-none"
                  />
                  <div className="text-right text-[10px] text-slate-400 mt-1">{form.message.length}/2000</div>
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#1B4F72] hover:bg-[#154360] text-white font-semibold text-sm py-3 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
                >
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  {loading ? "Wird gesendet …" : "Nachricht senden"}
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  Mit dem Absenden stimmen Sie unserer{" "}
                  <Link href="/datenschutz" className="hover:underline">Datenschutzerklärung</Link> zu.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
