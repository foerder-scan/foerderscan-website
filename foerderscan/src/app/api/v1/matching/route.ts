import { validateApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/v1/matching
 * Returns matching Förderprogramme for given project parameters.
 *
 * Body:
 *   gebaeudetyp     — Gebaeudetyp enum value
 *   massnahmenarten — array of Massnahmenart enum values
 *   hatISFP         — boolean (optional)
 *   hatEEKlasse     — boolean (optional)
 */
export async function POST(req: NextRequest) {
  const auth = await validateApiKey(req);
  if (!auth) {
    return NextResponse.json(
      { error: "Unauthorized", hint: "Provide a valid X-API-Key header." },
      { status: 401 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { gebaeudetyp, massnahmenarten, hatISFP, hatEEKlasse } = body as {
    gebaeudetyp?: string;
    massnahmenarten?: string[];
    hatISFP?: boolean;
    hatEEKlasse?: boolean;
  };

  if (!gebaeudetyp) {
    return NextResponse.json({ error: "gebaeudetyp ist erforderlich" }, { status: 400 });
  }

  const where: Record<string, unknown> = {
    status: "AKTIV",
    gebaeudetypen: { some: { gebaeudetyp } },
  };

  if (massnahmenarten && massnahmenarten.length > 0) {
    where.massnahmenarten = { some: { massnahmenart: { in: massnahmenarten } } };
  }

  const programme = await prisma.foerderProgramm.findMany({
    where,
    orderBy: { maxFoerdersatz: "desc" },
    take: 20,
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
      gueltigBis: true,
      boni: {
        select: { bezeichnung: true, kuerzel: true, bonusSatz: true },
      },
    },
  });

  // Apply bonus hints
  const results = programme.map((p) => {
    let hinweis: string | null = null;
    if (hatISFP && p.foerderart !== "KREDIT") hinweis = "ISFP-Bonus möglicherweise anwendbar";
    if (hatEEKlasse) hinweis = "EE-Klasse-Bonus möglicherweise anwendbar";
    return { ...p, hinweis };
  });

  return NextResponse.json({ count: results.length, data: results });
}
