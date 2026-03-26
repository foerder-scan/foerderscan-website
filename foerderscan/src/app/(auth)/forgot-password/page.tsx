"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch {
      setError("Fehler beim Senden. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl text-[#1B4F72]">
            <span className="w-9 h-9 rounded-xl bg-[#1B4F72] text-white flex items-center justify-center">
              <Zap size={18} strokeWidth={2.5} />
            </span>
            FörderScan
          </Link>
          <h1 className="mt-6 text-2xl font-extrabold text-slate-900">Passwort vergessen</h1>
          <p className="mt-1 text-sm text-slate-500">
            Wir senden Ihnen einen Reset-Link per E-Mail.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 size={40} className="text-[#27AE60] mx-auto mb-4" strokeWidth={1.5} />
              <h2 className="text-base font-bold text-slate-900 mb-2">E-Mail gesendet</h2>
              <p className="text-sm text-slate-500 mb-6">
                Falls ein Konto mit dieser E-Mail-Adresse existiert, haben wir einen Reset-Link gesendet. Bitte prüfen Sie Ihren Posteingang.
              </p>
              <Link
                href="/login"
                className="text-sm font-semibold text-[#1B4F72] hover:text-[#154360] flex items-center justify-center gap-1.5"
              >
                <ArrowLeft size={14} /> Zurück zum Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  E-Mail-Adresse
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="max@beispiel.de"
                  className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E86C1] focus:border-transparent transition-shadow"
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
                className="w-full flex items-center justify-center gap-2 bg-[#1B4F72] text-white font-semibold py-3 rounded-xl hover:bg-[#154360] disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm cursor-pointer"
              >
                {loading && <Loader2 size={15} className="animate-spin" />}
                {loading ? "Wird gesendet …" : "Reset-Link senden"}
              </button>

              <Link
                href="/login"
                className="flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <ArrowLeft size={13} /> Zurück zum Login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
