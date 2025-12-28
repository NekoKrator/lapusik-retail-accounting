import z from "zod";

export const GetQuerySchema = z.object({
  userId: z.string().min(1).optional(),
  status: z.enum(["ACTIVE", "PAID", "CANCELED"]).optional(),
});

export type GetSearchParams = z.input<typeof GetQuerySchema>;

export const UpsertQuerySchema = z.object({
  shiftId: z.string().min(1).optional(),
});

export type UpsertSearchParams = z.input<typeof UpsertQuerySchema>;

export const WriteOffQuerySchema = z.object({
  shiftId: z.string().min(1).optional(),
});

export type WriteOffSearchParams = z.input<typeof WriteOffQuerySchema>;
