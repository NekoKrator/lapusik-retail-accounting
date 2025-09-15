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
        const supplierPayments = await prisma.supplierPayment.findMany({
            where: {
                userId: token.id as string,
            },
            orderBy: {
                date: "desc",
            },
            include: {
                supplier: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        const flat = supplierPayments.map((p) => ({
            ...p,
            supplierName: p.supplier.name,
        }));

        return NextResponse.json(flat);
    } catch (error) {
        console.error("Failed to fetch supplierPayment:", error);
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
        const { totalPrice, debt, paymentType, paidOff, supplierId } = body;

        if (typeof totalPrice !== "number" || totalPrice <= 0) {
            return NextResponse.json(
                { error: "Invalid total price" },
                { status: 400 }
            );
        }

        if (typeof debt !== "number" || debt < 0) {
            return NextResponse.json(
                { error: "Invalid debt amount" },
                { status: 400 }
            );
        }

        const newPayment = await prisma.supplierPayment.create({
            data: {
                totalPrice: totalPrice,
                debt: debt,
                paymentType: paymentType,
                paidOff: paidOff,
                userId: token.id as string,
                supplierId: supplierId,
            },
            include: {
                supplier: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        const flatPayment = {
            ...newPayment,
            supplierName: newPayment.supplier.name,
        };

        return NextResponse.json(flatPayment, { status: 201 });
    } catch (error) {
        console.error("Failed to create or update debtor:", error);
        return NextResponse.json(
            { error: "Failed to create or update debtor" },
            { status: 500 }
        );
    }
}
