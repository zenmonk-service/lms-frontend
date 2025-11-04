// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./app/auth/auth";

const PUBLIC_PATHS = [
  "/", 
  "/login", 
  "/favicon.ico",
  "/health",
  "/api/public" // add any public API endpoints here
];

function isPublicPath(pathname: string) {
  // allow exact public paths or anything under them (e.g. /login/... )
  return PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // allow Next.js internals and public files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_static") ||
    pathname.startsWith("/_vercel") || // harmless
    pathname.startsWith("/static") ||
    isPublicPath(pathname)
  ) {
    return NextResponse.next();
  }

  // Try to get logged-in user.
  // Some auth implementations expect the request; some don't.
  // We'll try both, but never throw — fallback to unauthenticated.
  let loggedInUser = null;
  try {
    // attempt to call auth with request first (most flexible)
    // if your auth() doesn't accept a param, this will throw and we'll fallback.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    loggedInUser = await auth(request);
  } catch (err) {
    try {
      loggedInUser = await auth();
    } catch (err2) {
      loggedInUser = null;
    }
  }

  if (!loggedInUser) {
    // Redirect to /login (server-side). This prevents returning raw JSON.
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    // optionally attach original path so you can redirect back after login:
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Only run middleware for application routes (not static/_next files)
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt).*)"],
};
