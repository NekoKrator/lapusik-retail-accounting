import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/auth-utils";
import z from "zod";

const prisma = new PrismaClient();

const idSchema = z.object({
    id: z.uuid(),
});

const updateDebtorSchema = z.object({
    currentDebt: z.number().nonnegative().optional(),
    totalDebt: z.number().nonnegative().optional(),
});

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { token, error } = await requireAuth(req);
    if (error) return error;

    const { id } = await context.params;
    const idCheck = idSchema.safeParse({ id });

    if (!idCheck.success) {
        return NextResponse.json(
            { error: z.flattenError(idCheck.error) },
            { status: 400 }
        );
    }

    try {
        const body = await req.json();
        const parsed = updateDebtorSchema.safeParse(body);

        if (!parsed.success) {
            console.log(z.flattenError(parsed.error));
            return NextResponse.json(
                { error: z.flattenError(parsed.error) },
                { status: 400 }
            );
        }

        const { currentDebt, totalDebt } = parsed.data;

        const debtor = await prisma.debtor.findUnique({
            where: { userId: token.id as string, id },
        });

        if (!debtor) {
            return NextResponse.json(
                { error: "Debtor not found" },
                { status: 404 }
            );
        }

        const updatedDebtor = await prisma.debtor.update({
            where: { userId: token.id as string, id },
            data: {
                currentDebt: currentDebt ?? debtor.currentDebt,
                totalDebt: totalDebt ?? debtor.totalDebt,
            },
        });

        return NextResponse.json(updatedDebtor);
    } catch (error) {
        console.error("Failed to update debtor:", error);
        return NextResponse.json(
            { error: "Failed to update debtor" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { token, error } = await requireAuth(req);
    if (error) return error;

    const { id } = await context.params;
    const idCheck = idSchema.safeParse({ id });

    if (!idCheck.success) {
        return NextResponse.json(
            { error: z.flattenError(idCheck.error) },
            { status: 400 }
        );
    }

    try {
        const debtor = await prisma.debtor.findUnique({
            where: { userId: token.id as string, id },
        });

        if (!debtor) {
            return NextResponse.json(
                { error: "Debtor not found" },
                { status: 404 }
            );
        }

        await prisma.debtor.delete({
            where: { userId: token.id as string, id },
        });

        return NextResponse.json({
            message: "Debtor deleted successfully",
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
