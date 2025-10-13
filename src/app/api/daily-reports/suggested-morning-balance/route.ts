import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getPreviousBalance(userId: string) {
    // шукаємо останній звіт користувача
    const previousReport = await prisma.dailyCashReport.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });

    // повертаємо актуальний або розрахований вечірній баланс, або 0, якщо звітів немає
    return (
        previousReport?.actualEveningBalance ??
        previousReport?.calculatedEveningBalance ??
        0
    );
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const dateStr = searchParams.get("date");

        if (!userId || !dateStr) {
            return NextResponse.json(
                { error: "Missing userId or date" },
                { status: 400 }
            );
        }

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            return NextResponse.json(
                { error: "Invalid date format" },
                { status: 400 }
            );
        }

        const suggestedMorningBalance = await getPreviousBalance(userId);

        return NextResponse.json({ suggestedMorningBalance });
    } catch (error) {
        console.error(
            "[GET /api/daily-reports/suggested-morning-balance]",
            error
        );
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
