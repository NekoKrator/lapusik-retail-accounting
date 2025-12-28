import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/validate-request";
import { toListItem } from "@/modules/additional-income/mappers";
import {
  createAdditionalIncome,
  findManyAdditionalIncome,
} from "@/modules/additional-income/repository";
import {
  CreateQuerySchema,
  GetQuerySchema,
} from "@/modules/additional-income/search-params";
import { AdditionalIncomeCreateSchema } from "@/schemas/additional-income/additional-income-schema";
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

    const result = await findManyAdditionalIncome(where);

    return NextResponse.json(result.map((i) => toListItem(i)));
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const validate = validateRequest({
      bodySchema: AdditionalIncomeCreateSchema,
      querySchema: CreateQuerySchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body, query } = data;

    const result = await createAdditionalIncome(query.shiftId, body);

    return NextResponse.json(toListItem(result));
  } catch (err) {
    return handlePrismaError(err);
  }
}
