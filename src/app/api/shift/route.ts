import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/auth-utils";

const prisma = new PrismaClient();

interface ShiftFilters {
    userId?: string;
    isClosed?: boolean;
}

export async function GET(req: NextRequest) {
    const { token, error } = await requireAuth(req);
    if (error) return error;

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const isClosed = searchParams.get("isClosed");

        const filters: ShiftFilters = {};

        if (token.role === "admin") {
            if (userId) filters.userId = userId;
        } else {
            filters.userId = token.id as string;
        }

        if (isClosed !== null) filters.isClosed = isClosed === "true";

        const shifts = await prisma.shift.findMany({
            where: filters,
            orderBy: { openedAt: "desc" },
        });

        return NextResponse.json(shifts);
    } catch (err) {
        console.error("Failed to fetch shift:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
