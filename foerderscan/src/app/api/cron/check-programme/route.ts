import { prisma } from "@/lib/prisma";
import { sendProgrammAuslaufendEmail } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";

// Vercel Cron: täglich um 06:00 Uhr (in vercel.json konfiguriert)
// Prüft Förderprogramme auf abgelaufene Gültigkeitsdaten und setzt Status

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  // Sicherheit: nur interne Vercel-Cron-Aufrufe erlauben
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  let updated = 0;

  // 1. Programme die abgelaufen sind → BEENDET
  const abgelaufen = await prisma.foerderProgramm.updateMany({
    where: {
      status: { in: ["AKTIV", "AUSLAUFEND"] },
      gueltigBis: { lt: now },
    },
    data: {
      status: "BEENDET",
      letzteAutoPruefung: now,
    },
  });
  updated += abgelaufen.count;

  // 2. Programme die in 30 Tagen ablaufen → AUSLAUFEND (mit Nutzerbenachrichtigung)
  const in30days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Collect newly-expiring programs before updating
  const neuAuslaufend = await prisma.foerderProgramm.findMany({
    where: {
      status: "AKTIV",
      gueltigBis: { gte: now, lte: in30days },
    },
    select: { id: true, name: true, gueltigBis: true },
  });

  const auslaufend = await prisma.foerderProgramm.updateMany({
    where: {
      status: "AKTIV",
      gueltigBis: { gte: now, lte: in30days },
    },
    data: {
      status: "AUSLAUFEND",
      letzteAutoPruefung: now,
    },
  });
  updated += auslaufend.count;

  // Notify affected users
  if (neuAuslaufend.length > 0) {
    const programmIds = neuAuslaufend.map((p) => p.id);

    // Find users who have these programs in their projects
    const betroffene = await prisma.projektFoerderung.findMany({
      where: { programmId: { in: programmIds } },
      include: {
        projekt: { include: { user: { select: { id: true, email: true, name: true } } } },
        programm: { select: { id: true, name: true, gueltigBis: true } },
      },
    });

    // Group by user
    const byUser = new Map<string, { email: string; name: string | null; programmes: { name: string; gueltigBis: Date | null }[] }>();
    for (const f of betroffene) {
      const user = f.projekt.user;
      if (!byUser.has(user.id)) {
        byUser.set(user.id, { email: user.email, name: user.name, programmes: [] });
      }
      const entry = byUser.get(user.id)!;
      if (!entry.programmes.some((p) => p.name === f.programm.name)) {
        entry.programmes.push({ name: f.programm.name, gueltigBis: f.programm.gueltigBis });
      }
    }

    // Send one email per user (ignore errors)
    for (const { email, name, programmes } of byUser.values()) {
      await sendProgrammAuslaufendEmail(email, name, programmes).catch(() => {});
    }
  }

  // 3. Angekündigte Programme die ab heute gelten → AKTIV
  const aktiviert = await prisma.foerderProgramm.updateMany({
    where: {
      status: "ANGEKUENDIGT",
      gueltigAb: { lte: now },
    },
    data: {
      status: "AKTIV",
      letzteAutoPruefung: now,
    },
  });
  updated += aktiviert.count;

  // Alle als geprüft markieren
  await prisma.foerderProgramm.updateMany({
    where: { letzteAutoPruefung: null },
    data: { letzteAutoPruefung: now },
  });

  return NextResponse.json({
    ok: true,
    timestamp: now.toISOString(),
    changes: {
      beendet: abgelaufen.count,
      auslaufend: auslaufend.count,
      aktiviert: aktiviert.count,
      total: updated,
    },
  });
}
