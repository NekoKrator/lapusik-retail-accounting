import z from "zod";

export const deleteManySchema = z.object({
  ids: z.array(z.string()),
});

export type DeleteManyInput = z.infer<typeof deleteManySchema>;
