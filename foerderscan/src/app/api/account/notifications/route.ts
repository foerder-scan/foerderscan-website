import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const { emailAlertsEnabled } = await req.json();
  if (typeof emailAlertsEnabled !== "boolean") {
    return NextResponse.json({ error: "Ungültiger Wert" }, { status: 400 });
  }

  await prisma.user.update({ where: { id: userId }, data: { emailAlertsEnabled } });
  return NextResponse.json({ ok: true });
}
