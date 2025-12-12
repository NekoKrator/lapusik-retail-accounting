import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";

export const SupplierCreateSchema = z.object({
  name: z
    .string("Ім'я постачальника є обов'язковим")
    .trim()
    .min(1, "Назва має містити щонайменше 1 символ")
    .max(200, "Назва може містити максимум 200 символів"),
}) satisfies z.ZodType<Prisma.SupplierCreateInput>;

export type SupplierCreateInput = z.infer<typeof SupplierCreateSchema>;

export const SupplierUpdateSchema = z.object({
  name: z
    .string("Ім'я постачальника є обов'язковим")
    .trim()
    .min(1, "Назва має містити щонайменше 1 символ")
    .max(200, "Назва може містити максимум 200 символів"),
}) satisfies z.ZodType<Prisma.SupplierUpdateInput>;

export type SupplierUpdateInput = z.infer<typeof SupplierUpdateSchema>;

export const SupplierStats = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1),
  operationsCount: z.number().min(0).default(0),
  paidByCashier: z.number().min(0).default(0),
  paidByOwner: z.number().min(0).default(0),
  totalPaid: z.number().min(0).default(0),
  currentDebt: z.number().min(0).default(0),
});

export type SupplierStats = z.infer<typeof SupplierStats>;

const supplierInclude = {
  deliveries: {
    select: {
      paidByCashier: true,
      paidByOwner: true,
      price: true,
    },
  },
} satisfies Prisma.SupplierInclude;

export type SupplierWithDeliveries = Prisma.SupplierGetPayload<{
  include: typeof supplierInclude;
}>;
