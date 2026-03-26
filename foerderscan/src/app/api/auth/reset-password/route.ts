import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const rl = rateLimit(`reset:${getIp(req)}`, { limit: 5, windowSec: 900 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Zu viele Versuche." }, { status: 429 });
  }

  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json({ error: "Token und Passwort sind Pflichtfelder" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Passwort muss mindestens 8 Zeichen haben" }, { status: 400 });
  }

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!resetToken || resetToken.expires < new Date()) {
    return NextResponse.json({ error: "Link ungültig oder abgelaufen" }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { email: resetToken.identifier },
    data: { passwordHash: hash },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  return NextResponse.json({ ok: true });
}
