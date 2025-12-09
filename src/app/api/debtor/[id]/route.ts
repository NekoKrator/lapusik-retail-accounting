import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { DebtorUpdateSchema } from "@/schemas/debtor-schema";
import { handlePrismaError } from "@/utils/error-handlers";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAuth();
  if (error) {
    return error;
  }

  try {
    const body = await req.json();
    const parsed = DebtorUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: z.flattenError(parsed.error) },
        { status: 400 }
      );
    }

    const { id } = await context.params;

    const updatedDebtor = await prisma.debtor.update({
      where: { id },
      data: parsed.data,
      include: { expenses: true },
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
  const { error } = await requireAuth();
  if (error) {
    return error;
  }

  try {
    const { id } = await context.params;

    const deletedDebtor = await prisma.debtor.delete({
      where: { id },
      include: { expenses: true },
    });

    return NextResponse.json(deletedDebtor);
  } catch (err) {
    return handlePrismaError(err);
  }
}
