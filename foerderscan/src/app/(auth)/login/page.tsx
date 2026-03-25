"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Zap, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("E-Mail oder Passwort ungültig.");
      setLoading(false);
    } else {
      router.push(callbackUrl);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
          <AlertCircle size={15} className="shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
            E-Mail
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

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Passwort
            </label>
            <Link href="#" className="text-xs text-[#1B4F72] hover:text-[#154360] font-medium">
              Passwort vergessen?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPw ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 pr-11 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E86C1] focus:border-transparent transition-shadow"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label={showPw ? "Passwort verbergen" : "Passwort anzeigen"}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#1B4F72] text-white font-semibold py-3 rounded-xl hover:bg-[#154360] disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm cursor-pointer"
        >
          {loading && <Loader2 size={15} className="animate-spin" />}
          {loading ? "Anmelden…" : "Anmelden"}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-400">
          Demo-Zugangsdaten:{" "}
          <button
            type="button"
            onClick={() => { setEmail("berater@example.de"); setPassword("Berater1234!"); }}
            className="text-[#1B4F72] font-semibold hover:underline cursor-pointer"
          >
            Berater-Account laden
          </button>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
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
          <h1 className="mt-6 text-2xl font-extrabold text-slate-900">Anmelden</h1>
          <p className="mt-1 text-sm text-slate-500">
            Noch kein Konto?{" "}
            <Link href="/register" className="font-semibold text-[#1B4F72] hover:text-[#154360]">
              Kostenlos registrieren
            </Link>
          </p>
        </div>
        <Suspense fallback={<div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 animate-pulse h-64" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
