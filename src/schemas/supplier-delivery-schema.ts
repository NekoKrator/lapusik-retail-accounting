import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";

const supplierDeliveryIncludeSupplier = {
  supplier: true,
} satisfies Prisma.SupplierDeliveryInclude;

export type SupplierDeliveryWithSupplier = Prisma.SupplierDeliveryGetPayload<{
  include: typeof supplierDeliveryIncludeSupplier;
}>;

const supplierDeliveryIncludeSupplierAndExpenses = {
  supplier: true,
  expenses: true,
} satisfies Prisma.SupplierDeliveryInclude;

export type SupplierDeliveryWithSupplierAndExpenses =
  Prisma.SupplierDeliveryGetPayload<{
    include: typeof supplierDeliveryIncludeSupplierAndExpenses;
  }>;

export const SupplierDeliveryCreateSchema = z.object({
  price: z.coerce
    .number<number>("Ціна поставки є обов'язковою")
    .positive("Ціна поставки повинна бути більше 0 ₴")
    .max(9_999_999, "Ціна поставки може бути максимум 9 999 999 ₴"),
  supplier: z.object(
    {
      connect: z.object({
        id: z.uuid(),
      }),
    },
    "Постачальник є обов'язковим"
  ),
}) satisfies z.ZodType<Prisma.SupplierDeliveryCreateWithoutUserInput>;

export type SupplierDeliveryCreateInput = z.input<
  typeof SupplierDeliveryCreateSchema
>;

export const SupplierDeliveryUpdateSchema = z.object({
  paidByCashier: z.coerce
    .number<number>("Сума сплати касиром повинна бути числом")
    .min(0, "Сума сплати касиром повинна бути щонайменше 0 ₴")
    .max(9_999_999, "Сума сплати касиром може бути максимум 9 999 999 ₴")
    .optional(),
  paidByOwner: z.coerce
    .number<number>("Сума сплати власником повинна бути числом")
    .min(0, "Сума сплати власником повинна бути щонайменше 0 ₴")
    .max(9_999_999, "Сума сплати власником може бути максимум 9 999 999 ₴")
    .optional(),
  isPaidOff: z.boolean().optional(),
}) satisfies z.ZodType<Prisma.SupplierDeliveryUpdateInput>;

export type SupplierDeliveryUpdateInput = z.input<
  typeof SupplierDeliveryUpdateSchema
>;

export const SupplierDeliveryWriteOffSchema = (maxAllowedAmount: number) =>
  z
    .object({
      paidByCashier: z.coerce
        .number<number>("Сума сплати касиром повинна бути числом")
        .min(0, "Сума сплати касиром повинна щонайменше більше 0 ₴")
        .max(9_999_999, "Сума сплати касиром може бути максимум 9 999 999 ₴")
        .optional(),
      paidByOwner: z.coerce
        .number<number>("Сума сплати власником повинна бути числом")
        .min(0, "Сума сплати власником повинна щонайменше більше 0 ₴")
        .max(9_999_999, "Сума сплати власником може бути максимум 9 999 999 ₴")
        .optional(),
    })
    .refine(
      (data) => (data.paidByCashier ?? 0) > 0 || (data.paidByOwner ?? 0) > 0,
      {
        message: "Потрібно вказати суму хоча б в одному полі",
        path: ["paidByCashier"],
      }
    )
    .refine(
      (data) =>
        (data.paidByCashier ?? 0) + (data.paidByOwner ?? 0) <= maxAllowedAmount,
      {
        message: "Сума сплати перевищує наявний борг",
        path: ["paidByCashier"],
      }
    )
    .transform((data) => ({
      paidByCashier: data.paidByCashier ?? 0,
      paidByOwner: data.paidByOwner ?? 0,
    })) satisfies z.ZodType<Prisma.SupplierDeliveryUpdateInput>;

export type SupplierDeliveryWriteOffInput = z.input<
  ReturnType<typeof SupplierDeliveryWriteOffSchema>
>;
