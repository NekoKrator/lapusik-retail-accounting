import { z } from "zod";
import type { Prisma, Shift } from "@/generated/prisma/client";

export type ShiftStats = Omit<Shift, "userId"> & {
  displayUsername: string;
  shiftDuration: number;
};

export const ShiftOpenSchema = z.object({
  openingBalance: z.coerce
    .number<number>("Ранковий залишок є обов'язковим")
    .min(0, "Ранковий залишок повинен бути щонайменше 0 ₴"),
}) satisfies z.ZodType<Prisma.ShiftCreateWithoutUserInput>;

export type ShiftOpenInput = z.input<typeof ShiftOpenSchema>;

export const ShiftCloseSchema = z.object({
  actualClosingBalance: z.coerce.number<number>(
    "Розрахунковий залишок є обов'язковим"
  ),
  expectedClosingBalance: z.coerce.number<number>(
    "Фактичний залишок є обов'язковим"
  ),
  totalAdditionalIncome: z.coerce
    .number<number>("Сума додаткових надходжень є обов'язковим")
    .min(0, "Сума додаткових надходжень повинна бути щонайменше 0 ₴"),
  totalCashRegister: z.coerce
    .number<number>("Виторг є обов'язковим")
    .min(0, "Виторг повинен бути щонайменше 0 ₴"),
  terminalRegister: z.coerce
    .number<number>("Термінал є обов'язковим")
    .min(0, "Термінал повинен бути щонайменше 0 ₴"),
  totalExpenses: z.coerce
    .number<number>("Сума витрат є обов'язковим")
    .min(0, "Сума витрат повинна бути щонайменше 0 ₴"),
}) satisfies z.ZodType<Prisma.ShiftUpdateInput>;

export type ShiftCloseInput = z.input<typeof ShiftCloseSchema>;
