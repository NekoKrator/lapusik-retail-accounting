import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod";
import type { DebtStatus, ExpenseCategory } from "@/generated/prisma/enums";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/validate-request";
import { DebtorCreateSchema } from "@/schemas/debtor-schema";
import { handlePrismaError } from "@/utils/error-handlers";

const GetQuerySchema = z.object({
  userId: z.string().min(1).optional(),
  status: z.enum(["ACTIVE", "PAID", "CANCELED"]).optional(),
  page: z.string().min(1).optional(),
  limit: z.string().min(1).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    const validate = validateRequest({
      querySchema: GetQuerySchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { query } = data;

    const debtFilter = { status: query.status };

    const where = {
      userId: session?.user.role === "admin" ? query.userId : session?.user.id,
      debts: { some: debtFilter },
    };

    if (query.page && query.limit) {
      const page = Number(query.page);
      const limit = Number(query.limit);

      const result = await prisma.debtor.paginate({
        page,
        limit,
        where,
        orderBy: { createdAt: "desc" },
        include: {
          debts: { where: debtFilter },
        },
      });

      return NextResponse.json(result);
    }

    const items = await prisma.debtor.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        debts: { where: debtFilter },
      },
    });

    return NextResponse.json(items);
  } catch (err) {
    return handlePrismaError(err);
  }
}

const PostQuerySchema = z.object({
  shiftId: z.string().min(1).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    const validate = validateRequest({
      bodySchema: DebtorCreateSchema,
      querySchema: PostQuerySchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body, query } = data;

    const expenseCreate = query.shiftId
      ? {
          create: {
            category: "DEBTOR" as ExpenseCategory,
            amount: body.newDebtAmount,
            shift: { connect: { id: query.shiftId } },
          },
        }
      : undefined;

    const debtCreate = {
      create: {
        amount: body.newDebtAmount,
        status: "ACTIVE" as DebtStatus,
      },
    };

    const updateDebtorData = {
      debts: debtCreate,
      expenses: expenseCreate,
    };

    const upserted = await prisma.debtor.upsert({
      where: { name: body.name },
      update: updateDebtorData,
      create: {
        name: body.name,
        user: { connect: { id: session?.user.id } },
        ...updateDebtorData,
      },
      include: {
        debts: true,
        expenses: {
          where: { shiftId: query.shiftId },
          include: { debtor: true },
        },
      },
    });

    return NextResponse.json(upserted, { status: 201 });
  } catch (err) {
    return handlePrismaError(err);
  }
}
