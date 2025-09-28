import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { UserRole } from "./types/types";

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        const token = req.nextauth.token;
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        const role = (req.nextauth.token as { role: UserRole }).role;

        if (pathname.startsWith("/admin") && role !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        if (
            pathname.startsWith("/sales") &&
            !["user", "admin"].includes(role)
        ) {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                return !!token;
            },
        },
    }
);

export const config = {
    matcher: ["/admin/:path*", "/sales/:path*", "/dashboard/:path*"],
};
