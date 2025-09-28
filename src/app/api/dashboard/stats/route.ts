import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const from = searchParams.get("from");
        const to = searchParams.get("to");

        if (!from || !to) {
            return NextResponse.json(
                { error: "Потрібні параметри from і to" },
                { status: 400 }
            );
        }

        const fromDate = new Date(from);
        const toDate = new Date(to);

        // Отримуємо звіти за період
        const reports = await prisma.dailyCashReport.findMany({
            where: {
                date: {
                    gte: fromDate,
                    lte: toDate,
                },
            },
            include: {
                breakdown: true,
            },
            orderBy: { date: "asc" },
        });

        // Агрегуємо
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

        const expensesByCategory = reports.reduce(
            (acc, r) => {
                if (r.breakdown) {
                    acc.terminalExpenses += r.breakdown.terminalExpenses;
                    acc.rent += r.breakdown.rent;
                    acc.salaries += r.breakdown.salaries;
                    acc.utilities += r.breakdown.utilities;
                    acc.supplierPayments += r.breakdown.supplierPayments;
                    acc.goodsWriteOff += r.breakdown.goodsWriteOff;
                    acc.ownerWithdrawal += r.breakdown.ownerWithdrawal;
                    acc.piggyBank += r.breakdown.piggyBank;
                    acc.otherExpenses += r.breakdown.otherExpenses;
                }
                return acc;
            },
            {
                terminalExpenses: 0,
                rent: 0,
                salaries: 0,
                utilities: 0,
                supplierPayments: 0,
                goodsWriteOff: 0,
                ownerWithdrawal: 0,
                piggyBank: 0,
                otherExpenses: 0,
            }
        );

        const daily = reports.map((r) => ({
            date: r.date,
            income: r.totalCashRegister,
            expenses: r.totalExpenses,
            expectedBalance: r.calculatedEveningBalance,
            actualBalance: r.actualEveningBalance,
            difference: r.difference,
            confirmed: r.isConfirmed,
        }));

        return NextResponse.json({
            totalIncome,
            totalExpenses,
            totalDifference,
            expensesByCategory,
            daily,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
