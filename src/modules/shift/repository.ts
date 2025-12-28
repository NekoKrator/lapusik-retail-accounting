import { prisma } from "@/lib/prisma";

export function deleteManyShift(ids: string[]) {
  return prisma.shift.deleteMany({
    where: { id: { in: ids } },
  });
}
