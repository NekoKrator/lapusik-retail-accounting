import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/auth-utils";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { error } = await requireAuth(req, ["admin"]);
    if (error) return error;

    try {
        const { searchParams } = new URL(req.url);
        const role = searchParams.get("role");

        const where = role ? { role } : {};

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                username: true,
                role: true,
            },
            orderBy: { username: "asc" },
        });

        return NextResponse.json(users);
    } catch (err) {
        console.error("Failed to fetch users:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
