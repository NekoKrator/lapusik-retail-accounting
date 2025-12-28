import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { toDeleteResult } from "@/modules/additional-income/mappers";
import { deleteAdditionalIncome } from "@/modules/additional-income/repository";
import { handlePrismaError } from "@/utils/error-handlers";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const result = await deleteAdditionalIncome(id);

    return NextResponse.json(toDeleteResult(result));
  } catch (err) {
    return handlePrismaError(err);
  }
}
