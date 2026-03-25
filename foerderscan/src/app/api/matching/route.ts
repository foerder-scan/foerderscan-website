import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/matching
 * Body: { gebaeudetyp, massnahmenarten[], hatISFP, hatEEKlasse, hatNHKlasse, haushaltseinkommen, istSelbstgenutzt }
 * Returns matching FoerderProgramme with calculated Fördersätze
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const body = await req.json();
  const {
    gebaeudetyp = "EFH",
    massnahmenarten = [],
    hatISFP = false,
    hatEEKlasse = false,
    haushaltseinkommen,
    istSelbstgenutzt = true,
  } = body;

  // Find programs matching the building type and measure type
  const programme = await prisma.foerderProgramm.findMany({
    where: {
      status: { in: ["AKTIV", "AUSLAUFEND"] },
      AND: [
        {
          OR: [
            { gebaeudetypen: { some: { gebaeudetyp } } },
            { gebaeudetypen: { none: {} } }, // no restriction = applies to all
          ],
        },
        massnahmenarten.length > 0
          ? {
              OR: [
                { massnahmenarten: { some: { massnahmenart: { in: massnahmenarten } } } },
                { massnahmenarten: { none: {} } },
              ],
            }
          : {},
      ],
    },
    include: {
      boni: true,
      kumulierungsregeln: true,
    },
  });

  // Calculate effective Fördersatz for each program
  const results = programme.map((p) => {
    let effektivSatz = Number(p.basisfördersatz);

    // Apply applicable bonuses
    const aktiveBoni: string[] = [];
    for (const bonus of p.boni) {
      const kuerzel = bonus.kuerzel;
      let applicable = false;
      if (kuerzel === "iSFP" && hatISFP) applicable = true;
      if (kuerzel === "EE" && hatEEKlasse) applicable = true;
      if (kuerzel === "NK" && haushaltseinkommen != null && haushaltseinkommen <= 40000 && istSelbstgenutzt) applicable = true;
      if (kuerzel === "GV" && !hatISFP) applicable = true; // Geschwindigkeitsbonus for oil/gas replacement

      if (applicable) {
        effektivSatz += Number(bonus.bonusSatz);
        aktiveBoni.push(bonus.bezeichnung);
      }
    }

    effektivSatz = Math.min(effektivSatz, Number(p.maxFoerdersatz));

    return {
      id: p.id,
      name: p.name,
      kurzname: p.kurzname,
      foerdergeber: p.foerdergeber,
      foerdersegment: p.foerdersegment,
      foerderart: p.foerderart,
      status: p.status,
      basisfördersatz: Number(p.basisfördersatz),
      effektivSatz,
      maxFoerdersatz: Number(p.maxFoerdersatz),
      maxFoerderfaehigeKosten: p.maxFoerderfaehigeKosten,
      aktiveBoni,
      quellUrl: p.quellUrl,
      hinweise: p.hinweise,
    };
  });

  // Sort by effective rate descending
  results.sort((a, b) => b.effektivSatz - a.effektivSatz);

  return NextResponse.json({ results, count: results.length });
}
