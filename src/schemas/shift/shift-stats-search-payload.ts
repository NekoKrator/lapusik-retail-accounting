import z from "zod";
import { OrderEnum, PaginationSchema } from "../search/common";
import { filterSchema } from "../search/filter";
import { ShiftFilterSchema } from "./shift-filter-schema";
import { ShiftOrderByEnum } from "./shift-order-by-schema";

export const ShiftStatsBodySchema = PaginationSchema.extend({
  orderBy: ShiftOrderByEnum.optional(),
  order: OrderEnum.optional(),
  filters: z.array(filterSchema(ShiftFilterSchema)).optional(),
});

export type ShiftStatsInput = z.input<typeof ShiftStatsBodySchema>;
