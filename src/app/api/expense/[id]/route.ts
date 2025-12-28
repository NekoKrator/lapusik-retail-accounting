import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { toDeleteResult } from "@/modules/expense/mappers";
import { deleteExpense } from "@/modules/expense/repository";
import { handlePrismaError } from "@/utils/error-handlers";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const deletedExpense = await deleteExpense(id);

    return NextResponse.json(toDeleteResult(deletedExpense));
  } catch (err) {
    return handlePrismaError(err);
  }
}
