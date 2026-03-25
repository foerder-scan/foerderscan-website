"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "", role: "BERATER_FREE" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Registrierung fehlgeschlagen.");
      setLoading(false);
    } else {
      router.push("/login?registered=1");
    }
  };

  const pwStrong = form.password.length >= 8;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl text-[#1B4F72]">
            <span className="w-9 h-9 rounded-xl bg-[#1B4F72] text-white flex items-center justify-center">
              <Zap size={18} strokeWidth={2.5} />
            </span>
            FörderScan
          </Link>
          <h1 className="mt-6 text-2xl font-extrabold text-slate-900">Konto erstellen</h1>
          <p className="mt-1 text-sm text-slate-500">
            Bereits registriert?{" "}
            <Link href="/login" className="font-semibold text-[#1B4F72] hover:text-[#154360]">
              Anmelden
            </Link>
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
              <AlertCircle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="role" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Ich bin …
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "BERATER_FREE", label: "Energieberater" },
                  { value: "ENDKUNDE", label: "Eigentümer" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: opt.value })}
                    className={`py-2.5 text-sm font-medium rounded-xl border transition-all cursor-pointer ${
                      form.role === opt.value
                        ? "bg-[#1B4F72] text-white border-[#1B4F72]"
                        : "bg-white text-slate-600 border-slate-200 hover:border-[#2E86C1]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Max Mustermann"
                className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E86C1] focus:border-transparent"
              />
            </div>

            {form.role === "BERATER_FREE" && (
              <div>
                <label htmlFor="company" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Unternehmen (optional)
                </label>
                <input
                  id="company"
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Mustermann Energieberatung"
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E86C1] focus:border-transparent"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                E-Mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="max@beispiel.de"
                className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E86C1] focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Passwort
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPw ? "text" : "password"}
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Mindestens 8 Zeichen"
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 pr-11 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E86C1] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Passwort anzeigen/verbergen"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div className={`flex items-center gap-1.5 mt-1.5 text-xs ${pwStrong ? "text-[#27AE60]" : "text-amber-500"}`}>
                  <CheckCircle2 size={12} strokeWidth={2.5} />
                  {pwStrong ? "Passwort sicher" : "Mindestens 8 Zeichen erforderlich"}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !pwStrong}
              className="w-full flex items-center justify-center gap-2 bg-[#1B4F72] text-white font-semibold py-3 rounded-xl hover:bg-[#154360] disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm cursor-pointer mt-2"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? "Konto wird erstellt…" : "Konto erstellen"}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-5">
            Mit der Registrierung akzeptieren Sie unsere{" "}
            <Link href="#" className="underline hover:text-slate-600">AGB</Link>{" "}
            und{" "}
            <Link href="#" className="underline hover:text-slate-600">Datenschutzerklärung</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
