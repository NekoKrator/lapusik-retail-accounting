import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { DebtorWriteOffSchema } from "@/schemas/debtor-schema";
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
    const { id } = await context.params;
    const debtor = await prisma.debtor.findUnique({
      where: { id },
    });

    if (!debtor) {
      return NextResponse.json(
        { error: "Боржника не знайдено" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const parsed = DebtorWriteOffSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: z.flattenError(parsed.error) },
        { status: 400 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const shiftId = searchParams.get("shiftId");
    const { debt, paid: currentPaid } = debtor;
    const { paid } = parsed.data;

    const currentDebt = debt - currentPaid;

    if (paid > currentDebt) {
      return NextResponse.json(
        { error: "Сума списання перевищує наявний борг" },
        { status: 400 }
      );
    }

    const isPaidOff = currentDebt - paid === 0;

    const newAdditionalIncomeCreate = shiftId
      ? {
          create: {
            category: "Повернення боргу",
            amount: paid,
            shift: {
              connect: {
                id: shiftId,
              },
            },
          },
        }
      : undefined;

    const updateDebtorData = isPaidOff
      ? { paid: 0, debt: 0, isPaidOff }
      : { paid: { increment: paid } };

    const wroteOffDebtor = await prisma.debtor.update({
      where: { id },
      data: {
        ...updateDebtorData,
        additionalIncome: newAdditionalIncomeCreate,
      },
      include: { additionalIncome: { include: { debtor: true } } },
    });

    return NextResponse.json(wroteOffDebtor);
  } catch (err) {
    return handlePrismaError(err);
  }
}
