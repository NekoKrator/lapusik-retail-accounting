import { prisma } from "@/lib/prisma";
import type { ExpenseListDb } from "../expense/db-types";
import { listInclude as expenseListInclude } from "../expense/includes";

export function writeOffSupplierDelivery({
  deliveryId,
  userId,
  paidByCashier,
  paidByOwner,
  shiftId,
}: {
  deliveryId: string;
  userId: string;
  paidByCashier: number;
  paidByOwner: number;
  shiftId?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const delivery = await tx.supplierDelivery.findUnique({
      where: { id: deliveryId, userId },
    });

    if (!delivery) {
      throw new Error("DELIVERY_NOT_FOUND");
    }

    const currentDebt =
      delivery.price -
      Number(delivery.paidByCashier) -
      Number(delivery.paidByOwner);

    if (paidByCashier + paidByOwner > currentDebt) {
      throw new Error("Сума списання перевищує наявний борг");
    }

    const amount = paidByCashier + paidByOwner;
    const status = amount === currentDebt ? "PAID" : "ACTIVE";

    const updatedDelivery = await tx.supplierDelivery.update({
      where: { id: deliveryId, userId },
      data: {
        status,
        paidByCashier: { increment: paidByCashier },
        paidByOwner: { increment: paidByOwner },
      },
    });

    let expense: ExpenseListDb | undefined;
    if (paidByCashier > 0 && shiftId) {
      expense = await tx.expense.create({
        data: {
          category: "SUPPLIER_PAYMENT",
          amount: paidByCashier,
          supplierDelivery: { connect: { id: deliveryId } },
          shift: { connect: { id: shiftId } },
        },
        include: expenseListInclude,
      });
    }

    return { updatedDelivery, expense };
  });
}
