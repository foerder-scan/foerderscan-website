"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X, Check } from "lucide-react";

type ConsentState = "accepted" | "rejected" | null;

const STORAGE_KEY = "foerderscan_cookie_consent";

export default function CookieBanner() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ConsentState | null;
    if (!stored) {
      // Kurz warten damit die Seite erst lädt
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
    setConsent(stored);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setConsent("accepted");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(STORAGE_KEY, "rejected");
    setConsent("rejected");
    setVisible(false);
  };

  if (!visible || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-Einstellungen"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-50 animate-in slide-in-from-bottom-4 duration-300"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#EBF5FB] flex items-center justify-center shrink-0">
            <Cookie size={16} className="text-[#1B4F72]" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Cookies & Datenschutz</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Wir verwenden technisch notwendige Cookies für den Betrieb der Plattform.
              Keine Tracking- oder Werbe-Cookies.{" "}
              <Link href="/datenschutz" className="text-[#1B4F72] hover:underline font-medium">
                Datenschutzerklärung
              </Link>
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={reject}
            className="flex-1 flex items-center justify-center gap-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <X size={13} /> Ablehnen
          </button>
          <button
            onClick={accept}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#1B4F72] hover:bg-[#154360] text-white text-xs font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <Check size={13} /> Akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
