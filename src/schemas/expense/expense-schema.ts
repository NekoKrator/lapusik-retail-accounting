import { z } from "zod";
import type {
  Expense,
  ExpenseCategory,
  Prisma,
} from "@/generated/prisma/client";

export type ExpenseStats = Omit<
  Expense,
  "updatedAt" | "shiftId" | "debtorId" | "supplierDeliveryId"
> & {
  displayUsername: string;
};

export const ExpenseCreateSchema = z.object({
  category: z.string<ExpenseCategory>("Категорія є обов'язковою"),
  amount: z.coerce
    .number<number>("Сума витрат є обов'язковою")
    .positive("Сума витрати повинна бути більше 0 ₴")
    .max(9_999_999, "Сума витрати може бути максимум 9 999 999 ₴"),
}) satisfies z.ZodType<Prisma.ExpenseCreateWithoutShiftInput>;

export type ExpenseCreateInput = z.infer<typeof ExpenseCreateSchema>;
