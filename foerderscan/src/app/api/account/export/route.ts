import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/account/export — DSGVO data export (Art. 20 DSGVO)
export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      projekte: {
        include: {
          massnahmen: true,
          foerderungen: {
            include: { programm: { select: { name: true, foerdergeber: true } } },
          },
          dokumente: true,
        },
      },
      apiKeys: {
        where: { isActive: true },
        select: { name: true, keyPrefix: true, createdAt: true, lastUsedAt: true },
      },
      subscription: {
        select: { tier: true, status: true, currentPeriodEnd: true },
      },
    },
  });

  if (!user) return NextResponse.json({ error: "Nutzer nicht gefunden" }, { status: 404 });

  const exportData = {
    exportiert_am: new Date().toISOString(),
    konto: {
      id: user.id,
      email: user.email,
      name: user.name,
      unternehmen: user.company,
      telefon: user.phone,
      rolle: user.role,
      registriert_am: user.createdAt,
      letzter_login: user.lastLoginAt,
      email_alerts: user.emailAlertsEnabled,
    },
    abonnement: user.subscription ?? null,
    projekte: user.projekte.map((p) => ({
      id: p.id,
      titel: p.titel,
      kundeName: p.kundeName,
      kundeEmail: p.kundeEmail,
      ort: p.ort,
      plz: p.plz,
      gebaeudetyp: p.gebaeudetyp,
      status: p.status,
      erstellt_am: p.createdAt,
      massnahmen: p.massnahmen,
      foerderungen: p.foerderungen,
    })),
    api_keys: user.apiKeys,
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="foerderscan-daten-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
