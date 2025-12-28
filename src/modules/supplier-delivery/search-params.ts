import z from "zod";
import { DebtStatus } from "@/generated/prisma/enums";

export const GetQuerySchema = z.object({
  status: z.enum(DebtStatus).optional(),
});

export type GetSearchParam = z.infer<typeof GetQuerySchema>;

export const WriteOffQuerySchema = z.object({
  shiftId: z.string().min(1).optional(),
});

export type WriteOffSearchParam = z.infer<typeof WriteOffQuerySchema>;
