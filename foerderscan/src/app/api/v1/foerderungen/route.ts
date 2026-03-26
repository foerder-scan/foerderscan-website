import { validateApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/v1/foerderungen
 * Returns list of active Förderprogramme.
 *
 * Query params:
 *   status       — ProgrammStatus filter (default: AKTIV)
 *   foerdergeber — Foerdergeber filter
 *   limit        — max results (default 50, max 200)
 *   offset       — pagination offset
 */
export async function GET(req: NextRequest) {
  const auth = await validateApiKey(req);
  if (!auth) {
    return NextResponse.json(
      { error: "Unauthorized", hint: "Provide a valid X-API-Key header." },
      { status: 401 }
    );
  }

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status") ?? "AKTIV";
  const foerdergeber = searchParams.get("foerdergeber");
  const rawLimit = parseInt(searchParams.get("limit") ?? "50", 10);
  const limit = Math.min(isNaN(rawLimit) ? 50 : rawLimit, 200);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10) || 0;

  const where: Record<string, unknown> = { status };
  if (foerdergeber) where.foerdergeber = foerdergeber;

  const [total, items] = await Promise.all([
    prisma.foerderProgramm.count({ where }),
    prisma.foerderProgramm.findMany({
      where,
      orderBy: { letzteModifikation: "desc" },
      skip: offset,
      take: limit,
      select: {
        id: true,
        name: true,
        kurzname: true,
        foerdergeber: true,
        foerdersegment: true,
        foerderart: true,
        basisfördersatz: true,
        maxFoerdersatz: true,
        maxFoerderfaehigeKosten: true,
        status: true,
        gueltigAb: true,
        gueltigBis: true,
        bundesweit: true,
        bundesland: true,
        letzteModifikation: true,
        quellUrl: true,
        beschreibung: true,
      },
    }),
  ]);

  return NextResponse.json({
    meta: { total, limit, offset, count: items.length },
    data: items,
  });
}
