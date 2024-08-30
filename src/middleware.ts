import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const adminRoutes = ["/pending-requests", "/pending-requests/[id]"];
const teamMemberRoutes = ["/profile/my-submissions"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY!);

  const verifyToken = async (token: string) => {
    try {
      const { payload } = await jwtVerify(token, secretKey);
      return payload as { role: string };
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const user: any = token ? await verifyToken(token) : null;

  const path = request.nextUrl.pathname;

  if (!token) {
    if (path !== "/login" && path !== "/signup") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (path === "/login" || path === "/signup") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (
    user.role !== "admin" &&
    adminRoutes.some((route) => path.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/access-denied", request.url));
  }

  if (
    user.role !== "team-member" &&
    teamMemberRoutes.some((route) => path.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/access-denied", request.url));
  }
}
export const config = {
  matcher: [
    "/dashboard",
    "/login",
    "/signup",
    "/pending-requests",
    "/pending-requests/[id]",
    "/add-product",
    "/product",
    "/product/[id]",
    "/profile",
    "/profile/my-submissions",
  ],
};
