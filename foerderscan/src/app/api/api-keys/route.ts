import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { getIp } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// GET /api/api-keys — list user's keys (prefix + meta, never full key)
export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const keys = await prisma.apiKey.findMany({
    where: { userId, isActive: true },
    select: { id: true, name: true, keyPrefix: true, lastUsedAt: true, expiresAt: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(keys);
}

// POST /api/api-keys — generate new key
export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  // Only Professional/Enterprise can create API keys
  const sub = await prisma.subscription.findUnique({ where: { userId } });
  if (!sub || !["PROFESSIONAL", "ENTERPRISE"].includes(sub.tier)) {
    return NextResponse.json({ error: "API-Zugang nur für Professional & Enterprise verfügbar" }, { status: 403 });
  }

  // Max 10 keys
  const count = await prisma.apiKey.count({ where: { userId, isActive: true } });
  if (count >= 10) {
    return NextResponse.json({ error: "Maximum 10 aktive API-Keys erlaubt" }, { status: 400 });
  }

  const body = await req.json();
  const name = (body.name as string)?.trim() || "API Key";

  // Generate key: fs_live_<32 random bytes>
  const rawKey = `fs_live_${crypto.randomBytes(32).toString("hex")}`;
  const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");
  const keyPrefix = rawKey.slice(0, 14); // "fs_live_" + 6 chars

  const apiKey = await prisma.apiKey.create({
    data: {
      userId,
      name,
      keyHash,
      keyPrefix,
      isActive: true,
    },
  });

  await logAudit({ userId, aktion: "API_KEY_ERSTELLT", ressource: apiKey.id, ipAdresse: getIp(req) });

  // Return full key ONCE — never stored in plain text again
  return NextResponse.json({
    id: apiKey.id,
    name: apiKey.name,
    keyPrefix,
    fullKey: rawKey,
    createdAt: apiKey.createdAt,
  }, { status: 201 });
}
