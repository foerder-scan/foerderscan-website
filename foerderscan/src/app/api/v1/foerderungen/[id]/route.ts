import { validateApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/v1/foerderungen/{id}
 * Returns a single Förderprogramm with all details including boni and rules.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await validateApiKey(req);
  if (!auth) {
    return NextResponse.json(
      { error: "Unauthorized", hint: "Provide a valid X-API-Key header." },
      { status: 401 }
    );
  }

  const { id } = await params;

  const programm = await prisma.foerderProgramm.findUnique({
    where: { id },
    include: {
      boni: true,
      kumulierungsregeln: true,
      gebaeudetypen: true,
      massnahmenarten: true,
    },
  });

  if (!programm) {
    return NextResponse.json({ error: "Programm nicht gefunden" }, { status: 404 });
  }

  return NextResponse.json({ data: programm });
}
