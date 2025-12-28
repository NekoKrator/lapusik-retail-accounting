import type { Prisma } from "@/generated/prisma/client";

export const listInclude = {
  supplier: { select: { id: true, name: true } },
} satisfies Prisma.SupplierDeliveryInclude;

export const updateSelect = {
  id: true,
  paidByCashier: true,
  paidByOwner: true,
  status: true,
  updatedAt: true,
} satisfies Prisma.SupplierDeliverySelect;

export const deleteSelect = {
  id: true,
} satisfies Prisma.SupplierDeliverySelect;

export const writeOffSelect = {
  id: true,
  status: true,
  paidByCashier: true,
  paidByOwner: true,
} satisfies Prisma.SupplierDeliverySelect;
