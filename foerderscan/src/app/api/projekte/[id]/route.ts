import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const { id } = await params;
  const projekt = await prisma.projekt.findFirst({
    where: { id, userId },
    include: { massnahmen: true, foerderungen: { include: { programm: true } } },
  });
  if (!projekt) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  return NextResponse.json(projekt);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const { id } = await params;
  const projekt = await prisma.projekt.findFirst({ where: { id, userId } });
  if (!projekt) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });

  const body = await req.json();
  const {
    titel, kundeName, kundeEmail, strasse, plz, ort,
    gebaeudetyp, baujahr, notizen, status,
  } = body;

  const updated = await prisma.projekt.update({
    where: { id },
    data: {
      ...(titel !== undefined && { titel: titel.trim() }),
      ...(kundeName !== undefined && { kundeName: kundeName.trim() }),
      ...(kundeEmail !== undefined && { kundeEmail: kundeEmail?.trim() || null }),
      ...(strasse !== undefined && { strasse: strasse?.trim() || null }),
      ...(plz !== undefined && { plz: plz?.trim() || "" }),
      ...(ort !== undefined && { ort: ort?.trim() || null }),
      ...(gebaeudetyp !== undefined && { gebaeudetyp }),
      ...(baujahr !== undefined && { baujahr: baujahr ? Number(baujahr) : null }),
      ...(notizen !== undefined && { notizen: notizen?.trim() || null }),
      ...(status !== undefined && { status }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const { id } = await params;
  const projekt = await prisma.projekt.findFirst({ where: { id, userId } });
  if (!projekt) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });

  await prisma.projekt.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
