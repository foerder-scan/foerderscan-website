import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const sub = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!sub?.stripeCustomerId) {
    return NextResponse.json({ error: "Kein Stripe-Konto gefunden" }, { status: 404 });
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? "https://foerderscan-seven.vercel.app";

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${baseUrl}/dashboard/profil`,
  });

  return NextResponse.json({ url: portalSession.url });
}
