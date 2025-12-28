import { z } from "zod";

export const SupplierDeliveryOrderByEnum = z.enum([
  "invoiceNumber",
  "price",
  "paidByCashier",
  "paidByOwner",
  "status",
  "createdAt",
  "updatedAt",

  // connected
  "displayUsername",
  "supplierName",

  // computed
  "debt",
]);

export type SupplierDeliveryOrderBy = z.input<
  typeof SupplierDeliveryOrderByEnum
>;
