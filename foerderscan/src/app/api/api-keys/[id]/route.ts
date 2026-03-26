import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { getIp } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

// DELETE /api/api-keys/[id] — revoke key
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const key = await prisma.apiKey.findFirst({ where: { id, userId } });
  if (!key) return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });

  await prisma.apiKey.update({ where: { id }, data: { isActive: false } });
  await logAudit({ userId, aktion: "API_KEY_WIDERRUFEN", ressource: id, ipAdresse: getIp(req) });

  return NextResponse.json({ ok: true });
}
