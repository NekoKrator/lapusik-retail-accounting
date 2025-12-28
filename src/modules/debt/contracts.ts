import type { DebtStatus } from "@/generated/prisma/enums";

export type DebtListItem = {
  id: string;
  amount: number;
  paidAmount: number;
  status: DebtStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type DebtUpdateResult = {
  id: string;
  status?: DebtStatus;
  updatedAt?: Date;
};

export type DebtCancelResult = {
  id: string;
};
