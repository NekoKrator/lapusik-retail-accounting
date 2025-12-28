import type { Prisma } from "@/generated/prisma/client";
import type { listSelect, updateSelect } from "./includes";

export type SupplierListDb = Prisma.SupplierGetPayload<{
  select: typeof listSelect;
}>;

export type SupplierUpdateDb = Prisma.SupplierGetPayload<{
  select: typeof updateSelect;
}>;
