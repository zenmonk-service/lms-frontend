import { NextRequest, NextResponse } from "next/server";
import { auth } from "./app/auth/auth";


export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const logedInUser = await auth();
console.log('✌️logedInUser --->', logedInUser);
  if (!logedInUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return response;
}

export const config = {
  matcher: [],
};
