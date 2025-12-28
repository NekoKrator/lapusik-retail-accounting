import type { Prisma } from "@/generated/prisma/client";

export const currentShiftSelect = {
  id: true,
  openingBalance: true,
  openedAt: true,
} satisfies Prisma.ShiftSelect;

export const lastClosedShiftSelect = {
  id: true,
  actualClosingBalance: true,
  closedAt: true,
} satisfies Prisma.ShiftSelect;
