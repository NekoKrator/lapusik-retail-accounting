import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function requireAuth(req: NextRequest, roles?: string[]) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        return {
            error: NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            ),
        };
    }

    if (roles && roles.length > 0) {
        const role = token.role as string | undefined;
        if (!role || !roles.includes(role)) {
            return {
                error: NextResponse.json(
                    { error: "Forbidden" },
                    { status: 403 }
                ),
            };
        }
    }

    return { token };
}
