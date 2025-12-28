import type { Prisma } from "@/generated/prisma/client";

export const listInclude = {
  debtor: { select: { id: true, name: true } },
  supplierDelivery: {
    select: { supplier: { select: { id: true, name: true } } },
  },
} satisfies Prisma.ExpenseInclude;

export const deleteSelect = {
  id: true,
} satisfies Prisma.ExpenseSelect;
