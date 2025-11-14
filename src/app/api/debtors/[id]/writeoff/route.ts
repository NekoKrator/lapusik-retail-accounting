import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/auth-utils";
import z from "zod";

const prisma = new PrismaClient();

const idSchema = z.object({
    id: z.uuid(),
});

const writeoffDebtorSchema = z.object({
    currentDebt: z.number().positive(),
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
        const parsed = writeoffDebtorSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: z.flattenError(parsed.error) },
                { status: 400 }
            );
        }

        const { currentDebt } = parsed.data;

        const debtor = await prisma.debtor.findUnique({
            where: { userId: token.id as string, id },
        });

        if (!debtor) {
            return NextResponse.json(
                { error: "Debtor not found" },
                { status: 404 }
            );
        }

        if (currentDebt > debtor.currentDebt) {
            return NextResponse.json(
                { error: "currentDebt exceeds debtor debt" },
                { status: 400 }
            );
        }

        const updated = await prisma.debtor.update({
            where: { userId: token.id as string, id },
            data: { currentDebt: { decrement: currentDebt } },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Failed to write off debt:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
