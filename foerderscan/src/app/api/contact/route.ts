import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import { rateLimit, getIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // Rate Limit: max 5 Nachrichten pro IP pro Stunde
  const rl = rateLimit(`contact:${getIp(req)}`, { limit: 5, windowSec: 3600 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Zu viele Nachrichten. Bitte versuchen Sie es später erneut." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { name, email, company, message, type } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Pflichtfelder fehlen" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Ungültige E-Mail-Adresse" }, { status: 400 });
    }

    if (message.length > 2000) {
      return NextResponse.json({ error: "Nachricht zu lang (max. 2000 Zeichen)" }, { status: 400 });
    }

    await sendContactEmail({ name, email, company, message, type });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Fehler:", err);
    return NextResponse.json({ error: "Interner Fehler" }, { status: 500 });
  }
}
