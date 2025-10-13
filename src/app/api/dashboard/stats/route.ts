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
        const reports = await prisma.dailyCashReport.findMany({
            include: {
                breakdown: true,
            },
            orderBy: { date: "asc" },
        });

        const daily = reports.map((r) => ({
            date: r.date,
            morningBalance: r.morningBalance,
            additionalBalance: r.additionalBalance,
            cashRegister: r.totalCashRegister,
            expenses: r.totalExpenses,
            expectedBalance: r.calculatedEveningBalance,
            actualBalance: r.actualEveningBalance,
            difference: -r.difference, // зміна знаку різниці (у бд додатна різниця відповідає недостачі)
            confirmed: r.isConfirmed,
            expensesByCategory: r.breakdown || {},
            userId: r.userId,
            createdAt: r.createdAt,
        }));

        return NextResponse.json({ daily });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
