import type { DebtStatus } from "@/generated/prisma/enums";
import type { AdditionalIncomeListItem } from "../additional-income/contracts";
import type { DebtListItem, DebtUpdateResult } from "../debt/contracts";
import type { ExpenseListItem } from "../expense/contracts";

export type DebtorListItem = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  debts: DebtListItem[];
};

export type DebtorUpdateResult = {
  id: string;
  name?: string;
  updatedAt?: Date;

  debts?: DebtUpdateResult[];
};

export type DebtorDeleteResult = {
  id: string;

  debts: {
    id: string;
  }[];
};

export type DebtorUpsertResult = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  expense?: ExpenseListItem;

  debts: DebtListItem[];
};

export type DebtorWriteOffResult = {
  id: string;

  debts: {
    id: string;
    paidAmount: number;
    status: DebtStatus;
    updatedAt: Date;
  }[];
  additionalIncome?: AdditionalIncomeListItem;
};
