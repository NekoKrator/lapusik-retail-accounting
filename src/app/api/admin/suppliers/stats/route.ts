import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/auth-utils";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { error } = await requireAuth(req);
    if (error) return error;

    try {
        const stats = await prisma.supplier.findMany({
            include: {
                deliveries: {
                    select: {
                        paidByCashier: true,
                        paidByOwner: true,
                        debt: true,
                    },
                },
            },
            orderBy: { name: "asc" },
        });

        // Агрегація даних по кожному постачальнику
        const result = stats.map((supplier) => {
            const operationsCount = supplier.deliveries.length;
            const paidByCashier = supplier.deliveries.reduce(
                (sum, d) => sum + d.paidByCashier,
                0
            );
            const paidByOwner = supplier.deliveries.reduce(
                (sum, d) => sum + d.paidByOwner,
                0
            );
            const totalPaid = paidByCashier + paidByOwner;
            const currentDebt = supplier.deliveries.reduce(
                (sum, d) => sum + d.debt,
                0
            );

            return {
                supplierId: supplier.id,
                supplierName: supplier.name,
                operationsCount,
                paidByCashier,
                paidByOwner,
                totalPaid,
                currentDebt,
            };
        });

        return NextResponse.json(result);
    } catch (err) {
        console.error("Failed to fetch supplier stats:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
