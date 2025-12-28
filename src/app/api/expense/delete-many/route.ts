import { type NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/validate-request";
import { deleteManyExpense } from "@/modules/expense/repository";
import { deleteManySchema } from "@/schemas/common/delete-many-schema";
import { handlePrismaError } from "@/utils/error-handlers";

export async function POST(req: NextRequest) {
  try {
    const validate = validateRequest({
      bodySchema: deleteManySchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body } = data;

    const result = await deleteManyExpense(body.ids);

    return NextResponse.json(result);
  } catch (err) {
    return handlePrismaError(err);
  }
}
