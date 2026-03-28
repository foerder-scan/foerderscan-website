import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/matching
 * Body: { gebaeudetyp, massnahmenarten[], hatISFP, hatWPB, hatSerSan, hatEEKlasse,
 *         haushaltseinkommen, istSelbstgenutzt, altHeizung }
 * Returns matching FoerderProgramme with calculated effective Fördersätze
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
    hatWPB = false,
    hatSerSan = false,
    hatEEKlasse = false,
    haushaltseinkommen,
    istSelbstgenutzt = true,
    altHeizung = false,
  } = body;

  const programme = await prisma.foerderProgramm.findMany({
    where: {
      status: { in: ["AKTIV", "AUSLAUFEND"] },
      AND: [
        {
          OR: [
            { gebaeudetypen: { some: { gebaeudetyp } } },
            { gebaeudetypen: { none: {} } },
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

  const results = programme.map((p) => {
    let effektivSatz = Number(p.basisfördersatz);
    const aktiveBoni: string[] = [];

    for (const bonus of p.boni) {
      const k = bonus.kuerzel.toLowerCase();
      let applicable = false;

      if (k === "isfp" && hatISFP) applicable = true;
      if ((k === "ee_nh" || k === "ee" || k === "nh") && hatEEKlasse) applicable = true;
      if (k === "wpb" && hatWPB) applicable = true;
      if (k === "sersan" && hatSerSan) applicable = true;
      if (k === "effizienz" && hatEEKlasse) applicable = true;
      if (k === "geschwindigkeit" && altHeizung) applicable = true;
      if (
        k === "einkommen" &&
        haushaltseinkommen != null &&
        Number(haushaltseinkommen) <= 40000 &&
        istSelbstgenutzt
      )
        applicable = true;

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
      kreditbetragMax: p.kreditbetragMax,
      aktiveBoni,
      kumulierungsregeln: p.kumulierungsregeln.map((k) => k.beschreibung),
      quellUrl: p.quellUrl,
      hinweise: p.hinweise,
    };
  });

  results.sort((a, b) => b.effektivSatz - a.effektivSatz);

  return NextResponse.json({ results, count: results.length });
}
