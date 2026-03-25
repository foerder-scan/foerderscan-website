import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Foerdergeber } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const foerdergeber = searchParams.get("foerdergeber");

  const programme = await prisma.foerderProgramm.findMany({
    where: {
      status: { in: ["AKTIV", "AUSLAUFEND"] },
      ...(foerdergeber && foerdergeber !== "alle" ? { foerdergeber: foerdergeber as Foerdergeber } : {}),
      ...(q ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { kurzname: { contains: q, mode: "insensitive" } },
        ],
      } : {}),
    },
    include: { boni: true },
    orderBy: [{ foerdergeber: "asc" }, { name: "asc" }],
    take: 20,
  });

  return NextResponse.json(programme);
}
