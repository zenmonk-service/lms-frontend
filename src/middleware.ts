import { NextRequest, NextResponse } from "next/server";
import { auth } from "./app/auth/auth";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const loggedInUser = await auth();
  if (!loggedInUser) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return response;
}

export const config = {
  matcher: [
    "/users/:path*",
    "/organizations/:path*",
    "/select-organization",
  ],
};
