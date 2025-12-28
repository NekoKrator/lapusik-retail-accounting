import type { Debt } from "@/generated/prisma/client";
import type { DebtCancelResult, DebtListItem } from "./contracts";
import type { DebtCancelDb } from "./db-types";

export function toListItem(db: Debt): DebtListItem {
  return {
    id: db.id,
    amount: Number(db.amount),
    paidAmount: Number(db.paidAmount),
    status: db.status,
    createdAt: db.createdAt,
    updatedAt: db.updatedAt,
  };
}

export function toCancelResult(db: DebtCancelDb): DebtCancelResult {
  return {
    id: db.id,
  };
}
