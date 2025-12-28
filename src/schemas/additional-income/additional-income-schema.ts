import { z } from "zod";
import type { AdditionalIncome, Prisma } from "@/generated/prisma/client";

export type AdditionalIncomeStats = Omit<
  AdditionalIncome,
  "updatedAt" | "shiftId" | "debtorId"
> & {
  displayUsername: string;
};

export const AdditionalIncomeCreateSchema = z.object({
  category: z
    .string("Джерело є обов'язковим")
    .trim()
    .max(200, "Джерело може містити максимум 200 символів")
    .optional()
    .transform((val) =>
      val != null && val.length > 0 ? val : "Додаткове надходження"
    ),
  amount: z.coerce
    .number<number>("Сума надходження є обов'язковою")
    .positive("Сума надходження повинна бути більше 0 ₴")
    .max(9_999_999, "👀 Звідки стільки грошей"),
}) satisfies z.ZodType<Prisma.AdditionalIncomeCreateWithoutShiftInput>;

export type AdditionalIncomeCreateInput = z.input<
  typeof AdditionalIncomeCreateSchema
>;

export type AdditionalIncomeCreateInfer = z.infer<
  typeof AdditionalIncomeCreateSchema
>;
