import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { TOTP, generateSecret } from "otplib";
import QRCode from "qrcode";

const totp = new TOTP();

// GET /api/auth/2fa — generate TOTP secret + QR code (setup step 1)
export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, twoFactorEnabled: true } });
  if (!user) return NextResponse.json({ error: "Nutzer nicht gefunden" }, { status: 404 });
  if (user.twoFactorEnabled) return NextResponse.json({ error: "2FA bereits aktiviert" }, { status: 400 });

  const secret = generateSecret();
  const otpauth = totp.toURI({ secret, label: user.email ?? userId, issuer: "FörderScan" });
  const qrCodeDataUrl = await QRCode.toDataURL(otpauth);

  await prisma.user.update({ where: { id: userId }, data: { twoFactorSecret: secret } });

  return NextResponse.json({ secret, qrCode: qrCodeDataUrl });
}

// POST /api/auth/2fa — verify TOTP token and enable 2FA
export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: "TOTP-Code fehlt" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorSecret: true, twoFactorEnabled: true },
  });

  if (!user?.twoFactorSecret) {
    return NextResponse.json({ error: "Kein 2FA-Setup. Bitte zuerst GET /api/auth/2fa aufrufen." }, { status: 400 });
  }
  if (user.twoFactorEnabled) {
    return NextResponse.json({ error: "2FA bereits aktiviert" }, { status: 400 });
  }

  const isValid = await totp.verify(token, { secret: user.twoFactorSecret });
  if (!isValid) {
    return NextResponse.json({ error: "Ungültiger Code. Bitte erneut versuchen." }, { status: 400 });
  }

  await prisma.user.update({ where: { id: userId }, data: { twoFactorEnabled: true } });
  return NextResponse.json({ ok: true });
}

// DELETE /api/auth/2fa — disable 2FA
export async function DELETE(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: "TOTP-Code zur Bestätigung erforderlich" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { twoFactorSecret: true, twoFactorEnabled: true },
  });

  if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
    return NextResponse.json({ error: "2FA ist nicht aktiviert" }, { status: 400 });
  }

  const isValid = await totp.verify(token, { secret: user.twoFactorSecret });
  if (!isValid) {
    return NextResponse.json({ error: "Ungültiger Code" }, { status: 400 });
  }

  await prisma.user.update({ where: { id: userId }, data: { twoFactorEnabled: false, twoFactorSecret: null } });
  return NextResponse.json({ ok: true });
}
