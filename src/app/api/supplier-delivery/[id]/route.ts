import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { SupplierDeliveryUpdateSchema } from "@/schemas/supplier-delivery-schema";
import { handlePrismaError } from "@/utils/error-handlers";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) {
    return error;
  }

  try {
    const body = await req.json();
    const parsed = SupplierDeliveryUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: z.flattenError(parsed.error) },
        { status: 400 }
      );
    }

    const { id } = await context.params;

    const updatedSupplierDelivery = await prisma.supplierDelivery.update({
      where: { id },
      data: parsed.data,
      include: { expenses: true },
    });

    return NextResponse.json(updatedSupplierDelivery);
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) {
    return error;
  }

  try {
    const { id } = await context.params;

    const deletedExpenses = await prisma.supplierDelivery.delete({
      where: { id, userId: session.user.id },
      include: { supplier: true, expenses: true },
    });

    return NextResponse.json(deletedExpenses);
  } catch (err) {
    return handlePrismaError(err);
  }
}
