import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/auth-utils";
import z from "zod";

const prisma = new PrismaClient();

const openShiftSchema = z.object({
    openingBalance: z.number().min(0),
});

export async function POST(req: NextRequest) {
    const { token, error } = await requireAuth(req);
    if (error) return error;

    try {
        const body = await req.json();
        const parsed = openShiftSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: z.flattenError(parsed.error) },
                { status: 400 }
            );
        }

        const { openingBalance } = parsed.data;

        const result = await prisma.$transaction(async (tx) => {
            const existing = await tx.shift.findFirst({
                where: { userId: token.id as string, isClosed: false },
                select: { id: true },
            });

            if (existing) {
                return NextResponse.json(
                    { error: "The user already has one open shift" },
                    { status: 400 }
                );
            }

            return await tx.shift.create({
                data: { userId: token.id as string, openingBalance },
            });
        });

        return NextResponse.json(result, { status: 201 });
    } catch (err) {
        console.error("Failed to open shift:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
