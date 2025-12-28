import { z } from "zod";
import type { Prisma, SupplierDelivery } from "@/generated/prisma/client";

export type SupplierDeliveryStats = Omit<
  SupplierDelivery,
  "userId" | "supplierId"
> & {
  displayUsername: string;
  supplierName: string;
  debt: number;
};

export const SupplierDeliveryCreateSchema = z.object({
  supplier: z.object(
    {
      connect: z.object({
        id: z.uuid(),
      }),
    },
    "Постачальник є обов'язковим"
  ),
  invoiceNumber: z
    .string()
    .trim()
    .max(100, "Номер накладної може містити максимум 100 символів"),
  price: z.coerce
    .number<number>("Ціна поставки є обов'язковою")
    .positive("Ціна поставки повинна бути більше 0 ₴")
    .max(9_999_999, "Ціна поставки може бути максимум 9 999 999 ₴"),
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
  status: z.enum(["ACTIVE", "PAID", "CANCELED"]).optional(),
}) satisfies z.ZodType<Prisma.SupplierDeliveryUpdateInput>;

export type SupplierDeliveryUpdateInput = z.input<
  typeof SupplierDeliveryUpdateSchema
>;

export const SupplierDeliveryWriteOffSchema = (maxAllowedAmount?: number) =>
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
        maxAllowedAmount === undefined
          ? true
          : (data.paidByCashier ?? 0) + (data.paidByOwner ?? 0) <=
            maxAllowedAmount,
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
