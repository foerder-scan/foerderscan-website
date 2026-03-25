import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const body = await req.json();
  const {
    titel,
    kundeName,
    kundeEmail,
    strasse,
    plz,
    ort,
    gebaeudetyp,
    baujahr,
    notizen,
    massnahmen = [],
  } = body;

  if (!titel?.trim() || !kundeName?.trim()) {
    return NextResponse.json({ error: "Titel und Kundenname sind Pflichtfelder" }, { status: 400 });
  }

  const projekt = await prisma.projekt.create({
    data: {
      titel: titel.trim(),
      kundeName: kundeName.trim(),
      kundeEmail: kundeEmail?.trim() || null,
      strasse: strasse?.trim() || null,
      plz: plz?.trim() || "",
      ort: ort?.trim() || null,
      gebaeudetyp: gebaeudetyp || "EFH",
      baujahr: baujahr ? Number(baujahr) : null,
      notizen: notizen?.trim() || null,
      status: "RECHERCHE",
      userId,
      massnahmen: {
        create: massnahmen.map((m: { massnahmenart: string; investitionskosten?: number | null; beschreibung?: string }) => ({
          massnahmenart: m.massnahmenart,
          investitionskosten: m.investitionskosten ?? null,
          beschreibung: m.beschreibung?.trim() || null,
        })),
      },
    },
  });

  return NextResponse.json({ id: projekt.id }, { status: 201 });
}

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const projekte = await prisma.projekt.findMany({
    where: { userId },
    include: { massnahmen: true, foerderungen: { include: { programm: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(projekte);
}
