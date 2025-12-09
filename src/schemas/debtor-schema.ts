import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";

const debtorExpenseInclude = {
  expenses: true,
} satisfies Prisma.DebtorInclude;

const debtorAdditionalIncomeInclude = {
  additionalIncome: true,
} satisfies Prisma.DebtorInclude;

export type DebtorWithExpenses = Prisma.DebtorGetPayload<{
  include: typeof debtorExpenseInclude;
}>;

export type DebtorWithAdditionalIncome = Prisma.DebtorGetPayload<{
  include: typeof debtorAdditionalIncomeInclude;
}>;

export const DebtorCreateSchema = z.object({
  name: z
    .string("Ім'я боржника є обов'язковим")
    .trim()
    .min(1, "Ім'я має містити щонайменше 1 символ")
    .max(
      113,
      "Найдовше ім'я в Україні виглядає так: Бронівогневладислав-Едуардолеонардоконстантинослав Володимиренклименжільєнко-Громинревинградинтеменко Миколайович"
    ),
  debt: z.coerce
    .number<number>("Введіть суму боргу")
    .positive("Сума боргу повинна бути більше 0 ₴")
    .max(9_999_999, "Сума боргу може бути максимум 9 999 999 ₴"),
}) satisfies z.ZodType<Prisma.DebtorCreateWithoutUserInput>;

export type DebtorCreateInput = z.input<typeof DebtorCreateSchema>;

export const DebtorUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Ім'я має містити щонайменше 1 символ")
    .max(113, "Ім'я може містити максимум 113 символів")
    .optional(),
  paid: z
    .number()
    .min(0, "Нова сума сплати повинна бути щонайменше 0 ₴")
    .max(9_999_999, "Нова сума сплати може бути максимум 9 999 999 ₴")
    .optional(),
  debt: z
    .number()
    .min(0, "Нова сума боргу повинна бути щонайменше 0 ₴")
    .max(9_999_999, "Нова сума боргу може бути максимум 9 999 999 ₴")
    .optional(),
  isPaidOff: z.boolean().optional(),
}) satisfies z.ZodType<Prisma.DebtorUpdateInput>;

export type DebtorUpdateInput = z.infer<typeof DebtorUpdateSchema>;

export const DebtorWriteOffSchema = z.object({
  paid: z.coerce
    .number<number>("Сума списання є обов'язковою")
    .positive("Сума списання повинна бути більше 0 ₴")
    .max(9_999_999, "Сума списання може бути максимум 9 999 999 ₴"),
}) satisfies z.ZodType<Prisma.DebtorUpdateInput>;

export type DebtorWriteOffInput = z.input<typeof DebtorWriteOffSchema>;
