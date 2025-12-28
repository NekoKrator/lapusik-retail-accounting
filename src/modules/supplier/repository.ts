import { prisma } from "@/lib/prisma";
import type {
  SupplierCreateInput,
  SupplierUpdateInput,
} from "@/schemas/supplier/supplier-schema";
import { listSelect, updateSelect } from "./includes";

export function findManySupplier() {
  return prisma.supplier.findMany({
    select: listSelect,
  });
}

export function createSupplier(data: SupplierCreateInput) {
  return prisma.supplier.create({
    data,
    select: listSelect,
  });
}

export function updateSupplier(id: string, data: SupplierUpdateInput) {
  return prisma.supplier.update({
    where: { id },
    data,
    select: updateSelect,
  });
}

export function deleteManySupplier(ids: string[]) {
  return prisma.supplier.deleteMany({
    where: { id: { in: ids } },
  });
}
