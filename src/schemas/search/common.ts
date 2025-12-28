import { z } from "zod";

export const OrderEnum = z.enum(["asc", "desc"]);

export const PaginationSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});
