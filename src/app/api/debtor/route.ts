import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod";
import type { ExpenseCategory } from "@/generated/prisma/enums";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { DebtorCreateSchema } from "@/schemas/debtor-schema";
import { handlePrismaError } from "@/utils/error-handlers";

type GetDebtorsWhere = {
  userId: string;
  isPaidOff?: boolean;
};

export async function GET(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) {
    return error;
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const isPaidOff = searchParams.get("isPaidOff");

    const where: GetDebtorsWhere = { userId: session.user.id };

    if (isPaidOff) {
      where.isPaidOff = isPaidOff.toLowerCase() === "true";
    }

    const debtors = await prisma.debtor.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(debtors);
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) {
    return error;
  }

  try {
    const body = await req.json();
    const parsed = DebtorCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: z.flattenError(parsed.error) },
        { status: 400 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const shiftId = searchParams.get("shiftId");
    const { name, debt } = parsed.data;

    const newExpenseCreate = shiftId
      ? {
          create: {
            category: "DEBTOR" as ExpenseCategory,
            amount: debt,
            shift: {
              connect: {
                id: shiftId,
              },
            },
          },
        }
      : undefined;

    const existing = await prisma.debtor.findUnique({
      where: { name },
    });

    const createdDebtor = await prisma.debtor.upsert({
      where: {
        name,
      },
      update: {
        debt: { increment: debt },
        isPaidOff: false,
        createdAt: new Date(),
        expenses: newExpenseCreate,
      },
      create: {
        ...parsed.data,
        isPaidOff: false,
        expenses: newExpenseCreate,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
      include: { expenses: { include: { debtor: true } } },
    });

    const status = existing ? 200 : 201;

    return NextResponse.json(createdDebtor, { status });
  } catch (err) {
    return handlePrismaError(err);
  }
}
