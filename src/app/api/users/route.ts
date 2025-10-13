import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.role !== "admin") {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const role = searchParams.get("role");

        const where = role ? { role } : {}; // якщо не передано роль — повертаємо всіх

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
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Не вдалося отримати користувачів" },
            { status: 500 }
        );
    }
}
