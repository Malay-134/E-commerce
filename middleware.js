import { NextResponse } from "next/server";

const protectedRoutes = ["/profile", "/cart"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  console.log("Middleware running for:", pathname);
  console.log("Token exists:", token);
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      console.log("No token, redirecting to /login");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname === "/login" && token) {
    console.log("Already logged in, redirecting to /dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
