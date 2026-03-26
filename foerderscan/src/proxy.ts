import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const isDashboard = nextUrl.pathname.startsWith("/dashboard");
  const isWartung = nextUrl.pathname === "/wartung";
  const isApi = nextUrl.pathname.startsWith("/api");

  // Wartungsmodus: alle öffentlichen Seiten → /wartung
  const maintenance = process.env.MAINTENANCE_MODE === "true";
  if (maintenance && !isDashboard && !isApi && !isWartung) {
    return NextResponse.redirect(new URL("/wartung", nextUrl.origin));
  }

  if (isDashboard && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
