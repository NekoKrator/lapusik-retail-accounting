import type { Prisma } from "@/generated/prisma/client";
import type { currentShiftSelect, lastClosedShiftSelect } from "./includes";

export type ShiftCurrentDb = Prisma.ShiftGetPayload<{
  select: typeof currentShiftSelect;
}>;

export type ShiftLastClosedDb = Prisma.ShiftGetPayload<{
  select: typeof lastClosedShiftSelect;
}>;
