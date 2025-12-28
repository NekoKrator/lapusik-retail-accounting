import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { ExpenseCreateInput } from "@/schemas/expense/expense-schema";
import { listInclude } from "./includes";

export function findManyExpense(where: Prisma.ExpenseWhereInput) {
  return prisma.expense.findMany({
    where,
    include: listInclude,
    orderBy: { createdAt: "desc" },
  });
}

export function createExpense(shiftId: string, data: ExpenseCreateInput) {
  return prisma.expense.create({
    data: {
      shift: {
        connect: {
          id: shiftId,
        },
      },
      ...data,
    },
    include: listInclude,
  });
}

export function deleteExpense(id: string) {
  return prisma.expense.delete({
    where: { id },
  });
}

export function deleteManyExpense(ids: string[]) {
  return prisma.expense.deleteMany({
    where: { id: { in: ids } },
  });
}
