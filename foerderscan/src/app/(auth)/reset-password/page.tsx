"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Zap, Eye, EyeOff, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwörter stimmen nicht überein.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Fehler beim Zurücksetzen");
      setDone(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center py-4">
        <AlertCircle size={40} className="text-red-400 mx-auto mb-4" strokeWidth={1.5} />
        <p className="text-sm text-slate-600 mb-4">Ungültiger oder fehlender Reset-Link.</p>
        <Link href="/forgot-password" className="text-sm font-semibold text-[#1B4F72] hover:text-[#154360]">
          Neuen Link anfordern
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center py-4">
        <CheckCircle2 size={40} className="text-[#27AE60] mx-auto mb-4" strokeWidth={1.5} />
        <h2 className="text-base font-bold text-slate-900 mb-2">Passwort geändert!</h2>
        <p className="text-sm text-slate-500">Sie werden weitergeleitet …</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="password" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
          Neues Passwort
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPw ? "text" : "password"}
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 Zeichen"
            className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 pr-11 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E86C1] focus:border-transparent transition-shadow"
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="confirm" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
          Passwort bestätigen
        </label>
        <input
          id="confirm"
          type={showPw ? "text" : "password"}
          required
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Passwort wiederholen"
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
        {loading ? "Wird gespeichert …" : "Passwort speichern"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
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
          <h1 className="mt-6 text-2xl font-extrabold text-slate-900">Neues Passwort</h1>
          <p className="mt-1 text-sm text-slate-500">Vergeben Sie ein neues sicheres Passwort.</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <Suspense fallback={<div className="animate-pulse h-40 bg-slate-50 rounded-xl" />}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
