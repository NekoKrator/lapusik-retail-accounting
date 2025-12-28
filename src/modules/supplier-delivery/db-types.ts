import type { Prisma } from "@/generated/prisma/client";
import type {
  deleteSelect,
  listInclude,
  updateSelect,
  writeOffSelect,
} from "./includes";

export type SupplierDeliveryListDb = Prisma.SupplierDeliveryGetPayload<{
  include: typeof listInclude;
}>;

export type SupplierDeliveryUpdateDb = Prisma.SupplierDeliveryGetPayload<{
  select: typeof updateSelect;
}>;

export type SupplierDeliveryDeleteDb = Prisma.SupplierDeliveryGetPayload<{
  select: typeof deleteSelect;
}>;

export type SupplierDeliveryWriteOffDb = Prisma.SupplierDeliveryGetPayload<{
  select: typeof writeOffSelect;
}>;
