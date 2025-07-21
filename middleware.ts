import { clerkMiddleware, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define allowed admin email(s)
const ADMIN_EMAILS = ["development.masood@gmail.com"];

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const { pathname } = req.nextUrl;

  // Redirect unauthenticated users from protected routes
  const protectedRoutes = ["/admin", "/order"];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!userId && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Admin-only restriction for /admin
  const email = sessionClaims?.email as string;
  if (pathname.startsWith("/admin")) {
    if (!email || !ADMIN_EMAILS.includes(email)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/order",
    "/track",
    "/track/:path*",
    "/order/:path*",
  ],
};
