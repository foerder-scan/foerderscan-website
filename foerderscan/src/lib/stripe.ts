import Stripe from "stripe";

let _stripe: Stripe | null = null;
export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_placeholder", {
      apiVersion: "2026-02-25.clover",
    });
  }
  return _stripe;
}

// Keep named export for convenience in webhook/checkout routes
export const stripe = {
  get customers() { return getStripe().customers; },
  get checkout() { return getStripe().checkout; },
  get subscriptions() { return getStripe().subscriptions; },
  get billingPortal() { return getStripe().billingPortal; },
  get webhooks() { return getStripe().webhooks; },
} as unknown as Stripe;

export const STRIPE_PRICE_IDS: Record<string, string> = {
  STARTER: process.env.STRIPE_PRICE_STARTER ?? "",
  PROFESSIONAL: process.env.STRIPE_PRICE_PROFESSIONAL ?? "",
};

export function getTierFromPrice(priceId: string): string {
  const map: Record<string, string> = {
    [process.env.STRIPE_PRICE_STARTER ?? ""]: "STARTER",
    [process.env.STRIPE_PRICE_PROFESSIONAL ?? ""]: "PROFESSIONAL",
  };
  return map[priceId] ?? "STARTER";
}

// Keep for backwards compat in webhook
export const TIER_FROM_PRICE: Record<string, string> = new Proxy({}, {
  get(_, priceId: string) {
    return getTierFromPrice(priceId);
  },
});
