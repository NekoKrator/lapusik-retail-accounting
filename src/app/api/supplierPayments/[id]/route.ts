import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        const payment = await prisma.supplierPayment.findFirst({
            where: { id, userId: token.id as string },
        });

        if (!payment) {
            return NextResponse.json(
                { error: "Supplier payment not found" },
                { status: 404 }
            );
        }

        await prisma.supplierPayment.delete({ where: { id } });

        return NextResponse.json({
            message: "Supplier payment deleted successfully",
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        const body = await req.json();

        const existingPayments = await prisma.supplierPayment.findFirst({
            where: {
                id,
                userId: token.id as string,
            },
        });

        if (!existingPayments) {
            return NextResponse.json(
                { error: "Supplier payment not found" },
                { status: 404 }
            );
        }

        const updatedPayment = await prisma.supplierPayment.update({
            where: { id },
            data: {
                ...body,
            },
        });

        return NextResponse.json(updatedPayment);
    } catch (error) {
        console.error("Failed to update supplier payment:", error);
        return NextResponse.json(
            { error: "Failed to update supplier payment" },
            { status: 500 }
        );
    }
}
