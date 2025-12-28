import { z } from "zod";

const operatorsSchema = z.enum(["eq", "gte", "gt", "lt", "lte"]);

export const filterSchema = (allowedKeys: string[]) =>
  z.object({
    key: z.enum(allowedKeys),
    value: z.union([z.number(), z.string(), z.boolean()]),
    operator: operatorsSchema.optional().default("eq"),
  });

export type Filter = {
  key: string;
  value: number | string | boolean;
  operator: string;
};

export const NumberFilterOperators = z.union([
  z.coerce.number(),
  z.object({
    gt: z.coerce.number().optional(),
    gte: z.coerce.number().optional(),
    lt: z.coerce.number().optional(),
    lte: z.coerce.number().optional(),
  }),
]);

export const DateFilterOperators = z.union([
  z.coerce.date(),
  z.object({
    gt: z.coerce.date().optional(),
    gte: z.coerce.date().optional(),
    lt: z.coerce.date().optional(),
    lte: z.coerce.date().optional(),
  }),
]);

export const BooleanSchema = z.union([
  z.boolean(),
  z.enum(["true", "false"]).transform((v) => v === "true"),
]);
