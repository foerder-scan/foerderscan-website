import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { getIp } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/foerderungen?projektId=xxx
 * Returns all ProjektFoerderung for a given project (must belong to user)
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const projektId = searchParams.get("projektId");
  if (!projektId) return NextResponse.json({ error: "projektId fehlt" }, { status: 400 });

  // Verify project belongs to user
  const projekt = await prisma.projekt.findFirst({ where: { id: projektId, userId } });
  if (!projekt) return NextResponse.json({ error: "Projekt nicht gefunden" }, { status: 404 });

  const foerderungen = await prisma.projektFoerderung.findMany({
    where: { projektId },
    include: { programm: { include: { boni: true } } },
  });

  return NextResponse.json(foerderungen);
}

/**
 * POST /api/foerderungen
 * Body: { projektId, programmId, beantragterBetrag?, aktiveBonus?, notizen? }
 * Adds a Förderprogramm to a project
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const body = await req.json();
  const { projektId, programmId, beantragterBetrag, aktiveBonus = [], notizen } = body;

  if (!projektId || !programmId) {
    return NextResponse.json({ error: "projektId und programmId sind Pflichtfelder" }, { status: 400 });
  }

  // Verify project belongs to user
  const projekt = await prisma.projekt.findFirst({ where: { id: projektId, userId } });
  if (!projekt) return NextResponse.json({ error: "Projekt nicht gefunden" }, { status: 404 });

  // Check program exists
  const programm = await prisma.foerderProgramm.findUnique({ where: { id: programmId } });
  if (!programm) return NextResponse.json({ error: "Förderprogramm nicht gefunden" }, { status: 404 });

  const foerderung = await prisma.projektFoerderung.create({
    data: {
      projektId,
      programmId,
      beantragterBetrag: beantragterBetrag ? Number(beantragterBetrag) : null,
      aktiveBonus,
      notizen: notizen?.trim() || null,
    },
    include: { programm: true },
  });

  await logAudit({
    userId,
    aktion: "FOERDERUNG_HINZUGEFUEGT",
    ressource: foerderung.id,
    details: { projektId, programmId, programmName: programm.name },
    ipAdresse: getIp(req),
  });

  return NextResponse.json(foerderung, { status: 201 });
}

/**
 * DELETE /api/foerderungen?id=xxx
 */
export async function DELETE(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id fehlt" }, { status: 400 });

  // Verify ownership via project
  const foerderung = await prisma.projektFoerderung.findFirst({
    where: { id },
    include: { projekt: true },
  });

  if (!foerderung || foerderung.projekt.userId !== userId) {
    return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  }

  await prisma.projektFoerderung.delete({ where: { id } });

  await logAudit({
    userId,
    aktion: "FOERDERUNG_ENTFERNT",
    ressource: id,
    details: { projektId: foerderung.projektId },
    ipAdresse: getIp(req),
  });

  return NextResponse.json({ ok: true });
}
