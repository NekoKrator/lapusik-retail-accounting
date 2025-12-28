import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  SupplierDeliveryCreateInput,
  SupplierDeliveryUpdateInput,
} from "@/schemas/supplier-delivery/supplier-delivery-schema";
import { deleteSelect, listInclude, updateSelect } from "./includes";

export function findManySupplierDelivery(
  where: Prisma.SupplierDeliveryWhereInput
) {
  return prisma.supplierDelivery.findMany({
    where,
    include: listInclude,
    orderBy: { createdAt: "desc" },
  });
}

export function createSupplierDelivery(
  userId: string,
  data: SupplierDeliveryCreateInput
) {
  return prisma.supplierDelivery.create({
    data: {
      ...data,
      status: "ACTIVE",
      user: {
        connect: {
          id: userId,
        },
      },
    },
    include: listInclude,
  });
}

export function updateSupplierDelivery(
  id: string,
  data: SupplierDeliveryUpdateInput
) {
  return prisma.supplierDelivery.update({
    where: { id },
    data,
    select: updateSelect,
  });
}

export function deleteSupplierDelivery(id: string) {
  return prisma.supplierDelivery.delete({
    where: { id },
    select: deleteSelect,
  });
}

export function deleteManySupplierDelivery(ids: string[]) {
  return prisma.supplierDelivery.deleteMany({
    where: { id: { in: ids } },
  });
}
