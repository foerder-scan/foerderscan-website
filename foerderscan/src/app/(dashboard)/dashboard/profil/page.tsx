import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User, Mail, Calendar, CheckCircle2, Zap } from "lucide-react";
import { StripePortalButton, UpgradePanel, AccountActions } from "./ProfilActions";
import NotificationSettings from "./NotificationSettings";
import ApiKeyManager from "./ApiKeyManager";
import TwoFactorSetup from "./TwoFactorSetup";

const TIER_INFO: Record<string, {
  label: string;
  color: string;
  bg: string;
  border: string;
  features: string[];
}> = {
  FREE: {
    label: "Free",
    color: "text-slate-700",
    bg: "bg-slate-50",
    border: "border-slate-200",
    features: ["3 Projekte", "Förderrechner", "Förderdatenbank (Basis)"],
  },
  STARTER: {
    label: "Starter",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    features: ["10 Projekte", "Förderrechner", "Förderdatenbank (vollständig)", "PDF-Export"],
  },
  PROFESSIONAL: {
    label: "Professional",
    color: "text-[#1B4F72]",
    bg: "bg-[#EBF5FB]",
    border: "border-[#1B4F72]/20",
    features: ["Unbegrenzte Projekte", "Alle Förderprogramme", "KI-Matching", "PDF-Export", "Kundenportal", "API-Zugang"],
  },
  ENTERPRISE: {
    label: "Enterprise",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    features: ["Alles aus Professional", "Unbegrenzte Nutzer", "White-Label", "Dedizierter Support", "SLA"],
  },
};

const UPGRADE_OPTIONS = [
  { tier: "STARTER",      label: "Starter",      price: "49 €/Monat",   highlight: false },
  { tier: "PROFESSIONAL", label: "Professional", price: "149 €/Monat",  highlight: true  },
  { tier: "ENTERPRISE",   label: "Enterprise",   price: "Auf Anfrage",  highlight: false },
];

export default async function ProfilPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true, apiKeys: { where: { isActive: true } } },
  });
  if (!user) return null;

  const tier = user.subscription?.tier ?? "FREE";
  const tierInfo = TIER_INFO[tier] ?? TIER_INFO.FREE;
  const initials = (user.name ?? user.email ?? "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const projectCount = await prisma.projekt.count({ where: { userId } });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Profil & Abo</h1>
        <p className="text-sm text-slate-500 mt-0.5">Konto- und Aboverwaltung</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-5">
          {/* Profil */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-5">Profilinformationen</h2>
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#1B4F72] text-white text-lg font-extrabold flex items-center justify-center shrink-0">
                {initials}
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                      <User size={11} /> Name
                    </label>
                    <div className="text-sm font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50">
                      {user.name ?? "–"}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                      <Mail size={11} /> E-Mail
                    </label>
                    <div className="text-sm font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50">
                      {user.email}
                    </div>
                  </div>
                  {user.beraternummer && (
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                        <Zap size={11} /> Beraternummer
                      </label>
                      <div className="text-sm font-mono font-semibold text-slate-800 border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50">
                        {user.beraternummer}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                    <Calendar size={11} /> Mitglied seit
                  </label>
                  <div className="text-sm text-slate-600 border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50">
                    {new Date(user.createdAt).toLocaleDateString("de-DE", {
                      day: "2-digit", month: "long", year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nutzung */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-4">Nutzungsübersicht</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-100 rounded-xl p-4">
                <div className="text-2xl font-extrabold text-slate-900">{projectCount}</div>
                <div className="text-xs text-slate-500 mt-0.5">Angelegte Projekte</div>
                {tier === "FREE" && (
                  <div className="mt-2">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Kontingent</span>
                      <span>{projectCount}/3</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${projectCount >= 3 ? "bg-red-400" : "bg-[#27AE60]"}`}
                        style={{ width: `${Math.min((projectCount / 3) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="border border-slate-100 rounded-xl p-4">
                <div className="text-2xl font-extrabold text-slate-900">
                  <span className={`text-sm font-bold px-2 py-1 rounded-full ${tierInfo.bg} ${tierInfo.color}`}>
                    {tierInfo.label}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-2">Aktueller Plan</div>
              </div>
            </div>
            <div className="mt-4 border border-slate-100 rounded-xl p-4">
              <div className="text-xs font-semibold text-slate-600 mb-2">Enthaltene Funktionen</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {tierInfo.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle2 size={12} className="text-[#27AE60] shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2FA */}
          <TwoFactorSetup initialEnabled={user.twoFactorEnabled} />

          {/* Benachrichtigungen */}
          <NotificationSettings initialEnabled={user.emailAlertsEnabled} />

          {/* API-Keys */}
          {(tier === "PROFESSIONAL" || tier === "ENTERPRISE") && (
            <ApiKeyManager />
          )}

          {/* Abonnement */}
          {user.subscription && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-sm font-bold text-slate-800 mb-4">Abonnement</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Status</span>
                  <span className={`font-semibold ${user.subscription.status === "active" ? "text-[#27AE60]" : "text-amber-600"}`}>
                    {user.subscription.status === "active" ? "Aktiv" : user.subscription.status}
                  </span>
                </div>
                {user.subscription.currentPeriodEnd && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Nächste Abrechnung</span>
                    <span className="font-semibold text-slate-700">
                      {new Date(user.subscription.currentPeriodEnd).toLocaleDateString("de-DE")}
                    </span>
                  </div>
                )}
                <StripePortalButton />
              </div>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="space-y-4">
          {(tier === "FREE" || tier === "STARTER") ? (
            <UpgradePanel currentTier={tier} options={UPGRADE_OPTIONS} />
          ) : (
            <div className={`rounded-2xl border p-5 ${tierInfo.border} ${tierInfo.bg}`}>
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className={tierInfo.color} />
                <span className={`text-xs font-bold ${tierInfo.color}`}>{tierInfo.label}</span>
              </div>
              <p className={`text-xs ${tierInfo.color} opacity-70 leading-relaxed`}>
                Sie nutzen den vollen Funktionsumfang von FörderScan.
              </p>
            </div>
          )}
          <AccountActions />
        </div>
      </div>
    </div>
  );
}
