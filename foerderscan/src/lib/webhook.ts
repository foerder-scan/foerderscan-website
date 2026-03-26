import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export type WebhookEvent =
  | "projekt.created"
  | "projekt.updated"
  | "projekt.deleted"
  | "foerderung.created"
  | "foerderung.updated"
  | "subscription.changed";

export async function deliverWebhook(
  userId: string,
  event: WebhookEvent,
  payload: object
): Promise<void> {
  const endpoints = await prisma.webhookEndpoint.findMany({
    where: { userId, isActive: true, events: { has: event } },
  });

  if (endpoints.length === 0) return;

  const body = JSON.stringify({ event, data: payload, timestamp: new Date().toISOString() });

  await Promise.allSettled(
    endpoints.map(async (ep) => {
      const sig = crypto
        .createHmac("sha256", ep.secret)
        .update(body)
        .digest("hex");

      let statusCode: number | null = null;
      let success = false;

      try {
        const res = await fetch(ep.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-FoerderScan-Signature": `sha256=${sig}`,
            "X-FoerderScan-Event": event,
          },
          body,
          signal: AbortSignal.timeout(10_000),
        });
        statusCode = res.status;
        success = res.ok;
      } catch {
        statusCode = null;
        success = false;
      }

      await prisma.webhookDelivery.create({
        data: { endpointId: ep.id, event, payload: { event, data: payload }, statusCode, success },
      });
    })
  );
}

export function generateWebhookSecret(): string {
  return `whsec_${crypto.randomBytes(32).toString("hex")}`;
}
