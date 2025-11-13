import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Middleware is disabled for client-side auth with Zustand
// Use client-side route protection instead (see RouteGuard component)
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)",
  ],
};
