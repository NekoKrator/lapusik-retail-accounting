import { type NextRequest, NextResponse } from "next/server";
import z from "zod";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { SupplierUpdateInput } from "@/schemas/supplier-schema";
import { handlePrismaError } from "@/utils/error-handlers";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth(["admin"]);
  if (error) {
    return error;
  }

  try {
    const { id } = await context.params;
    const body = await req.json();
    const parsed = SupplierUpdateInput.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: z.flattenError(parsed.error) },
        { status: 400 }
      );
    }

    const updatedSupplier = await prisma.supplier.update({
      where: { id },
      data: parsed.data,
      include: { deliveries: true },
    });

    return NextResponse.json(updatedSupplier);
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth(["admin"]);
  if (error) {
    return error;
  }

  try {
    const { id } = await context.params;
    const deletedSupplier = await prisma.supplier.delete({
      where: { id },
      include: { deliveries: true },
    });

    return NextResponse.json(deletedSupplier);
  } catch (err) {
    return handlePrismaError(err);
  }
}
