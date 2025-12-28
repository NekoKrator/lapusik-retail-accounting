import { z } from "zod";
import type { Prisma, Supplier } from "@/generated/prisma/client";

export type SupplierStats = Omit<Supplier, "createdAt" | "updatedAt"> & {
  totalCurrentDebt: number;
  totalPaidByCashier: number;
  totalPaidByOwner: number;
  totalPaid: number;
  activeDeliveriesCount: number;
  paidDeliveriesCount: number;
  canceledDeliveriesCount: number;
  totalDeliveriesCount: number;
};

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
