import z from "zod";
import { OrderEnum, PaginationSchema } from "../search/common";
import { filterSchema } from "../search/filter";
import { AdditionalIncomeFilterSchema } from "./additional-income-filter-schema";
import { AdditionalIncomeOrderByEnum } from "./additional-income-order-by-schema";

export const AdditionalIncomeStatsBodySchema = PaginationSchema.extend({
  orderBy: AdditionalIncomeOrderByEnum.optional(),
  order: OrderEnum.optional(),
  filters: z.array(filterSchema(AdditionalIncomeFilterSchema)).optional(),
});

export type AdditionalIncomeStatsInput = z.input<
  typeof AdditionalIncomeStatsBodySchema
>;
