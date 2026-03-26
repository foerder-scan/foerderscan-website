import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Foerdergeber, Foerdersegment, Foerderart, ProgrammStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== "SUPER_ADMIN" && user?.role !== "REDAKTEUR") return null;
  return user;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Kein Zugriff" }, { status: 403 });

  const programme = await prisma.foerderProgramm.findMany({
    include: { boni: true },
    orderBy: [{ status: "asc" }, { foerdergeber: "asc" }, { name: "asc" }],
  });
  return NextResponse.json(programme);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Kein Zugriff" }, { status: 403 });

  const body = await req.json();

  const programm = await prisma.foerderProgramm.create({
    data: {
      name: body.name,
      kurzname: body.kurzname || null,
      foerdergeber: body.foerdergeber as Foerdergeber,
      foerdersegment: body.foerdersegment as Foerdersegment,
      foerderart: body.foerderart as Foerderart,
      basisfördersatz: body.basisfördersatz,
      maxFoerdersatz: body.maxFoerdersatz,
      maxFoerderfaehigeKosten: body.maxFoerderfaehigeKosten || null,
      status: (body.status as ProgrammStatus) || "AKTIV",
      beschreibung: body.beschreibung || null,
      quellUrl: body.quellUrl || null,
      bundesweit: body.bundesweit !== false,
    },
  });

  return NextResponse.json(programm, { status: 201 });
}
