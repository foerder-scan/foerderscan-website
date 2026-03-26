import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateWebhookSecret } from "@/lib/webhook";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_EVENTS = [
  "projekt.created",
  "projekt.updated",
  "projekt.deleted",
  "foerderung.created",
  "foerderung.updated",
  "subscription.changed",
];

// GET /api/webhooks — list user's endpoints
export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const endpoints = await prisma.webhookEndpoint.findMany({
    where: { userId },
    include: {
      deliveries: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, event: true, success: true, statusCode: true, createdAt: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(endpoints);
}

// POST /api/webhooks — create endpoint
export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const { url, events } = await req.json();

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL erforderlich" }, { status: 400 });
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Ungültige URL" }, { status: 400 });
  }

  if (!Array.isArray(events) || events.length === 0) {
    return NextResponse.json({ error: "Mindestens ein Event erforderlich" }, { status: 400 });
  }

  const invalidEvents = events.filter((e) => !ALLOWED_EVENTS.includes(e));
  if (invalidEvents.length > 0) {
    return NextResponse.json(
      { error: `Ungültige Events: ${invalidEvents.join(", ")}` },
      { status: 400 }
    );
  }

  // Limit to 5 endpoints per user
  const count = await prisma.webhookEndpoint.count({ where: { userId } });
  if (count >= 5) {
    return NextResponse.json({ error: "Maximal 5 Endpoints erlaubt" }, { status: 400 });
  }

  const secret = generateWebhookSecret();
  const endpoint = await prisma.webhookEndpoint.create({
    data: { userId, url, secret, events, isActive: true },
  });

  // Return secret only on creation
  return NextResponse.json({ ...endpoint, secret }, { status: 201 });
}
