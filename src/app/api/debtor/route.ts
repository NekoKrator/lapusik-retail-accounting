import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { validateRequest } from "@/lib/validate-request";
import { toListItem, toUpsertResult } from "@/modules/debtor/mappers";
import { findManyDebtor } from "@/modules/debtor/repository";
import {
  GetQuerySchema,
  UpsertQuerySchema,
} from "@/modules/debtor/search-params";
import { upsertDebtor } from "@/modules/debtor/service";
import { DebtorCreateSchema } from "@/schemas/debtor/debtor-schema";
import { handlePrismaError } from "@/utils/error-handlers";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    const validate = validateRequest({
      querySchema: GetQuerySchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { query } = data;

    const debtFilter = { status: query.status };

    const where = {
      userId: session?.user.role === "admin" ? query.userId : session?.user.id,
      debts: { some: debtFilter },
    };

    const result = await findManyDebtor(where);

    return NextResponse.json(result.map((i) => toListItem(i)));
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validate = validateRequest({
      bodySchema: DebtorCreateSchema,
      querySchema: UpsertQuerySchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body, query } = data;

    const result = await upsertDebtor({
      userId: session.user.id,
      name: body.name,
      amount: body.newDebtAmount,
      shiftId: query.shiftId,
    });

    return NextResponse.json(toUpsertResult(result), { status: 201 });
  } catch (err) {
    return handlePrismaError(err);
  }
}
