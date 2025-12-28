import { z } from "zod";

export const SupplierOrderByEnum = z.enum([
  "name",

  // computed
  "totalCurrentDebt",
  "totalPaidByCashier",
  "totalPaidByOwner",
  "totalPaid",
  "activeDeliveriesCount",
  "paidDeliveriesCount",
  "canceledDeliveriesCount",
  "totalDeliveriesCount",
]);

export type SupplierOrderBy = z.input<typeof SupplierOrderByEnum>;
