import z from "zod";

export const GetQuerySchema = z.object({
  shiftId: z.string().min(1).optional(),
});

export type GetSearchParams = z.input<typeof GetQuerySchema>;

export const CreateQuerySchema = z.object({
  shiftId: z.string().min(1, "shiftId обов'язковий"),
});

export type CreateSearchParams = z.input<typeof CreateQuerySchema>;
