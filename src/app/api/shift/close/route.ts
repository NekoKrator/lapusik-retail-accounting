import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/auth-utils";
import z from "zod";

const prisma = new PrismaClient();

const closeShiftSchema = z.object({
    additionalBalance: z.number().min(0),
    totalCashRegister: z.number().min(0),
    actualClosingBalance: z.number().min(0),
    breakdown: z.object({
        terminalExpenses: z.number().min(0).default(0),
        ownerWithdrawal: z.number().min(0).default(0),
        rent: z.number().min(0).default(0),
        utilities: z.number().min(0).default(0),
        goodsWriteOff: z.number().min(0).default(0),
        supplierPayments: z.number().min(0).default(0),
        salaries: z.number().min(0).default(0),
        piggyBank: z.number().min(0).default(0),
        otherExpenses: z.number().min(0).default(0),
    }),
});

export async function POST(req: NextRequest) {
    const { token, error } = await requireAuth(req);
    if (error) return error;

    try {
        const body = await req.json();
        const parsed = closeShiftSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: z.flattenError(parsed.error) },
                { status: 400 }
            );
        }

        const {
            additionalBalance,
            totalCashRegister,
            actualClosingBalance,
            breakdown,
        } = parsed.data;

        const shift = await prisma.shift.findFirst({
            where: { userId: token.id as string, isClosed: false },
        });

        if (!shift) {
            return NextResponse.json(
                { error: "Open shift not found" },
                { status: 400 }
            );
        }

        const totalExpenses = Object.values(breakdown).reduce(
            (sum, expense) => sum + expense,
            0
        );

        const calculatedClosingBalance =
            shift.openingBalance +
            totalCashRegister +
            additionalBalance -
            totalExpenses;

        const updatedShift = await prisma.shift.update({
            where: { id: shift.id },
            data: {
                closedAt: new Date(),
                isClosed: true,

                additionalBalance,
                totalCashRegister,
                expensesBalance: totalExpenses,
                calculatedClosingBalance,
                actualClosingBalance,

                breakdown: {
                    create: breakdown,
                },
            },
            include: { breakdown: true },
        });

        return NextResponse.json(updatedShift);
    } catch (err) {
        console.error("Close shift error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
