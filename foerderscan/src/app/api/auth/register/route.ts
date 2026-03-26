import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { sendVerificationEmail } from "@/lib/email";
import { rateLimit, getIp } from "@/lib/rate-limit";
import { registerSchema } from "@/lib/validation";
import { logAudit } from "@/lib/audit";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  // Rate Limit: max 5 Registrierungen pro IP pro Stunde
  const rl = rateLimit(`register:${getIp(req)}`, { limit: 5, windowSec: 3600 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Zu viele Versuche. Bitte versuchen Sie es später erneut." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Ungültige Eingabe";
    return NextResponse.json({ error: message }, { status: 400 });
  }
  const { name, email, password, company, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing)
    return NextResponse.json({ error: "E-Mail wird bereits verwendet." }, { status: 409 });

  const userRole: UserRole = role === "ENDKUNDE" ? "ENDKUNDE" : "BERATER_FREE";

  const hash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hash,
      role: userRole,
      company: company || null,
      subscription: { create: { tier: "FREE", status: "active" } },
    },
  });

  // E-Mail-Verifikation
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
  await prisma.verificationToken.create({
    data: { identifier: email, token, expires },
  });
  await sendVerificationEmail(email, token, name).catch(() => {});

  await logAudit({
    aktion: "USER_REGISTRIERT",
    details: { email, role: userRole },
    ipAdresse: getIp(req),
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
