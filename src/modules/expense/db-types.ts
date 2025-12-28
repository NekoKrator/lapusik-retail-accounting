import type { Prisma } from "@/generated/prisma/client";
import type { deleteSelect, listInclude } from "./includes";

export type ExpenseListDb = Prisma.ExpenseGetPayload<{
  include: typeof listInclude;
}>;

export type ExpenseDeleteDb = Prisma.ExpenseGetPayload<{
  select: typeof deleteSelect;
}>;
