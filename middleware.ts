import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default withAuth(
  function middleware(req: NextRequest) {
    // Allow access for authenticated users
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Only allow if user is logged in
    },
    pages: {
      signIn: "/login",  
    },
  }
)

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
}
