import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, STRIPE_PRICE_IDS } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const { tier } = await req.json();
  const priceId = STRIPE_PRICE_IDS[tier as string];
  if (!priceId) {
    return NextResponse.json({ error: "Ungültiger Plan" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });
  if (!user) return NextResponse.json({ error: "User nicht gefunden" }, { status: 404 });

  let customerId = user.subscription?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? "https://foerderscan-seven.vercel.app";

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card", "sepa_debit"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${baseUrl}/dashboard/profil?success=1`,
    cancel_url: `${baseUrl}/preise?canceled=1`,
    locale: "de",
    metadata: { userId: user.id },
    subscription_data: {
      metadata: { userId: user.id },
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
