import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/login?error=invalid-token", req.url));
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record || record.expires < new Date()) {
    return NextResponse.redirect(new URL("/login?error=expired-token", req.url));
  }

  await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({ where: { token } });

  const user = await prisma.user.findUnique({ where: { email: record.identifier } });
  if (user) {
    await sendWelcomeEmail(user.email, user.name ?? undefined).catch(() => {});
  }

  return NextResponse.redirect(new URL("/dashboard?welcome=1", req.url));
}
