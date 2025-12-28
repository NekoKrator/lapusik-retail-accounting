import type { ExpenseDeleteResult, ExpenseListItem } from "./contracts";
import type { ExpenseListDb } from "./db-types";

export function toListItem(db: ExpenseListDb): ExpenseListItem {
  return {
    id: db.id,
    category: db.category,
    amount: Number(db.amount),
    createdAt: db.createdAt,
    updatedAt: db.updatedAt,

    debtor: db.debtor,
    supplierDelivery: db.supplierDelivery,
  };
}

export function toDeleteResult(db: ExpenseDeleteResult): ExpenseDeleteResult {
  return {
    id: db.id,
  };
}
