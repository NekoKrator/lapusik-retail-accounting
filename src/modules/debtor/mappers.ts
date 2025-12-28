import type { Debt } from "@/generated/prisma/client";
import type { AdditionalIncomeListDb } from "../additional-income/db-types";
import { toListItem as toAdditionalIncomeListItem } from "../additional-income/mappers";
import type { DebtWriteOffDb } from "../debt/db-types";
import { toListItem as toDebtListItem } from "../debt/mappers";
import type { ExpenseListDb } from "../expense/db-types";
import type {
  DebtorDeleteResult,
  DebtorListItem,
  DebtorUpdateResult,
  DebtorUpsertResult,
  DebtorWriteOffResult,
} from "./contracts";
import type {
  DebtorDeleteDb,
  DebtorListDb,
  DebtorUpdateDb,
  DebtorWriteOffDb,
} from "./db-types";

export function toListItem(db: DebtorListDb): DebtorListItem {
  return {
    id: db.id,
    name: db.name,
    createdAt: db.createdAt,
    updatedAt: db.updatedAt,

    debts: db.debts,
  };
}

export function toUpdateResult(db: DebtorUpdateDb): DebtorUpdateResult {
  return {
    id: db.id,
    name: db.name,
    updatedAt: db.updatedAt,

    debts: db.debts,
  };
}

export function toDeleteResult(db: DebtorDeleteDb): DebtorDeleteResult {
  return {
    id: db.id,

    debts: db.debts,
  };
}

export function toUpsertResult({
  debtor,
  debt,
  expense,
}: {
  debtor: DebtorListDb;
  debt: Debt;
  expense?: ExpenseListDb;
}): DebtorUpsertResult {
  return {
    id: debtor.id,
    name: debtor.name,
    createdAt: debtor.createdAt,
    updatedAt: debtor.updatedAt,
    expense,

    debts: [...debtor.debts, toDebtListItem(debt)],
  };
}

export function toWriteOffResult({
  debtor,
  debts,
  additionalIncome,
}: {
  debtor: DebtorWriteOffDb;
  debts: DebtWriteOffDb[];
  additionalIncome?: AdditionalIncomeListDb;
}): DebtorWriteOffResult {
  return {
    id: debtor.id,

    debts,
    additionalIncome: additionalIncome
      ? toAdditionalIncomeListItem(additionalIncome)
      : undefined,
  };
}
