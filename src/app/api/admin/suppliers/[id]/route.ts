import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "@/lib/auth-utils";
import z from "zod";

const prisma = new PrismaClient();

const idSchema = z.object({
    id: z.uuid(),
});

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { error } = await requireAuth(req);
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
        const supplier = await prisma.supplier.findUnique({ where: { id } });

        if (!supplier) {
            return NextResponse.json(
                { error: "Supplier not found" },
                { status: 404 }
            );
        }

        await prisma.supplier.delete({ where: { id } });

        return NextResponse.json({ message: "Supplier deleted successfully" });
    } catch (error) {
        console.error("Failed to delete supplier:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
