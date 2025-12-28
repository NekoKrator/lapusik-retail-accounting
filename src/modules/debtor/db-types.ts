import type { Prisma } from "@/generated/prisma/client";
import type {
  deleteSelect,
  listInclude,
  updateSelect,
  writeOffSelect,
} from "./includes";

export type DebtorListDb = Prisma.DebtorGetPayload<{
  include: typeof listInclude;
}>;

export type DebtorUpdateDb = Prisma.DebtorGetPayload<{
  select: typeof updateSelect;
}>;

export type DebtorDeleteDb = Prisma.DebtorGetPayload<{
  select: typeof deleteSelect;
}>;

export type DebtorWriteOffDb = Prisma.DebtorGetPayload<{
  select: typeof writeOffSelect;
}>;
