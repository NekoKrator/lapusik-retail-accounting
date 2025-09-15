import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getPreviousDayBalance(userId: string, date: Date) {
    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);

    const previousReport = await prisma.dailyCashReport.findFirst({
        where: {
            userId: userId,
            date: {
                gte: new Date(previousDay.setHours(0, 0, 0, 0)),
                lte: new Date(previousDay.setHours(23, 59, 59, 999)),
            },
        },
        orderBy: { date: "desc" },
    });

    return (
        previousReport?.actualEveningBalance ||
        previousReport?.calculatedEveningBalance ||
        0
    );
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        if (
            data.morningBalance == null ||
            data.totalCashRegister == null ||
            isNaN(data.morningBalance) ||
            isNaN(data.totalCashRegister)
        ) {
            return NextResponse.json(
                { error: "Missing or invalid balances" },
                { status: 400 }
            );
        }

        if (!data.breakdown) {
            return NextResponse.json(
                { error: "Breakdown is required" },
                { status: 400 }
            );
        }

        const userExists = await prisma.user.findUnique({
            where: { id: data.userId },
        });

        if (!userExists) {
            return NextResponse.json(
                { error: "Invalid userId — user does not exist" },
                { status: 400 }
            );
        }

        // get the remainder of the previous day
        const suggestedMorningBalance = await getPreviousDayBalance(
            data.userId,
            new Date(data.date)
        );

        // calculate the total amount of expenses
        const b = data.breakdown;
        const totalExpenses =
            (b.terminalExpenses || 0) +
            (b.ownerWithdrawal || 0) +
            (b.rent || 0) +
            (b.utilities || 0) +
            (b.goodsWriteOff || 0) +
            (b.supplierPayments || 0) +
            (b.salaries || 0) +
            (b.piggyBank || 0) +
            (b.otherExpenses || 0);

        // calculate total available amount (morning balance + cash)
        const totalAvailable = data.morningBalance + data.totalCashRegister;

        // calculate the expected balance for the evening
        const calculatedEveningBalance = totalAvailable - totalExpenses;

        // calculate the difference (if there is an actual balance)
        const difference = data.actualEveningBalance
            ? calculatedEveningBalance - data.actualEveningBalance
            : 0;

        const newReport = await prisma.dailyCashReport.create({
            data: {
                userId: data.userId,
                date: new Date(data.date),
                morningBalance: data.morningBalance,
                totalCashRegister: data.totalCashRegister,
                totalAvailable: totalAvailable,
                totalExpenses: totalExpenses,
                calculatedEveningBalance: calculatedEveningBalance,
                actualEveningBalance: data.actualEveningBalance || null,
                difference: difference,
                isConfirmed: data.actualEveningBalance ? true : false,
                breakdown: {
                    create: {
                        terminalExpenses: data.breakdown.terminalExpenses || 0,
                        ownerWithdrawal: data.breakdown.ownerWithdrawal || 0,
                        rent: data.breakdown.rent || 0,
                        utilities: data.breakdown.utilities || 0,
                        goodsWriteOff: data.breakdown.goodsWriteOff || 0,
                        supplierPayments: data.breakdown.supplierPayments || 0,
                        salaries: data.breakdown.salaries || 0,
                        piggyBank: data.breakdown.piggyBank || 0,
                        otherExpenses: data.breakdown.otherExpenses || 0,
                    },
                },
            },
            include: { breakdown: true },
        });

        return NextResponse.json(
            { newReport, suggestedMorningBalance, totalAvailable },
            { status: 201 }
        );
    } catch (error) {
        console.error("[POST /api/daily-reports] Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// endpoint for confirmation of actual balance
export async function PATCH(request: NextRequest) {
    try {
        const data = await request.json();
        const { reportId, actualEveningBalance } = data;

        if (!reportId || actualEveningBalance === undefined) {
            return NextResponse.json(
                { error: "reportId and actualEveningBalance are required" },
                { status: 400 }
            );
        }

        const report = await prisma.dailyCashReport.findUnique({
            where: { id: reportId },
        });

        if (!report) {
            return NextResponse.json(
                { error: "Report not found" },
                { status: 404 }
            );
        }

        const difference =
            report.calculatedEveningBalance - actualEveningBalance;

        const updateReport = await prisma.dailyCashReport.update({
            where: { id: reportId },
            data: {
                actualEveningBalance: actualEveningBalance,
                difference: difference,
                isConfirmed: true,
            },
            include: { breakdown: true },
        });

        return NextResponse.json(updateReport);
    } catch (error) {
        console.error("[PATCH /api/daily-reports] Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
