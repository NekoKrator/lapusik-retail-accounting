import type { Prisma } from "@/generated/prisma/client";
import type { cancelSelect, writeOffSelect } from "./includes";

export type DebtWriteOffDb = Prisma.DebtGetPayload<{
  select: typeof writeOffSelect;
}>;

export type DebtCancelDb = Prisma.DebtGetPayload<{
  select: typeof cancelSelect;
}>;
