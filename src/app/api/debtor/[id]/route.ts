import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/validate-request";
import { DebtorUpdateSchema } from "@/schemas/debtor-schema";
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

    const updatedDebtor = await prisma.debtor.update({
      where: { id },
      data: body,
      include: { debts: true },
    });

    return NextResponse.json(updatedDebtor);
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

    const deletedDebtor = await prisma.debtor.delete({
      where: { id },
    });

    return NextResponse.json(deletedDebtor);
  } catch (err) {
    return handlePrismaError(err);
  }
}
