import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/validate-request";
import { ExpenseCreateSchema } from "@/schemas/expense-schema";
import { handlePrismaError } from "@/utils/error-handlers";

const GetQuerySchema = z.object({
  shiftId: z.string().min(1).optional(),
  page: z.string().min(1).optional(),
  limit: z.string().min(1).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const validate = validateRequest({
      querySchema: GetQuerySchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { query } = data;

    const where = { shiftId: query.shiftId };

    const include = {
      debtor: true,
      supplierDelivery: { include: { supplier: { select: { name: true } } } },
    };

    if (query.page && query.limit) {
      const page = Number(query.page);
      const limit = Number(query.limit);

      const result = await prisma.expense.paginate({
        page,
        limit,
        where,
        orderBy: { createdAt: "desc" },
        include,
      });

      return NextResponse.json(result);
    }

    const expenses = await prisma.expense.findMany({
      where,
      include,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(expenses);
  } catch (err) {
    return handlePrismaError(err);
  }
}

const PostQuerySchema = z.object({
  shiftId: z.string().min(1, "shiftId обов'язковий"),
});

export async function POST(req: NextRequest) {
  try {
    const validate = validateRequest({
      bodySchema: ExpenseCreateSchema,
      querySchema: PostQuerySchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body, query } = data;

    const createdExpense = await prisma.expense.create({
      data: { shift: { connect: { id: query.shiftId } }, ...body },
    });

    return NextResponse.json(createdExpense);
  } catch (err) {
    return handlePrismaError(err);
  }
}
