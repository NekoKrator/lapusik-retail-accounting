import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/auth-utils";
import z from "zod";

const prisma = new PrismaClient();

const idSchema = z.object({
    id: z.uuid(),
});

const updateDeliverySchema = z.object({
    paidByCashier: z.number().min(0).optional(),
    paidByOwner: z.number().min(0).optional(),
});

export async function GET(
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
        const delivery = await prisma.supplierDelivery.findUnique({
            where: { userId: token.id as string, id },
            include: { supplier: true },
        });

        if (!delivery) {
            return NextResponse.json(
                { error: "Delivery not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(delivery);
    } catch (err) {
        console.error("Failed to fetch delivery:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

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
        const parsed = updateDeliverySchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: z.flattenError(parsed.error) },
                { status: 400 }
            );
        }

        const delivery = await prisma.supplierDelivery.findUnique({
            where: { userId: token.id as string, id },
        });

        if (!delivery) {
            return NextResponse.json(
                { error: "Delivery not found" },
                { status: 404 }
            );
        }

        const { paidByCashier, paidByOwner } = parsed.data;

        const updatedDelivery = await prisma.supplierDelivery.update({
            where: { userId: token.id as string, id: id },
            data: {
                paidByCashier: paidByCashier ?? delivery.paidByCashier,
                paidByOwner: paidByOwner ?? delivery.paidByOwner,
                debt:
                    delivery.totalPrice -
                    (paidByCashier ?? delivery.paidByCashier) -
                    (paidByOwner ?? delivery.paidByOwner),
            },
            include: { supplier: true },
        });

        return NextResponse.json(updatedDelivery);
    } catch (err) {
        console.error("Failed to update delivery:", err);
        return NextResponse.json(
            { error: "Internal server error" },
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
        const delivery = await prisma.supplierDelivery.findUnique({
            where: { userId: token.id as string, id: id },
        });

        if (!delivery) {
            return NextResponse.json(
                { error: "Delivery not found" },
                { status: 404 }
            );
        }

        await prisma.supplierDelivery.delete({
            where: { userId: token.id as string, id: id },
        });

        return NextResponse.json({
            message: "Delivery deleted successfully",
        });
    } catch (err) {
        console.error("Failed to delete delivery:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
