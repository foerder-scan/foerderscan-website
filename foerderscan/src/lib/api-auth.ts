import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export interface ApiAuthResult {
  userId: string;
  keyId: string;
}

/**
 * Validates X-API-Key header for public API v1 endpoints.
 * Returns userId + keyId on success, null on failure.
 */
export async function validateApiKey(req: NextRequest): Promise<ApiAuthResult | null> {
  const rawKey = req.headers.get("X-API-Key") ?? req.headers.get("x-api-key");
  if (!rawKey || !rawKey.startsWith("fs_live_")) return null;

  const keyHash = createHash("sha256").update(rawKey).digest("hex");

  const apiKey = await prisma.apiKey.findFirst({
    where: { keyHash, isActive: true },
    select: { id: true, userId: true, expiresAt: true },
  });

  if (!apiKey) return null;
  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) return null;

  // Update lastUsedAt without awaiting to avoid latency
  void prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  });

  return { userId: apiKey.userId, keyId: apiKey.id };
}
