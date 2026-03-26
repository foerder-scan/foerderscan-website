import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{ id: string }>;
}

// PATCH /api/webhooks/[id] — toggle active or update events
export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const { id } = await params;
  const endpoint = await prisma.webhookEndpoint.findUnique({ where: { id } });

  if (!endpoint || endpoint.userId !== userId) {
    return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  }

  const body = await req.json();
  const data: Record<string, unknown> = {};

  if (typeof body.isActive === "boolean") data.isActive = body.isActive;
  if (Array.isArray(body.events)) data.events = body.events;
  if (typeof body.url === "string") data.url = body.url;

  const updated = await prisma.webhookEndpoint.update({ where: { id }, data });
  return NextResponse.json(updated);
}

// DELETE /api/webhooks/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const { id } = await params;
  const endpoint = await prisma.webhookEndpoint.findUnique({ where: { id } });

  if (!endpoint || endpoint.userId !== userId) {
    return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  }

  await prisma.webhookEndpoint.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
