import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./app/auth/get-auth.action";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const  loggedInUser = await getSession();


  if (!loggedInUser) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  function hasPagePermission(tag: string) {
    return loggedInUser?.user?.permissions?.some((perm) => perm.tag === tag);
  }

  function isApprovalPageAccessible() {
    return (
      hasPagePermission("leave_request_management") &&
      loggedInUser?.user?.permissions?.some(
        (perm) =>
          perm.tag === "leave_request_management" && perm.action === "approval"
      )
    );
  }

  function isMyLeavePageAccessible() {
    return (
      hasPagePermission("leave_request_management") &&
      loggedInUser?.user?.permissions?.some(
        (perm) =>
          (perm.tag === "leave_request_management" &&
            perm.action === "create") ||
          perm.action === "read" ||
          perm.action === "update" ||
          perm.action === "delete"
      )
    );
  }

  if (
    !hasPagePermission("user_management") &&
    request.nextUrl.pathname.endsWith("/user-management")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (
    !hasPagePermission("role_management") &&
    request.nextUrl.pathname.endsWith("/role-management")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (
    !isApprovalPageAccessible() &&
    request.nextUrl.pathname.endsWith("/approvals")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    !isMyLeavePageAccessible() &&
    request.nextUrl.pathname.endsWith("/my-leaves")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/users/:path*",
    "/organizations/:path*",
    "/select-organization",
    "/:org/user-management",
    "/:org/role-management",
    "/:org/my-leaves",
    "/:org/leave-types",
     "/:org/dashboard",
  ],
};
