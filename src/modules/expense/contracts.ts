import type { ExpenseCategory } from "@/generated/prisma/enums";

export type ExpenseListItem = {
  id: string;
  category: ExpenseCategory;
  amount: number;
  createdAt: Date;
  updatedAt: Date;

  debtor: { id: string; name: string } | null;
  supplierDelivery: {
    supplier: {
      id: string;
      name: string;
    };
  } | null;
};

export type ExpenseDeleteResult = {
  id: string;
};
