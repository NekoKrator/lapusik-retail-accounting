import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { SupplierDeliveryWriteOffSchema } from "@/schemas/supplier-delivery-schema";
import { handlePrismaError } from "@/utils/error-handlers";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) {
    return error;
  }

  try {
    const { id } = await context.params;

    const delivery = await prisma.supplierDelivery.findUnique({
      where: { userId: session.user.id, id },
    });

    if (!delivery) {
      return NextResponse.json(
        { error: "Доставку постачальника не знайдено" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const parsed = SupplierDeliveryWriteOffSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: z.flattenError(parsed.error) },
        { status: 400 }
      );
    }
    const newPaidByCashier = parsed.data.paidByCashier ?? 0;
    const newPaidByOwner = parsed.data.paidByOwner ?? 0;
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
      where: { userId: session.user.id, id },
      data: {
        isPaidOff,
        ...parsed.data,
      },
      include: { supplier: true },
    });

    return NextResponse.json(wroteOffDelivery);
  } catch (err) {
    return handlePrismaError(err);
  }
}
