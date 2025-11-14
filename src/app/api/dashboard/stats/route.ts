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
        const reports = await prisma.shift.findMany({
            include: {
                breakdown: true,
            },
            orderBy: { openedAt: "asc" },
        });

        const daily = reports.map((r) => ({
            date: r.openedAt,
            morningBalance: r.openingBalance,
            additionalBalance: r.additionalBalance,
            cashRegister: r.totalCashRegister,
            expenses: r.expensesBalance,
            expectedBalance: r.calculatedClosingBalance,
            actualBalance: r.actualClosingBalance,
            difference: -(
                Number(r.calculatedClosingBalance) -
                Number(r.actualClosingBalance)
            ), // зміна знаку різниці (у бд додатна різниця відповідає недостачі)
            confirmed: r.isClosed, // видалити потім
            expensesByCategory: r.breakdown || {},
            userId: r.userId,
            createdAt: r.openedAt,
        }));

        return NextResponse.json({ daily });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
