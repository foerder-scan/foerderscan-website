import { validateApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// PLZ-Prefix → Bundesland mapping (simplified)
const PLZ_TO_BUNDESLAND: Record<string, string> = {
  "0": "Sachsen",
  "1": "Berlin / Brandenburg",
  "2": "Hamburg / Schleswig-Holstein / Mecklenburg-Vorpommern",
  "3": "Niedersachsen / Sachsen-Anhalt",
  "4": "Nordrhein-Westfalen",
  "5": "Nordrhein-Westfalen / Rheinland-Pfalz",
  "6": "Hessen / Rheinland-Pfalz",
  "7": "Baden-Württemberg",
  "8": "Bayern",
  "9": "Bayern / Thüringen / Sachsen",
};

function plzToBundesland(plz: string): string | null {
  if (!plz || plz.length < 1) return null;
  return PLZ_TO_BUNDESLAND[plz[0]] ?? null;
}

/**
 * GET /api/v1/regionen/{plz}
 * Returns Förderprogramme available for a specific PLZ (Landesförderungen + bundesweit).
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ plz: string }> }) {
  const auth = await validateApiKey(req);
  if (!auth) {
    return NextResponse.json(
      { error: "Unauthorized", hint: "Provide a valid X-API-Key header." },
      { status: 401 }
    );
  }

  const { plz } = await params;

  if (!/^\d{5}$/.test(plz)) {
    return NextResponse.json({ error: "Ungültige PLZ (5 Ziffern erwartet)" }, { status: 400 });
  }

  const bundesland = plzToBundesland(plz);

  // Bundesweite Programme + Landesförderungen für dieses Bundesland
  const where = bundesland
    ? { status: "AKTIV" as const, OR: [{ bundesweit: true }, { bundesland }] }
    : { status: "AKTIV" as const, bundesweit: true };

  const programme = await prisma.foerderProgramm.findMany({
    where,
    orderBy: [{ bundesweit: "desc" }, { maxFoerdersatz: "desc" }],
    select: {
      id: true,
      name: true,
      kurzname: true,
      foerdergeber: true,
      foerdersegment: true,
      foerderart: true,
      basisfördersatz: true,
      maxFoerdersatz: true,
      status: true,
      bundesweit: true,
      bundesland: true,
      gueltigBis: true,
    },
  });

  const bundesweit = programme.filter((p) => p.bundesweit);
  const regional = programme.filter((p) => !p.bundesweit);

  return NextResponse.json({
    plz,
    bundesland: bundesland ?? "Unbekannt",
    summary: { bundesweit: bundesweit.length, regional: regional.length, gesamt: programme.length },
    data: { bundesweit, regional },
  });
}
