import { clerkMiddleware, currentUser, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define allowed admin email(s)
const ADMIN_EMAILS = ["development.masood@gmail.com"];

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  const { pathname } = req.nextUrl;

  // Redirect unauthenticated users from protected routes
  const protectedRoutes = ["/admin", "/order"];
  const isAdminRoute = pathname.startsWith("/admin");
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!userId && isProtected) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Admin-only restriction for /admin
  // const _user = await currentUser();
  // // const email = sessionClaims?.email as string;
  // // console.log("Email: ", email, sessionClaims);
  // const userEmailExist = _user?.emailAddresses?.some((email) =>
  //   ADMIN_EMAILS.includes(email.emailAddress)
  // );
  // if (pathname.startsWith("/admin")) {
  //   // if (!_user?.emailAddresses || !ADMIN_EMAILS.includes(_user.emailAddresses[0].emailAddress)) {
  //   if (!_user?.emailAddresses || !userEmailExist) {
  //     return NextResponse.redirect(new URL("/", req.url));
  //   }
  // }

  // console.log(userId, isAdminRoute);
  // if (userId && isAdminRoute) {
  //   const user = await currentUser();
  //   console.log("user:", user);
  //   const isAdmin = user?.emailAddresses?.some((email) =>
  //     ADMIN_EMAILS.includes(email.emailAddress)
  //   );

  //   if (!isAdmin) {
  //     return NextResponse.redirect(new URL("/", req.url));
  //   }
  // }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/order",
    "/track",
    "/track/:path*",
    "/order/:path*",
  ],
};
