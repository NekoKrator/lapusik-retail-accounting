import z from "zod";
import { OrderEnum, PaginationSchema } from "../search/common";
import { filterSchema } from "../search/filter";
import { DebtorFilterSchema } from "./debtor-filter-schema";
import { DebtorOrderByEnum } from "./debtor-order-by-schema";

export const DebtorStatsBodySchema = PaginationSchema.extend({
  orderBy: DebtorOrderByEnum.optional(),
  order: OrderEnum.optional(),
  filters: z.array(filterSchema(DebtorFilterSchema)).optional(),
});

export type DebtorStatsInput = z.input<typeof DebtorStatsBodySchema>;
