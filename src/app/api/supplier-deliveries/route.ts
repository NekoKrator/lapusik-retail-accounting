import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/auth-utils";
import { z } from "zod";

const prisma = new PrismaClient();

const deliverySchema = z.object({
    supplierId: z.uuid(),
    totalPrice: z.number().min(0),
    paidByCashier: z.number().min(0).default(0),
    paidByOwner: z.number().min(0).default(0),
});

export async function GET(req: NextRequest) {
    const { token, error } = await requireAuth(req);
    if (error) return error;

    try {
        const deliveries = await prisma.supplierDelivery.findMany({
            where: { userId: token.id as string },
            include: { supplier: true },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(deliveries);
    } catch (err) {
        console.error("Failed to fetch deliveries:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const { token, error } = await requireAuth(req);
    if (error) return error;

    try {
        const body = await req.json();
        const parsed = deliverySchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: z.flattenError(parsed.error) },
                { status: 400 }
            );
        }

        const { supplierId, totalPrice, paidByCashier, paidByOwner } =
            parsed.data;
        const debt = totalPrice - paidByCashier - paidByOwner;

        const delivery = await prisma.supplierDelivery.create({
            data: {
                supplierId,
                userId: token.id as string,
                totalPrice,
                paidByCashier,
                paidByOwner,
                debt,
            },
            include: { supplier: true },
        });

        return NextResponse.json(delivery, { status: 201 });
    } catch (err) {
        console.error("Failed to create delivery:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
