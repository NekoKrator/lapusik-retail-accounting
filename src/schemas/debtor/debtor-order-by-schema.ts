import { z } from "zod";

export const DebtorOrderByEnum = z.enum([
  "name",

  // computed
  "totalCurrentDebt",
  "totalDebt",
  "totalPaid",
  "activeDebtsCount",
  "paidDebtsCount",
  "canceledDebtsCount",
  "totalDebtsCount",
]);

export type DebtorOrderBy = z.input<typeof DebtorOrderByEnum>;
