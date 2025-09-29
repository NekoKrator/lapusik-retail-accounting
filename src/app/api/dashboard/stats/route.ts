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

        const totalIncome = reports.reduce(
            (acc, r) => acc + r.totalCashRegister,
            0
        );
        const totalExpenses = reports.reduce(
            (acc, r) => acc + (r.totalExpenses ?? 0),
            0
        );
        const totalDifference = reports.reduce(
            (acc, r) => acc + (r.difference ?? 0),
            0
        );

        const daily = reports.map((r) => ({
            date: r.date,
            income: r.totalCashRegister,
            expenses: r.totalExpenses,
            expectedBalance: r.calculatedEveningBalance,
            actualBalance: r.actualEveningBalance,
            difference: r.difference,
            confirmed: r.isConfirmed,
            expensesByCategory: r.breakdown || {},
        }));

        return NextResponse.json({
            totalIncome,
            totalExpenses,
            totalDifference,
            daily,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
