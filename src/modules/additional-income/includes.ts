import type { Prisma } from "@/generated/prisma/client";

export const listInclude = {
  debtor: { select: { id: true, name: true } },
} satisfies Prisma.AdditionalIncomeInclude;

export const deleteSelect = {
  id: true,
} satisfies Prisma.AdditionalIncomeSelect;
