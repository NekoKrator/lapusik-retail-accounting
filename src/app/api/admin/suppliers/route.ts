import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/auth-utils";
import z from "zod";

const prisma = new PrismaClient();

const supplierSchema = z.object({
    name: z.string().trim().min(1),
});

export async function GET(req: NextRequest) {
    const { error } = await requireAuth(req);
    if (error) return error;

    try {
        const suppliers = await prisma.supplier.findMany();
        return NextResponse.json(suppliers);
    } catch (error) {
        console.error("Failed to fetch suppliers:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const { error } = await requireAuth(req, ["admin"]);
    if (error) return error;

    try {
        const body = await req.json();
        const parsed = supplierSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: z.flattenError(parsed.error) },
                { status: 400 }
            );
        }

        const { name } = parsed.data;

        const newSupplier = await prisma.supplier.create({
            data: {
                name,
            },
        });

        const result = {
            supplierId: newSupplier.id,
            supplierName: newSupplier.name,
            operationsCount: 0,
            paidByCashier: 0,
            paidByOwner: 0,
            totalPaid: 0,
            currentDebt: 0,
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error("Failed to create supplier:", error);
        return NextResponse.json(
            { error: "Failed to create supplier" },
            { status: 500 }
        );
    }
}
