import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { Shift } from "@/generated/prisma/client";

export type ShiftCurrent = {
  currentShift: Shift | null;
  lastClosedShift: Shift | null;
};

export type LocalStorageDraft = {
  actualClosingBalance: number | null;
  totalCashRegister: number | null;
};

export type RefetchTanstackQuery<T> = (
  options?: RefetchOptions
) => Promise<QueryObserverResult<T, Error>>;
