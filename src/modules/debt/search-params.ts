import z from "zod";

export const CancelQuerySchema = z.object({
  debtorId: z.string().min(1),
});

export type CancelSearchParams = z.input<typeof CancelQuerySchema>;
