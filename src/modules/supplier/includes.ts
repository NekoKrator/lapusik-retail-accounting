import type { Prisma } from "@/generated/prisma/client";

export const listSelect = {
  id: true,
  name: true,
} satisfies Prisma.SupplierSelect;

export const updateSelect = {
  id: true,
  name: true,
  updatedAt: true,
} satisfies Prisma.SupplierSelect;
