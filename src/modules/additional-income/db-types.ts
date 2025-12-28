import type { Prisma } from "@/generated/prisma/client";
import type { deleteSelect, listInclude } from "./includes";

export type AdditionalIncomeListDb = Prisma.AdditionalIncomeGetPayload<{
  include: typeof listInclude;
}>;

export type AdditionalIncomeDeleteDb = Prisma.AdditionalIncomeGetPayload<{
  select: typeof deleteSelect;
}>;
