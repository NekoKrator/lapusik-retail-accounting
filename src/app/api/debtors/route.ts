import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const debtors = await prisma.debtor.findMany({
            where: {
                userId: token.id as string,
            },
            orderBy: {
                createdAt: "desc",
            },
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
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, amount } = body;

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return NextResponse.json(
                { error: "Invalid debtor name" },
                { status: 400 }
            );
        }

        if (typeof amount !== "number" || amount <= 0) {
            return NextResponse.json(
                { error: "Invalid debt amount" },
                { status: 400 }
            );
        }

        const existing = await prisma.debtor.findFirst({
            where: {
                name: name.trim(),
                userId: token.id as string,
            },
        });

        if (existing) {
            const updated = await prisma.debtor.update({
                where: { id: existing.id },
                data: {
                    amount: existing.amount + amount,
                    updatedAt: new Date(),
                },
            });
            return NextResponse.json(updated, { status: 200 });
        }

        const newDebtor = await prisma.debtor.create({
            data: {
                name: name.trim(),
                amount: amount,
                userId: token.id as string,
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
