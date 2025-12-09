import { z } from "zod";
import type { ExpenseCategory, Prisma } from "@/generated/prisma/client";

const expenseInclude = {
  debtor: true,
  supplierDelivery: { include: { supplier: { select: { name: true } } } },
} satisfies Prisma.ExpenseInclude;

export type ExpenseWithInclude = Prisma.ExpenseGetPayload<{
  include: typeof expenseInclude;
}>;

export const ExpenseCreateSchema = z.object({
  category: z.string<ExpenseCategory>("Категорія є обов'язковою"),
  amount: z.coerce
    .number<number>("Сума витрат є обов'язковою")
    .positive("Сума витрати повинна бути більше 0 ₴")
    .max(9_999_999, "Сума витрати може бути максимум 9 999 999 ₴"),
}) satisfies z.ZodType<Prisma.ExpenseCreateWithoutShiftInput>;

export type ExpenseCreateInput = z.infer<typeof ExpenseCreateSchema>;
