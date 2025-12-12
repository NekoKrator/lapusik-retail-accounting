import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/validate-request";
import { SupplierDeliveryWriteOffSchema } from "@/schemas/supplier-delivery-schema";
import { handlePrismaError } from "@/utils/error-handlers";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    const { id } = await context.params;

    const validate = validateRequest({
      bodySchema: SupplierDeliveryWriteOffSchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body } = data;

    const delivery = await prisma.supplierDelivery.findUnique({
      where: { userId: session?.user.id, id },
    });

    if (!delivery) {
      return NextResponse.json(
        { error: "Доставку постачальника не знайдено" },
        { status: 404 }
      );
    }

    const newPaidByCashier = body.paidByCashier ?? 0;
    const newPaidByOwner = body.paidByOwner ?? 0;
    const amountToWriteOff = newPaidByCashier + newPaidByOwner;
    const currentDebt =
      delivery.price -
      Number(delivery.paidByCashier) -
      Number(delivery.paidByOwner);

    if (amountToWriteOff > currentDebt) {
      return NextResponse.json(
        { error: "Сума списання перевищує наявний борг" },
        { status: 400 }
      );
    }

    const isPaidOff = amountToWriteOff === currentDebt;

    const wroteOffDelivery = await prisma.supplierDelivery.update({
      where: { userId: session?.user.id, id },
      data: {
        isPaidOff,
        ...body,
      },
      include: { supplier: true },
    });

    return NextResponse.json(wroteOffDelivery);
  } catch (err) {
    return handlePrismaError(err);
  }
}
