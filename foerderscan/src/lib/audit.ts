import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function logAudit({
  userId,
  aktion,
  ressource,
  details,
  ipAdresse,
}: {
  userId?: string;
  aktion: string;
  ressource?: string;
  details?: Record<string, unknown>;
  ipAdresse?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: { userId, aktion, ressource, details: details as Prisma.InputJsonValue, ipAdresse },
    });
  } catch {
    // Audit logging must never break the main operation
  }
}
