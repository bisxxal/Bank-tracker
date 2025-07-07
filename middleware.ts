import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default withAuth(
  function middleware(req: NextRequest) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token?.accessToken && Date?.now() < (token.accessTokenExpires ?? 0);
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/bank/:path*",
    "/calendar/:path*", 
    "/category/:path*", 
    "/create/:path*",
    "/edit/:path*",
    "/mail/:path*",
    "/profile/:path*",
    "/track/:path*", 
    "/transaction/:path*", 
  ],
};
