import { validateApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/v1/aenderungen
 * Returns recently modified Förderprogramme (changelog feed).
 *
 * Query params:
 *   since — ISO date string (default: 30 days ago)
 *   limit — max results (default 50, max 200)
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

  let since: Date;
  const sinceParam = searchParams.get("since");
  if (sinceParam) {
    since = new Date(sinceParam);
    if (isNaN(since.getTime())) {
      return NextResponse.json({ error: "Ungültiger 'since'-Wert (ISO 8601 erwartet)" }, { status: 400 });
    }
  } else {
    since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  }

  const rawLimit = parseInt(searchParams.get("limit") ?? "50", 10);
  const limit = Math.min(isNaN(rawLimit) ? 50 : rawLimit, 200);

  const items = await prisma.foerderProgramm.findMany({
    where: { letzteModifikation: { gte: since } },
    orderBy: { letzteModifikation: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      kurzname: true,
      foerdergeber: true,
      status: true,
      basisfördersatz: true,
      maxFoerdersatz: true,
      gueltigBis: true,
      letzteModifikation: true,
    },
  });

  return NextResponse.json({
    since: since.toISOString(),
    count: items.length,
    data: items,
  });
}
