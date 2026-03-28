import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getStripe } from "@/lib/stripe";
import {
  Users,
  Activity,
  TrendingUp,
  Database,
  Key,
  Webhook,
  FileText,
  CreditCard,
  Euro,
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  const [
    totalUsers,
    tierCounts,
    totalProjekte,
    totalFoerderungen,
    totalApiKeys,
    totalWebhooks,
    recentUsers,
    recentProjekte,
    recentAuditLogs,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.subscription.groupBy({ by: ["tier"], _count: true }),
    prisma.projekt.count(),
    prisma.projektFoerderung.count(),
    prisma.apiKey.count({ where: { isActive: true } }),
    prisma.webhookEndpoint.count({ where: { isActive: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        subscription: { select: { tier: true } },
      },
    }),
    prisma.projekt.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        titel: true,
        gebaeudetyp: true,
        status: true,
        createdAt: true,
        user: { select: { email: true } },
      },
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        aktion: true,
        ressource: true,
        userId: true,
        ipAdresse: true,
        createdAt: true,
      },
    }),
  ]);

  const tierMap: Record<string, number> = {};
  for (const t of tierCounts) {
    tierMap[t.tier] = t._count;
  }

  return {
    totalUsers,
    tierMap,
    totalProjekte,
    totalFoerderungen,
    totalApiKeys,
    totalWebhooks,
    recentUsers,
    recentProjekte,
    recentAuditLogs,
  };
}

async function getStripeStats() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.startsWith("sk_placeholder") || key === "") {
    return null;
  }
  try {
    const stripe = getStripe();
    const [subs, charges] = await Promise.all([
      stripe.subscriptions.list({ status: "active", limit: 100, expand: ["data.items.data.price"] }),
      stripe.charges.list({ limit: 100, created: { gte: Math.floor(Date.now() / 1000) - 30 * 86400 } }),
    ]);

    const mrr = subs.data.reduce((sum, sub) => {
      const item = sub.items.data[0];
      if (!item?.price) return sum;
      const amount = item.price.unit_amount ?? 0;
      const interval = item.price.recurring?.interval;
      const monthly = interval === "year" ? amount / 12 : amount;
      return sum + monthly;
    }, 0);

    const revenue30d = charges.data
      .filter((c) => c.status === "succeeded")
      .reduce((sum, c) => sum + c.amount, 0);

    return {
      activeSubscriptions: subs.data.length,
      mrr: mrr / 100,
      revenue30d: revenue30d / 100,
    };
  } catch {
    return null;
  }
}

export default async function CmdDashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Only SUPER_ADMIN can access
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (user?.role !== "SUPER_ADMIN") redirect("/dashboard");

  const [stats, stripeStats] = await Promise.all([getStats(), getStripeStats()]);

  const TIER_LABELS: Record<string, string> = {
    FREE: "Free",
    STARTER: "Starter",
    PROFESSIONAL: "Professional",
    ENTERPRISE: "Enterprise",
  };

  const TIER_COLORS: Record<string, string> = {
    FREE: "bg-slate-100 text-slate-600",
    STARTER: "bg-blue-100 text-blue-700",
    PROFESSIONAL: "bg-violet-100 text-violet-700",
    ENTERPRISE: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">SUPER_ADMIN</span>
          <span>/</span>
          <span>CMD-Dashboard</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">CMD-Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Systemstatus, Nutzerstatistiken und Audit-Logs
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Nutzer gesamt", value: stats.totalUsers, icon: Users, color: "text-blue-600" },
          { label: "Projekte", value: stats.totalProjekte, icon: FileText, color: "text-violet-600" },
          { label: "Förderungen", value: stats.totalFoerderungen, icon: TrendingUp, color: "text-emerald-600" },
          { label: "API Keys", value: stats.totalApiKeys, icon: Key, color: "text-amber-600" },
          { label: "Webhooks", value: stats.totalWebhooks, icon: Webhook, color: "text-rose-600" },
          {
            label: "Paid Users",
            value:
              (stats.tierMap["STARTER"] ?? 0) +
              (stats.tierMap["PROFESSIONAL"] ?? 0) +
              (stats.tierMap["ENTERPRISE"] ?? 0),
            icon: Activity,
            color: "text-[#1B4F72]",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-2"
          >
            <Icon size={16} className={color} />
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className="text-xs text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Stripe Revenue */}
      {stripeStats ? (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "MRR", value: `${stripeStats.mrr.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })}`, icon: Euro, color: "text-emerald-600" },
            { label: "Aktive Abos", value: stripeStats.activeSubscriptions, icon: CreditCard, color: "text-[#1B4F72]" },
            { label: "Umsatz 30d", value: `${stripeStats.revenue30d.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })}`, icon: TrendingUp, color: "text-violet-600" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-emerald-50 rounded-xl border border-emerald-100 p-4 flex flex-col gap-2">
              <Icon size={16} className={color} />
              <div className="text-2xl font-bold text-slate-900">{value}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-xl border border-slate-200 px-5 py-3 text-xs text-slate-400 flex items-center gap-2">
          <CreditCard size={13} />
          Stripe-Reporting nicht verfügbar – STRIPE_SECRET_KEY nicht gesetzt.
        </div>
      )}

      {/* Tier distribution */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Database size={16} />
          Tier-Verteilung
        </h2>
        <div className="flex flex-wrap gap-3">
          {["FREE", "STARTER", "PROFESSIONAL", "ENTERPRISE"].map((tier) => (
            <div
              key={tier}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${TIER_COLORS[tier]}`}
            >
              {TIER_LABELS[tier]}: <strong>{stats.tierMap[tier] ?? 0}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <Users size={16} />
              Neueste Nutzer
            </h2>
          </div>
          <div className="divide-y divide-slate-50">
            {stats.recentUsers.map((u) => (
              <div key={u.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-800">
                    {u.name ?? u.email}
                  </div>
                  {u.name && (
                    <div className="text-xs text-slate-400">{u.email}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      TIER_COLORS[u.subscription?.tier ?? "FREE"]
                    }`}
                  >
                    {TIER_LABELS[u.subscription?.tier ?? "FREE"]}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString("de-DE")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Logs */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <Activity size={16} />
              Audit-Log (letzte 20)
            </h2>
          </div>
          <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
            {stats.recentAuditLogs.map((log) => (
              <div key={log.id} className="px-6 py-2.5 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-xs text-slate-700 bg-slate-50 px-1.5 py-0.5 rounded">
                    {log.aktion}
                  </span>
                  {log.ressource && (
                    <span className="text-xs text-slate-400 ml-2 truncate">
                      {log.ressource}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {log.ipAdresse && (
                    <span className="text-xs text-slate-300 font-mono">
                      {log.ipAdresse}
                    </span>
                  )}
                  <span className="text-xs text-slate-400">
                    {new Date(log.createdAt).toLocaleTimeString("de-DE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            {stats.recentAuditLogs.length === 0 && (
              <div className="px-6 py-8 text-center text-sm text-slate-400">
                Keine Einträge vorhanden
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <FileText size={16} />
            Neueste Projekte
          </h2>
        </div>
        <div className="divide-y divide-slate-50">
          {stats.recentProjekte.map((p) => (
            <div key={p.id} className="px-6 py-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-800">{p.titel}</div>
                <div className="text-xs text-slate-400">{p.user.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  {p.gebaeudetyp}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(p.createdAt).toLocaleDateString("de-DE")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
