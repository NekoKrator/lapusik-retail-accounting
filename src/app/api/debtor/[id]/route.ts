import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/validate-request";
import { toDeleteResult, toUpdateResult } from "@/modules/debtor/mappers";
import { deleteDebtor, updateDebtor } from "@/modules/debtor/repository";
import { DebtorUpdateSchema } from "@/schemas/debtor/debtor-schema";
import { handlePrismaError } from "@/utils/error-handlers";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const validate = validateRequest({
      bodySchema: DebtorUpdateSchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body } = data;

    const result = await updateDebtor(id, body);

    return NextResponse.json(toUpdateResult(result));
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const result = await deleteDebtor(id);

    return NextResponse.json(toDeleteResult(result));
  } catch (err) {
    return handlePrismaError(err);
  }
}
