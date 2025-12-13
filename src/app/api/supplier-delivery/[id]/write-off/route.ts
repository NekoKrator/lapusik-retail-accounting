import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod";
import type { ExpenseCategory } from "@/generated/prisma/enums";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/validate-request";
import { SupplierDeliveryWriteOffSchema } from "@/schemas/supplier-delivery-schema";
import { handlePrismaError } from "@/utils/error-handlers";

const PatchQuerySchema = z.object({
  shiftId: z.string().min(1).optional(),
});

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    const { id } = await context.params;

    const delivery = await prisma.supplierDelivery.findUnique({
      where: { userId: session?.user.id, id },
    });

    if (!delivery) {
      return NextResponse.json(
        { error: "Доставку постачальника не знайдено" },
        { status: 404 }
      );
    }

    const currentDebt =
      delivery.price -
      Number(delivery.paidByCashier) -
      Number(delivery.paidByOwner);

    const validate = validateRequest({
      bodySchema: SupplierDeliveryWriteOffSchema(currentDebt),
      querySchema: PatchQuerySchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body, query } = data;

    const newPaidByCashier = body.paidByCashier ?? 0;
    const newPaidByOwner = body.paidByOwner ?? 0;
    const amountToWriteOff = newPaidByCashier + newPaidByOwner;

    const isPaidOff = amountToWriteOff === currentDebt;

    const newExpenseCreate =
      query.shiftId && body.paidByCashier
        ? {
            create: {
              category: "SUPPLIER_PAYMENT" as ExpenseCategory,
              amount: body.paidByCashier,
              shift: {
                connect: {
                  id: query.shiftId,
                },
              },
            },
          }
        : undefined;

    const wroteOffDelivery = await prisma.supplierDelivery.update({
      where: { userId: session?.user.id, id },
      data: {
        isPaidOff,
        paidByCashier: { increment: newPaidByCashier },
        paidByOwner: { increment: newPaidByOwner },
        expenses: newExpenseCreate,
      },
      include: {
        supplier: true,
        expenses: {
          include: {
            supplierDelivery: {
              include: { supplier: { select: { name: true } } },
            },
          },
        },
      },
    });

    return NextResponse.json(wroteOffDelivery);
  } catch (err) {
    return handlePrismaError(err);
  }
}
