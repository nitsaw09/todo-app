import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCookie } from "./lib/utils/cookie";

export async function middleware(req: NextRequest) {
  const authToken = await getCookie('authToken');
 
  const isAuthPage = req.nextUrl.pathname === "/auth/login" || req.nextUrl.pathname === "/auth/signup";
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/tasks") || req.nextUrl.pathname === "/";

  // If no token is present and trying to access a protected route, redirect to login
  if (!authToken && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // If a user is already authenticated and trying to access login or signup, redirect them to the home page
  if (authToken && isAuthPage) {
    return NextResponse.redirect(new URL("/tasks", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/tasks/:path*", 
    "/auth/:path*", 
    "/"
  ],
};
