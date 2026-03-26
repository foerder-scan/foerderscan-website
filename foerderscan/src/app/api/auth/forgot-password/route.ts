import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { Resend } from "resend";
import crypto from "crypto";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "placeholder");
}

export async function POST(req: NextRequest) {
  // Rate Limit: max 3 Anfragen pro IP pro 15 Minuten
  const rl = rateLimit(`forgot:${getIp(req)}`, { limit: 3, windowSec: 900 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Zu viele Versuche. Bitte warten Sie 15 Minuten." },
      { status: 429 }
    );
  }

  const { email } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Ungültige E-Mail-Adresse" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Immer 200 zurückgeben — kein User-Enumeration möglich
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  // Alten Token löschen
  await prisma.passwordResetToken.deleteMany({ where: { identifier: email } });

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 Stunde

  await prisma.passwordResetToken.create({
    data: { identifier: email, token, expires },
  });

  const baseUrl = process.env.NEXTAUTH_URL ?? "https://foerderscan.de";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  await getResend().emails.send({
    from: "FörderScan <noreply@foerderscan.de>",
    to: email,
    subject: "Passwort zurücksetzen – FörderScan",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #fff;">
        <div style="margin-bottom: 24px;">
          <span style="background: #2E86C1; color: white; font-weight: 700; font-size: 18px; padding: 6px 12px; border-radius: 8px;">FörderScan</span>
        </div>
        <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 8px;">Passwort zurücksetzen</h1>
        <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
          Sie haben eine Passwort-Zurücksetzung angefordert. Klicken Sie auf den Button, um ein neues Passwort zu vergeben.
        </p>
        <a href="${resetUrl}" style="display: inline-block; background: #1B4F72; color: white; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 10px; text-decoration: none;">
          Passwort zurücksetzen
        </a>
        <p style="color: #94a3b8; font-size: 12px; margin: 24px 0 0; line-height: 1.5;">
          Dieser Link ist 1 Stunde gültig. Falls Sie keine Zurücksetzung angefordert haben, können Sie diese E-Mail ignorieren.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #cbd5e1; font-size: 11px; margin: 0;">FörderScan · <a href="https://foerderscan.de/impressum" style="color: #94a3b8;">Impressum</a> · <a href="https://foerderscan.de/datenschutz" style="color: #94a3b8;">Datenschutz</a></p>
      </div>
    `,
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
