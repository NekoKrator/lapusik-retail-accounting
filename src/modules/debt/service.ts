import { prisma } from "@/lib/prisma";
import { cancelSelect } from "./includes";

export function cancelDebts({ debtorId }: { debtorId: string }) {
  return prisma.debt.updateManyAndReturn({
    where: { debtorId, status: "ACTIVE" },
    data: { status: "CANCELED" },
    select: cancelSelect,
  });
}
