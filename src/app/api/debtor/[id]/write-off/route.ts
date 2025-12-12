import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod";
import type { Debt, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/validate-request";
import { DebtorWriteOffSchema } from "@/schemas/debtor-schema";
import { handlePrismaError } from "@/utils/error-handlers";

const PostQuerySchema = z.object({
  shiftId: z.string().min(1).optional(),
});

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const validate = validateRequest({
      bodySchema: DebtorWriteOffSchema,
      querySchema: PostQuerySchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body, query } = data;

    const debtor = await prisma.debtor.findUnique({
      where: { id },
      include: {
        debts: {
          where: { status: "ACTIVE", amount: { gt: 0 } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!debtor) {
      return NextResponse.json(
        { error: "Боржника не знайдено" },
        { status: 404 }
      );
    }

    const writeOffAmount = body.writeOffAmount;

    const currentDebt = debtor.debts.reduce(
      (s, d) => s + d.amount - d.paidAmount,
      0
    );

    if (writeOffAmount > currentDebt) {
      return NextResponse.json(
        { error: "Сума списання перевищує наявний борг" },
        { status: 400 }
      );
    }

    let remaining = writeOffAmount;
    const writeOffActions = debtor.debts
      .map((d) => {
        if (remaining <= 0) {
          return null;
        }

        const availableToPay = d.amount - d.paidAmount;
        if (availableToPay <= 0) {
          return null;
        }

        const toApply = Math.min(remaining, availableToPay);
        const newPaidAmount = d.paidAmount + toApply;
        remaining -= toApply;

        return prisma.debt.update({
          where: { id: d.id },
          data: {
            paidAmount: newPaidAmount,
            status: newPaidAmount === d.amount ? "PAID" : "ACTIVE",
          },
        });
      })
      .filter(Boolean) as Prisma.PrismaPromise<Debt>[];

    await prisma.$transaction(writeOffActions);

    const wroteOffDebtor = await prisma.debtor.update({
      where: { id },
      data: {
        additionalIncome: query.shiftId
          ? {
              create: {
                category: "Повернення боргу",
                amount: writeOffAmount,
                shift: {
                  connect: {
                    id: query.shiftId,
                  },
                },
              },
            }
          : undefined,
      },
      include: {
        additionalIncome: {
          where: { shiftId: query.shiftId },
          include: { debtor: true },
        },
        debts: { where: { status: "ACTIVE" } },
      },
    });

    return NextResponse.json(wroteOffDebtor);
  } catch (err) {
    return handlePrismaError(err);
  }
}
