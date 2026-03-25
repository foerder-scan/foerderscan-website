import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

export async function POST(req: NextRequest) {
  const { name, email, password, company, role } = await req.json();

  if (!email || !password || !name)
    return NextResponse.json({ error: "Pflichtfelder fehlen." }, { status: 400 });

  if (password.length < 8)
    return NextResponse.json({ error: "Passwort muss mindestens 8 Zeichen haben." }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing)
    return NextResponse.json({ error: "E-Mail wird bereits verwendet." }, { status: 409 });

  const validRoles: UserRole[] = ["BERATER_FREE", "ENDKUNDE"];
  const userRole = validRoles.includes(role) ? (role as UserRole) : "BERATER_FREE";

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

  return NextResponse.json({ ok: true }, { status: 201 });
}
