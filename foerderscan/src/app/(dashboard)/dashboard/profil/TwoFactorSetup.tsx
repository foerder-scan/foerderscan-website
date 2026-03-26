"use client";

import { useState } from "react";
import { Shield, ShieldCheck, ShieldOff, Loader2, Check, AlertTriangle } from "lucide-react";
import Image from "next/image";

interface Props {
  initialEnabled: boolean;
}

export default function TwoFactorSetup({ initialEnabled }: Props) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [step, setStep] = useState<"idle" | "scan" | "verify" | "disable">("idle");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const startSetup = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/2fa");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setQrCode(data.qrCode);
      setSecret(data.secret);
      setStep("scan");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnable = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEnabled(true);
      setStep("idle");
      setToken("");
      setQrCode(null);
      setSecret(null);
      setSuccess("2FA erfolgreich aktiviert.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/2fa", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEnabled(false);
      setStep("idle");
      setToken("");
      setSuccess("2FA deaktiviert.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${enabled ? "bg-[#EAFAF1]" : "bg-slate-50"}`}>
          {enabled
            ? <ShieldCheck size={13} className="text-[#27AE60]" />
            : <Shield size={13} className="text-slate-400" />
          }
        </div>
        <h2 className="text-sm font-bold text-slate-800">Zwei-Faktor-Authentifizierung</h2>
        {enabled && (
          <span className="ml-auto text-[10px] font-bold text-[#27AE60] bg-[#EAFAF1] px-2 py-0.5 rounded-full">Aktiv</span>
        )}
      </div>

      {success && (
        <div className="mb-4 flex items-center gap-2 text-sm text-[#27AE60] bg-[#EAFAF1] border border-[#27AE60]/20 rounded-xl px-3 py-2">
          <Check size={13} /> {success}
        </div>
      )}

      {step === "idle" && (
        <div>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            {enabled
              ? "Ihr Konto ist mit einer Authenticator-App geschützt (TOTP). Bei jedem Login wird ein 6-stelliger Code benötigt."
              : "Schützen Sie Ihr Konto mit einer Authenticator-App (z.B. Google Authenticator, Authy). Bei jedem Login wird zusätzlich ein 6-stelliger Code benötigt."}
          </p>
          {enabled ? (
            <button
              onClick={() => setStep("disable")}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <ShieldOff size={12} /> 2FA deaktivieren
            </button>
          ) : (
            <button
              onClick={startSetup}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#1B4F72] hover:text-[#154360] border border-[#1B4F72]/20 hover:border-[#1B4F72]/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 size={12} className="animate-spin" /> : <Shield size={12} />}
              2FA aktivieren
            </button>
          )}
        </div>
      )}

      {step === "scan" && qrCode && (
        <div className="space-y-4">
          <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
            <AlertTriangle size={13} className="shrink-0 mt-0.5" />
            <span>Scannen Sie den QR-Code mit Ihrer Authenticator-App, bevor Sie fortfahren.</span>
          </div>
          <div className="flex justify-center">
            <Image src={qrCode} alt="2FA QR-Code" width={160} height={160} className="rounded-xl border border-slate-200" />
          </div>
          {secret && (
            <div className="text-center">
              <div className="text-[10px] text-slate-400 mb-1">Manueller Code (falls QR nicht funktioniert)</div>
              <code className="text-xs font-mono bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700 select-all">{secret}</code>
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">6-stelligen Code eingeben</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={token}
              onChange={(e) => { setToken(e.target.value.replace(/\D/g, "")); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && token.length === 6 && verifyAndEnable()}
              placeholder="000000"
              className="w-full text-center text-2xl font-mono tracking-widest border border-slate-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72]"
            />
          </div>
          {error && <p className="text-xs text-red-600 text-center">{error}</p>}
          <div className="flex gap-2">
            <button onClick={() => { setStep("idle"); setToken(""); setError(""); }} className="flex-1 text-xs font-semibold text-slate-600 border border-slate-200 py-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
              Abbrechen
            </button>
            <button
              onClick={verifyAndEnable}
              disabled={loading || token.length !== 6}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold bg-[#1B4F72] text-white py-2 rounded-xl hover:bg-[#154360] transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
              Aktivieren
            </button>
          </div>
        </div>
      )}

      {step === "disable" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">Geben Sie Ihren aktuellen Authenticator-Code ein, um 2FA zu deaktivieren.</p>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={token}
            onChange={(e) => { setToken(e.target.value.replace(/\D/g, "")); setError(""); }}
            placeholder="000000"
            className="w-full text-center text-2xl font-mono tracking-widest border border-slate-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400"
          />
          {error && <p className="text-xs text-red-600 text-center">{error}</p>}
          <div className="flex gap-2">
            <button onClick={() => { setStep("idle"); setToken(""); setError(""); }} className="flex-1 text-xs font-semibold text-slate-600 border border-slate-200 py-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
              Abbrechen
            </button>
            <button
              onClick={disable2FA}
              disabled={loading || token.length !== 6}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 size={12} className="animate-spin" /> : <ShieldOff size={12} />}
              Deaktivieren
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
