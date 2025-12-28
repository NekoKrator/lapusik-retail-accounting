import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { DebtorUpdateInput } from "@/schemas/debtor/debtor-schema";
import { deleteSelect, listInclude, updateSelect } from "./includes";

export function findManyDebtor(where: Prisma.DebtorWhereInput) {
  return prisma.debtor.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: listInclude,
  });
}

export function updateDebtor(id: string, data: DebtorUpdateInput) {
  return prisma.debtor.update({
    where: { id },
    data,
    select: updateSelect,
  });
}

export function deleteDebtor(id: string) {
  return prisma.debtor.delete({
    where: { id },
    select: deleteSelect,
  });
}

export function deleteManyDebtor(ids: string[]) {
  return prisma.debtor.deleteMany({
    where: { id: { in: ids } },
  });
}
