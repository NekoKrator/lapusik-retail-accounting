import { z } from "zod";

export const ExpenseOrderByEnum = z.enum([
  "category",
  "amount",
  "createdAt",

  // computed
  "displayUsername",
]);

export type ExpenseOrderBy = z.input<typeof ExpenseOrderByEnum>;
