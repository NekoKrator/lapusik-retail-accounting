import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/validate-request";
import { toListItem } from "@/modules/expense/mappers";
import { createExpense, findManyExpense } from "@/modules/expense/repository";
import {
  CreateQuerySchema,
  GetQuerySchema,
} from "@/modules/expense/search-params";
import { ExpenseCreateSchema } from "@/schemas/expense/expense-schema";
import { handlePrismaError } from "@/utils/error-handlers";

export async function GET(req: NextRequest) {
  try {
    const validate = validateRequest({
      querySchema: GetQuerySchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { query } = data;

    const where = { shiftId: query.shiftId };

    const result = await findManyExpense(where);

    return NextResponse.json(result.map((i) => toListItem(i)));
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const validate = validateRequest({
      bodySchema: ExpenseCreateSchema,
      querySchema: CreateQuerySchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body, query } = data;

    const createdExpense = await createExpense(query.shiftId, body);

    return NextResponse.json(toListItem(createdExpense));
  } catch (err) {
    return handlePrismaError(err);
  }
}
