import type {
  AdditionalIncomeDeleteResult,
  AdditionalIncomeListItem,
} from "./contracts";
import type {
  AdditionalIncomeDeleteDb,
  AdditionalIncomeListDb,
} from "./db-types";

export function toListItem(
  db: AdditionalIncomeListDb
): AdditionalIncomeListItem {
  return {
    id: db.id,
    category: db.category,
    amount: Number(db.amount),
    createdAt: db.createdAt,
    updatedAt: db.updatedAt,

    debtor: db.debtor,
  };
}

export function toDeleteResult(
  db: AdditionalIncomeDeleteDb
): AdditionalIncomeDeleteResult {
  return {
    id: db.id,
  };
}
