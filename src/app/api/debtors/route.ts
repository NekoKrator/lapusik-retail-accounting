import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/auth-utils";
import z from "zod";

const prisma = new PrismaClient();

const debtorSchema = z.object({
    name: z.string().trim().min(1),
    currentDebt: z.number().positive(),
});

export async function GET(req: NextRequest) {
    const { token, error } = await requireAuth(req);
    if (error) return error;

    try {
        const debtors = await prisma.debtor.findMany({
            where: { userId: token.id as string },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(debtors);
    } catch (error) {
        console.error("Failed to fetch debtors:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const { token, error } = await requireAuth(req);
    if (error) return error;

    try {
        const body = await req.json();
        const parsed = debtorSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: z.flattenError(parsed.error) },
                { status: 400 }
            );
        }

        const { name, currentDebt } = parsed.data;

        const debtor = await prisma.debtor.findFirst({
            where: {
                userId: token.id as string,
                name: name.trim(),
            },
        });

        if (debtor) {
            const updated = await prisma.debtor.update({
                where: { userId: token.id as string, id: debtor.id },
                data: {
                    currentDebt: { increment: currentDebt },
                    totalDebt: { increment: currentDebt },
                },
            });
            return NextResponse.json(updated, { status: 200 });
        }

        const newDebtor = await prisma.debtor.create({
            data: {
                userId: token.id as string,
                name: name.trim(),
                currentDebt: currentDebt,
                totalDebt: currentDebt,
            },
        });

        return NextResponse.json(newDebtor, { status: 201 });
    } catch (error) {
        console.error("Failed to create or update debtor:", error);
        return NextResponse.json(
            { error: "Failed to create or update debtor" },
            { status: 500 }
        );
    }
}
