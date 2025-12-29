import { z } from "zod";
import type { Debtor, Prisma } from "@/generated/prisma/client";

export type DebtorStats = Omit<Debtor, "createdAt" | "updatedAt" | "userId"> & {
  totalCurrentDebt: number;
  totalDebt: number;
  totalPaid: number;
  activeDebtsCount: number;
  paidDebtsCount: number;
  canceledDebtsCount: number;
  totalDebtsCount: number;

  displayUsername: string;
};

export const DebtorCreateSchema = z.object({
  name: z
    .string("Ім'я боржника є обов'язковим")
    .trim()
    .min(1, "Ім'я має містити щонайменше 1 символ")
    .max(
      113,
      "Найдовше ім'я в Україні виглядає так: Бронівогневладислав-Едуардолеонардоконстантинослав Володимиренклименжільєнко-Громинревинградинтеменко Миколайович"
    ),
  newDebtAmount: z.coerce
    .number<number>("Сума боргу є обов'язковою")
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
  debts: z
    .object({
      updateMany: z
        .object({
          where: z.object({
            status: z.enum(["ACTIVE", "PAID", "CANCELED"]).optional(),
          }),
          data: z.object({
            status: z.enum(["ACTIVE", "PAID", "CANCELED"]).optional(),
          }),
        })
        .optional(),
    })
    .optional(),
}) satisfies z.ZodType<Prisma.DebtorUpdateInput>;

export type DebtorUpdateInput = z.infer<typeof DebtorUpdateSchema>;

export const DebtorWriteOffSchema = z.object({
  writeOffAmount: z.coerce
    .number<number>("Сума списання є обов'язковою")
    .positive("Сума списання повинна бути більше 0 ₴")
    .max(9_999_999, "Сума списання може бути максимум 9 999 999 ₴"),
});

export type DebtorWriteOffInput = z.infer<typeof DebtorWriteOffSchema>;
