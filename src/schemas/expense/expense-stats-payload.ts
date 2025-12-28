import z from "zod";
import { OrderEnum, PaginationSchema } from "../search/common";
import { filterSchema } from "../search/filter";
import { ExpenseFilterSchema } from "./expense-filter-schema";
import { ExpenseOrderByEnum } from "./expense-order-by-schema";

export const ExpenseStatsBodySchema = PaginationSchema.extend({
  orderBy: ExpenseOrderByEnum.optional(),
  order: OrderEnum.optional(),
  filters: z.array(filterSchema(ExpenseFilterSchema)).optional(),
});

export type ExpenseStatsInput = z.input<typeof ExpenseStatsBodySchema>;
