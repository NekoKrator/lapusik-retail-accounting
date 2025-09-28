import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getUTCStartOfDay(date: Date) {
    return new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    );
}

function getUTCEndOfDay(date: Date) {
    return new Date(
        Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            23,
            59,
            59,
            999
        )
    );
}

async function getPreviousDayBalance(userId: string, currentDate: Date) {
    const previousDay = new Date(currentDate);
    previousDay.setUTCDate(currentDate.getUTCDate() - 1);

    const startOfPreviousDay = getUTCStartOfDay(previousDay);
    const endOfPreviousDay = getUTCEndOfDay(previousDay);

    console.log("searching for report:", {
        userId,
        startOfPreviousDay,
        endOfPreviousDay,
    });

    const previousReport = await prisma.dailyCashReport.findFirst({
        where: {
            userId,
            date: {
                gte: startOfPreviousDay,
                lte: endOfPreviousDay,
            },
        },
        orderBy: {
            date: "desc",
        },
    });

    console.log("found report:", previousReport);

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

        const suggestedMorningBalance = await getPreviousDayBalance(
            userId,
            date
        );

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
