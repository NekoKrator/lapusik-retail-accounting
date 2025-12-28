import type { Prisma } from "@/generated/prisma/client";

export const writeOffSelect = {
  id: true,
  paidAmount: true,
  status: true,
  updatedAt: true,
} satisfies Prisma.DebtSelect;

export const cancelSelect = {
  id: true,
} satisfies Prisma.DebtSelect;
