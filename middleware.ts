import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const isAdmin = role === "ADMIN";

  // Old admin login URL → shared sign-in
  if (pathname === "/admin/login") {
    const url = new URL("/sign-in", req.nextUrl.origin);
    const callback = req.nextUrl.searchParams.get("callbackUrl");
    if (callback) url.searchParams.set("callbackUrl", callback);
    return NextResponse.redirect(url);
  }

  if (!isLoggedIn) {
    const loginUrl = new URL("/sign-in", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
