import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
    function middleware(req: NextRequest) {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                return !!token;
            },
        },
        pages: {
            signIn: "/login",
        },
    }
);

// Configure paths to protect
export const config = {
    matcher: [
        "/(user)/:path*",  
        "/bank",     
        "/calender/:path*",     
        "/create/:path*",     
        "/edit/:path*",     
        "/mail/:path*",     
        "/profile/:path*",     
        "/syncmail/:path*",     
        "/track/:path*",     
        "/transaction/:path*",     
    ],
};
