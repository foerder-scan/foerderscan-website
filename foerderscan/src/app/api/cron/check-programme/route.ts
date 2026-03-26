import { prisma } from "@/lib/prisma";
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

  // 2. Programme die in 30 Tagen ablaufen → AUSLAUFEND
  const in30days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
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
