import { z } from "zod";

export const ShiftOrderByEnum = z.enum([
  "userId",
  "isClosed",
  "openingBalance",
  "totalAdditionalIncome",
  "totalExpenses",
  "totalCashRegister",
  "terminalRegister",
  "expectedClosingBalance",
  "actualClosingBalance",
  "openedAt",
  "closedAt",

  // connected
  "displayUsername",

  // computed
  "shiftDuration",
]);

export type ShiftOrderBy = z.infer<typeof ShiftOrderByEnum>;
