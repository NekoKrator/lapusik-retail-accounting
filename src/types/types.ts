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
  totalCashRegister: number | null;
  terminalRegister: number | null;
  actualClosingBalance: number | null;
};

export type RefetchTanstackQuery<T> = (
  options?: RefetchOptions
) => Promise<QueryObserverResult<T, Error>>;

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type FilterSearchParams = {
  [key: `filter[${string}]`]: unknown | undefined;
  [key: `filter[${string}][${string}]`]: unknown | undefined;
};
