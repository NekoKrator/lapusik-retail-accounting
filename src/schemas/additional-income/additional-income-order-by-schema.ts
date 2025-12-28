import { z } from "zod";

export const AdditionalIncomeOrderByEnum = z.enum([
  "category",
  "amount",
  "createdAt",

  // computed
  "displayUsername",
]);

export type AdditionalIncomeOrderBy = z.input<
  typeof AdditionalIncomeOrderByEnum
>;
