import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { handlePrismaError } from "@/utils/error-handlers";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) {
    return error;
  }

  try {
    const { id } = await context.params;
    const deletedExpense = await prisma.expense.delete({
      where: { id },
    });

    return NextResponse.json(deletedExpense);
  } catch (err) {
    return handlePrismaError(err);
  }
}
