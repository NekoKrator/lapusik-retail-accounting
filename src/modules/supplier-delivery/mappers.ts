import type { ExpenseListDb } from "../expense/db-types";
import { toListItem as toExpenseListItem } from "../expense/mappers";

import type {
  SupplierDeliveryDeleteResult,
  SupplierDeliveryListItem,
  SupplierDeliveryUpdateResult,
  SupplierDeliveryWriteOffResult,
} from "./contracts";
import type {
  SupplierDeliveryDeleteDb,
  SupplierDeliveryListDb,
  SupplierDeliveryUpdateDb,
  SupplierDeliveryWriteOffDb,
} from "./db-types";

export function toListItem(
  db: SupplierDeliveryListDb
): SupplierDeliveryListItem {
  return {
    id: db.id,
    status: db.status,
    invoiceNumber: db.invoiceNumber ?? "",
    price: db.price,
    paidByCashier: Number(db.paidByCashier),
    paidByOwner: Number(db.paidByOwner),
    createdAt: db.createdAt,
    updatedAt: db.updatedAt,

    supplier: db.supplier,
  };
}

export function toUpdateResult(
  db: SupplierDeliveryUpdateDb
): SupplierDeliveryUpdateResult {
  return {
    id: db.id,
    status: db.status,
    paidByCashier: Number(db.paidByCashier),
    paidByOwner: Number(db.paidByOwner),
    updatedAt: db.updatedAt,
  };
}

export function toDeleteResult(
  db: SupplierDeliveryDeleteDb
): SupplierDeliveryDeleteResult {
  return {
    id: db.id,
  };
}

export function toWriteOffResult({
  updatedDelivery,
  expense,
}: {
  updatedDelivery: SupplierDeliveryWriteOffDb;
  expense?: ExpenseListDb;
}): SupplierDeliveryWriteOffResult {
  return {
    id: updatedDelivery.id,
    status: updatedDelivery.status,
    paidByCashier: Number(updatedDelivery.paidByCashier),
    paidByOwner: Number(updatedDelivery.paidByOwner),

    expense: expense ? toExpenseListItem(expense) : undefined,
  };
}
