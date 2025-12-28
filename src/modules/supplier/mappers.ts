import type { SupplierListItem, SupplierUpdateResult } from "./contracts";
import type { SupplierListDb, SupplierUpdateDb } from "./db-types";

export function toListItem(db: SupplierListDb): SupplierListItem {
  return {
    id: db.id,
    name: db.name,
  };
}

export function toUpdateResult(db: SupplierUpdateDb): SupplierUpdateResult {
  return {
    id: db.id,
    name: db.name,
    updatedAt: db.updatedAt,
  };
}
