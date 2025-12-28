import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/validate-request";
import { toWriteOffResult } from "@/modules/debtor/mappers";
import { WriteOffQuerySchema } from "@/modules/debtor/search-params";
import { writeOffDebtorDebt } from "@/modules/debtor/service";
import { DebtorWriteOffSchema } from "@/schemas/debtor/debtor-schema";
import { handlePrismaError } from "@/utils/error-handlers";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const validate = validateRequest({
      bodySchema: DebtorWriteOffSchema,
      querySchema: WriteOffQuerySchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body, query } = data;

    const wroteOffDebtor = await writeOffDebtorDebt({
      debtorId: id,
      writeOffAmount: body.writeOffAmount,
      shiftId: query.shiftId,
    });

    return NextResponse.json(toWriteOffResult(wroteOffDebtor));
  } catch (err) {
    return handlePrismaError(err);
  }
}
