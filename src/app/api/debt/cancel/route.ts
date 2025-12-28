import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/validate-request";
import { toCancelResult } from "@/modules/debt/mappers";
import { CancelQuerySchema } from "@/modules/debt/search-params";
import { cancelDebts } from "@/modules/debt/service";
import { handlePrismaError } from "@/utils/error-handlers";

export async function PATCH(req: NextRequest) {
  try {
    const validate = validateRequest({
      querySchema: CancelQuerySchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { query } = data;

    const result = await cancelDebts({
      debtorId: query.debtorId,
    });

    return NextResponse.json(result.map((item) => toCancelResult(item)));
  } catch (err) {
    return handlePrismaError(err);
  }
}
