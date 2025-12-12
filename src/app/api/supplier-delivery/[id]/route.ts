import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/validate-request";
import { SupplierDeliveryUpdateSchema } from "@/schemas/supplier-delivery-schema";
import { handlePrismaError } from "@/utils/error-handlers";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const validate = validateRequest({
      bodySchema: SupplierDeliveryUpdateSchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body } = data;

    const updatedSupplierDelivery = await prisma.supplierDelivery.update({
      where: { id },
      data: body,
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
  try {
    const session = await getServerSession();
    const { id } = await context.params;

    const deletedExpenses = await prisma.supplierDelivery.delete({
      where: { id, userId: session?.user.id },
      include: { supplier: true, expenses: true },
    });

    return NextResponse.json(deletedExpenses);
  } catch (err) {
    return handlePrismaError(err);
  }
}
