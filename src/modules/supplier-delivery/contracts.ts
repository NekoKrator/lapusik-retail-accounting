import type { DebtStatus } from "@/generated/prisma/enums";
import type { ExpenseListItem } from "../expense/contracts";

export type SupplierDeliveryListItem = {
  id: string;
  status: DebtStatus;
  invoiceNumber: string;
  price: number;
  paidByCashier: number;
  paidByOwner: number;
  createdAt: Date;
  updatedAt: Date;

  supplier: {
    id: string;
    name: string;
  };
};

export type SupplierDeliveryUpdateResult = {
  id: string;
  status?: DebtStatus;
  paidByCashier?: number;
  paidByOwner?: number;
  updatedAt?: Date;
};

export type SupplierDeliveryDeleteResult = {
  id: string;
};

export type SupplierDeliveryWriteOffResult = {
  id: string;
  status: DebtStatus;
  paidByCashier: number;
  paidByOwner: number;

  expense?: ExpenseListItem;
};
