import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handlePrismaError } from "@/utils/error-handlers";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const deletedAdditionalIncome = await prisma.additionalIncome.delete({
      where: { id },
    });

    return NextResponse.json(deletedAdditionalIncome);
  } catch (err) {
    return handlePrismaError(err);
  }
}
