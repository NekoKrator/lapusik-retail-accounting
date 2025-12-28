import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { AdditionalIncomeCreateInfer } from "@/schemas/additional-income/additional-income-schema";
import { deleteSelect, listInclude } from "./includes";

export function findManyAdditionalIncome(
  where: Prisma.AdditionalIncomeWhereInput
) {
  return prisma.additionalIncome.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: listInclude,
  });
}

export function createAdditionalIncome(
  shiftId: string,
  data: AdditionalIncomeCreateInfer
) {
  return prisma.additionalIncome.create({
    data: {
      shift: {
        connect: {
          id: shiftId,
        },
      },
      ...data,
    },
    include: listInclude,
  });
}

export function deleteAdditionalIncome(id: string) {
  return prisma.additionalIncome.delete({
    where: { id },
    select: deleteSelect,
  });
}

export function deleteManyAdditionalIncome(ids: string[]) {
  return prisma.additionalIncome.deleteMany({
    where: { id: { in: ids } },
  });
}
