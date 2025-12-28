import z from "zod";
import { OrderEnum, PaginationSchema } from "../search/common";
import { filterSchema } from "../search/filter";
import { SupplierDeliveryFilterSchema } from "./supplier-delivery-filter-schema";
import { SupplierDeliveryOrderByEnum } from "./supplier-delivery-order-by-schema";

export const SupplierDeliveryStatsBodySchema = PaginationSchema.extend({
  orderBy: SupplierDeliveryOrderByEnum.optional(),
  order: OrderEnum.optional(),
  filters: z.array(filterSchema(SupplierDeliveryFilterSchema)).optional(),
});

export type SupplierDeliveryStatsInput = z.input<
  typeof SupplierDeliveryStatsBodySchema
>;
