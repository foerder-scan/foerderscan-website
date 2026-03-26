import { prisma } from "@/lib/prisma";
import { stripe, TIER_FROM_PRICE } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook-Konfiguration fehlt" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Ungültige Signatur" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (!userId || !session.customer || !session.subscription) break;

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as unknown as Stripe.Subscription & { current_period_start?: number; current_period_end?: number };
      // Propagate userId to subscription metadata for future webhook events
      if (!subscription.metadata?.userId) {
        await stripe.subscriptions.update(subscription.id, {
          metadata: { userId },
        });
      }
      const priceId = subscription.items.data[0]?.price.id ?? "";
      const tier = TIER_FROM_PRICE[priceId] ?? "STARTER";

      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          tier: tier as "STARTER" | "PROFESSIONAL",
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId,
          status: subscription.status,
          currentPeriodStart: subscription.current_period_start ? new Date(subscription.current_period_start * 1000) : null,
          currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null,
        },
        update: {
          tier: tier as "STARTER" | "PROFESSIONAL",
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId,
          status: subscription.status,
          currentPeriodStart: subscription.current_period_start ? new Date(subscription.current_period_start * 1000) : null,
          currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null,
        },
      });
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription & { current_period_start?: number; current_period_end?: number };
      const userId = subscription.metadata?.userId;
      if (!userId) break;

      const priceId = subscription.items.data[0]?.price.id ?? "";
      const tier = TIER_FROM_PRICE[priceId] ?? "STARTER";

      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          tier: tier as "STARTER" | "PROFESSIONAL",
          stripePriceId: priceId,
          status: subscription.status,
          currentPeriodStart: subscription.current_period_start ? new Date(subscription.current_period_start * 1000) : null,
          currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          tier: "FREE",
          status: "canceled",
          stripeSubscriptionId: null,
          stripePriceId: null,
          cancelAtPeriodEnd: false,
        },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
