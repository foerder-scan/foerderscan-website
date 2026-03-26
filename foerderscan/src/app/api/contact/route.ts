import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, message, type } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Pflichtfelder fehlen" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Ungültige E-Mail-Adresse" }, { status: 400 });
    }

    await sendContactEmail({ name, email, company, message, type });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Fehler:", err);
    return NextResponse.json({ error: "Interner Fehler" }, { status: 500 });
  }
}
