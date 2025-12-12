import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/validate-request";
import { AdditionalIncomeCreateSchema } from "@/schemas/additional-income-schema";
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

    if (query.page && query.limit) {
      const page = Number(query.page);
      const limit = Number(query.limit);

      const result = await prisma.additionalIncome.paginate({
        page,
        limit,
        where,
        orderBy: { createdAt: "desc" },
        include: { debtor: true },
      });

      return NextResponse.json(result);
    }

    const items = await prisma.additionalIncome.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { debtor: true },
    });

    return NextResponse.json(items);
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
      bodySchema: AdditionalIncomeCreateSchema,
      querySchema: PostQuerySchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body, query } = data;

    const createdAdditionalIncome = await prisma.additionalIncome.create({
      data: { shift: { connect: { id: query.shiftId } }, ...body },
    });

    return NextResponse.json(createdAdditionalIncome);
  } catch (err) {
    return handlePrismaError(err);
  }
}
