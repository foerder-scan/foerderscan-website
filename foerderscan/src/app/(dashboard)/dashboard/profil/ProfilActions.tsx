"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, ArrowUpRight, Zap, Download } from "lucide-react";

interface UpgradeOption {
  tier: string;
  label: string;
  price: string;
  highlight: boolean;
}

export function StripePortalButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Fehler beim Öffnen des Kundenportals. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full mt-2 flex items-center justify-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />}
      {loading ? "Wird geöffnet …" : "Zahlungsmethode & Abo verwalten"}
    </button>
  );
}

export function UpgradePanel({ currentTier, options }: { currentTier: string; options: UpgradeOption[] }) {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-br from-[#1B4F72] to-[#2E86C1] rounded-2xl p-5 text-white">
      <div className="flex items-center gap-2 mb-3">
        <Zap size={16} className="text-amber-300" />
        <span className="text-xs font-bold uppercase tracking-widest text-blue-200">Upgrade</span>
      </div>
      <h3 className="text-base font-extrabold mb-1">Mehr Leistung</h3>
      <p className="text-xs text-blue-200 leading-relaxed mb-4">
        Schalten Sie KI-Matching, unbegrenzte Projekte und den vollständigen Datenbankzugriff frei.
      </p>
      <div className="space-y-2">
        {options
          .filter((o) => o.tier !== currentTier)
          .map((opt) => (
            <button
              key={opt.tier}
              onClick={() => router.push("/preise")}
              className={`w-full rounded-xl p-3 border cursor-pointer transition-all text-left ${
                opt.highlight
                  ? "bg-white/15 border-white/30 hover:bg-white/20"
                  : "bg-white/8 border-white/15 hover:bg-white/12"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold">{opt.label}</div>
                  <div className="text-xs text-blue-200">{opt.price}</div>
                </div>
                <ArrowUpRight size={14} className="text-blue-300" />
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}

export function DataExportButton() {
  const [downloading, setDownloading] = useState(false);

  const handleExport = async () => {
    setDownloading(true);
    try {
      const res = await fetch("/api/account/export");
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `foerderscan-daten-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Fehler beim Exportieren der Daten.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={downloading}
      className="w-full text-left text-sm text-slate-700 hover:text-slate-900 font-medium py-2 border-b border-slate-100 transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2"
    >
      {downloading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
      {downloading ? "Wird exportiert …" : "Meine Daten exportieren (DSGVO)"}
    </button>
  );
}

export function AccountActions() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch("/api/account/delete", { method: "DELETE" });
      if (res.ok) {
        router.push("/");
      } else {
        alert("Fehler beim Löschen des Kontos.");
        setDeleting(false);
        setConfirmDelete(false);
      }
    } catch {
      alert("Fehler beim Löschen des Kontos.");
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Konto</h3>
      <a
        href="mailto:info@foerderscan.de?subject=Passwort%20ändern"
        className="block w-full text-left text-sm text-slate-700 hover:text-slate-900 font-medium py-2 border-b border-slate-100 transition-colors cursor-pointer"
      >
        Passwort ändern
      </a>
      <DataExportButton />
      <button
        onClick={handleDelete}
        disabled={deleting}
        className={`w-full text-left text-sm font-medium py-2 transition-colors cursor-pointer disabled:opacity-60 ${
          confirmDelete ? "text-red-700 font-bold" : "text-red-500 hover:text-red-700"
        }`}
      >
        {deleting ? "Wird gelöscht …" : confirmDelete ? "Wirklich löschen? Erneut klicken zum Bestätigen" : "Konto löschen"}
      </button>
      {confirmDelete && !deleting && (
        <button
          onClick={() => setConfirmDelete(false)}
          className="text-xs text-slate-400 hover:text-slate-600 mt-1 cursor-pointer"
        >
          Abbrechen
        </button>
      )}
    </div>
  );
}
