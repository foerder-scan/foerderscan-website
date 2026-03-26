import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Zap, Shield, FileText, BarChart2, Bell } from "lucide-react";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Alle Neuerungen und Updates auf FörderScan – transparente Produktentwicklung.",
};

const RELEASES = [
  {
    version: "1.2.0",
    date: "2026-03-26",
    badge: "Neu",
    badgeColor: "bg-[#EAFAF1] text-[#27AE60] border-[#27AE60]/20",
    title: "KI-Matching, PDF-Export & Sicherheit",
    icon: Zap,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    changes: [
      { type: "feature", text: "KI-Matching: Förderprogramme automatisch zu Projekten vorschlagen" },
      { type: "feature", text: "PDF-Export: Professionelle Förderberichte per Knopfdruck drucken" },
      { type: "feature", text: "Passwort zurücksetzen via E-Mail (Forgot Password Flow)" },
      { type: "feature", text: "Cookie-Banner (DSGVO-konform) mit Accept/Reject" },
      { type: "feature", text: "Audit-Log: Alle wichtigen Aktionen werden protokolliert" },
      { type: "feature", text: "Benachrichtigungen: E-Mail-Warnung bei auslaufenden Programmen" },
      { type: "improvement", text: "Sicherheits-Header: CSP, HSTS, X-Frame-Options" },
      { type: "improvement", text: "Rate-Limiting für Login, Registrierung und Kontaktformular" },
      { type: "improvement", text: "Zod-Validierung für alle API-Eingaben" },
    ],
  },
  {
    version: "1.1.0",
    date: "2026-03-10",
    badge: "Stabil",
    badgeColor: "bg-[#EBF5FB] text-[#1B4F72] border-[#1B4F72]/20",
    title: "Dashboard, Projekte & Förderdatenbank",
    icon: BarChart2,
    iconBg: "bg-[#EBF5FB]",
    iconColor: "text-[#1B4F72]",
    changes: [
      { type: "feature", text: "Projekt-Dashboard mit Förderübersicht und Statistiken" },
      { type: "feature", text: "Projekte anlegen, bearbeiten und verwalten" },
      { type: "feature", text: "Förderprogramme Datenbank mit Admin-Panel" },
      { type: "feature", text: "Förderrechner: BEG-Programme in Echtzeit berechnen" },
      { type: "feature", text: "Förderdatenbank: öffentlich durchsuchbar" },
      { type: "feature", text: "Stripe-Integration für Abonnements (Starter / Professional)" },
      { type: "feature", text: "Stripe-Kundenportal direkt aus dem Dashboard" },
    ],
  },
  {
    version: "1.0.0",
    date: "2026-02-20",
    badge: "Launch",
    badgeColor: "bg-slate-100 text-slate-600 border-slate-200",
    title: "Launch – Grundfunktionen",
    icon: Shield,
    iconBg: "bg-slate-50",
    iconColor: "text-slate-500",
    changes: [
      { type: "feature", text: "E-Mail-Registrierung und Login (NextAuth v5)" },
      { type: "feature", text: "E-Mail-Verifikation beim Account-Erstellen" },
      { type: "feature", text: "Landing Page mit Hero, Features und Preisseite" },
      { type: "feature", text: "Über uns, FAQ, Impressum und Datenschutz" },
      { type: "feature", text: "Responsive Design für Desktop und Mobile" },
    ],
  },
];

const TYPE_STYLE: Record<string, string> = {
  feature: "bg-[#EAFAF1] text-[#27AE60]",
  improvement: "bg-[#EBF5FB] text-[#1B4F72]",
  fix: "bg-red-50 text-red-600",
};

const TYPE_LABEL: Record<string, string> = {
  feature: "Neu",
  improvement: "Verbessert",
  fix: "Behoben",
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#1B4F72] flex items-center justify-center">
              <FileText size={15} className="text-white" />
            </div>
            <Link href="/" className="text-sm font-semibold text-[#1B4F72] hover:text-[#154360]">
              FörderScan
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Changelog</h1>
          <p className="text-base text-slate-500 max-w-xl">
            Alle Neuerungen, Verbesserungen und Bugfixes – transparent und laufend aktuell.
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-10">
          {RELEASES.map((release, idx) => {
            const Icon = release.icon;
            return (
              <div key={release.version} className="relative flex gap-6">
                {/* Timeline line */}
                {idx < RELEASES.length - 1 && (
                  <div className="absolute left-[19px] top-12 w-px h-full bg-slate-200" />
                )}

                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl ${release.iconBg} flex items-center justify-center shrink-0 mt-0.5 border border-slate-200 z-10`}>
                  <Icon size={18} className={release.iconColor} strokeWidth={1.75} />
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6">
                  {/* Meta */}
                  <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-extrabold text-slate-900">v{release.version}</span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${release.badgeColor}`}>
                          {release.badge}
                        </span>
                      </div>
                      <h2 className="text-sm font-semibold text-slate-600">{release.title}</h2>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">
                      {new Date(release.date).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}
                    </span>
                  </div>

                  {/* Changes */}
                  <ul className="space-y-2">
                    {release.changes.map((change, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                          <CheckCircle2 size={13} className="text-slate-300" />
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${TYPE_STYLE[change.type] ?? "bg-slate-100 text-slate-500"}`}>
                            {TYPE_LABEL[change.type] ?? change.type}
                          </span>
                        </div>
                        <span className="text-sm text-slate-700">{change.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-14 text-center">
          <Bell size={20} className="text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500 mb-4">
            Feedback oder Feature-Wünsche?
          </p>
          <Link
            href="/kontakt"
            className="inline-flex items-center gap-2 bg-[#1B4F72] hover:bg-[#154360] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            Nachricht senden
          </Link>
        </div>
      </div>
    </div>
  );
}
