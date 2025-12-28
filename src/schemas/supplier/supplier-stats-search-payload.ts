import z from "zod";
import { OrderEnum, PaginationSchema } from "../search/common";
import { filterSchema } from "../search/filter";
import { SupplierFilterSchema } from "./supplier-filter-schema";
import { SupplierOrderByEnum } from "./supplier-order-by-schema";

export const SupplierStatsBodySchema = PaginationSchema.extend({
  orderBy: SupplierOrderByEnum.optional(),
  order: OrderEnum.optional(),
  filters: z.array(filterSchema(SupplierFilterSchema)).optional(),
});

export type SupplierStatsInput = z.input<typeof SupplierStatsBodySchema>;
