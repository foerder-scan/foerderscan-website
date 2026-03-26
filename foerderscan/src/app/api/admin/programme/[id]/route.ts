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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Kein Zugriff" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  const programm = await prisma.foerderProgramm.update({
    where: { id },
    data: {
      name: body.name,
      kurzname: body.kurzname || null,
      foerdergeber: body.foerdergeber as Foerdergeber,
      foerdersegment: body.foerdersegment as Foerdersegment,
      foerderart: body.foerderart as Foerderart,
      basisfördersatz: body.basisfördersatz,
      maxFoerdersatz: body.maxFoerdersatz,
      maxFoerderfaehigeKosten: body.maxFoerderfaehigeKosten || null,
      status: body.status as ProgrammStatus,
      beschreibung: body.beschreibung || null,
      quellUrl: body.quellUrl || null,
      letzteModifikation: new Date(),
    },
  });

  return NextResponse.json(programm);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Kein Zugriff" }, { status: 403 });

  const { id } = await params;
  await prisma.foerderProgramm.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
