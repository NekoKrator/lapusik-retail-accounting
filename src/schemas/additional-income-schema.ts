import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";

const additionalIncomeInclude = {
  debtor: true,
} satisfies Prisma.AdditionalIncomeInclude;

export type AdditionalIncomeWithDebtor = Prisma.AdditionalIncomeGetPayload<{
  include: typeof additionalIncomeInclude;
}>;

export const AdditionalIncomeCreateSchema = z.object({
  category: z
    .string("Джерело є обов'язковим")
    .trim()
    .min(1, "Джерело має містити щонайменше 1 символ")
    .max(200, "Джерело може містити максимум 200 символів"),
  amount: z.coerce
    .number<number>("Сума надходження є обов'язковою")
    .positive("Сума надходження повинна бути більше 0 ₴")
    .max(9_999_999, "👀 Звідки стільки грошей"),
}) satisfies z.ZodType<Prisma.AdditionalIncomeCreateWithoutShiftInput>;

export type AdditionalIncomeCreateInput = z.infer<
  typeof AdditionalIncomeCreateSchema
>;
