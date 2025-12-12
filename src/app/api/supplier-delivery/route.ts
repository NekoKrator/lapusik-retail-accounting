import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod";
import type { ExpenseCategory } from "@/generated/prisma/client";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/validate-request";
import { SupplierDeliveryCreateSchema } from "@/schemas/supplier-delivery-schema";
import { handlePrismaError } from "@/utils/error-handlers";

const GetQuerySchema = z.object({
  isPaidOff: z.string().min(1).optional(),
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

    const where = {
      userId: session?.user.id,
      isPaidOff: query.isPaidOff
        ? String(query.isPaidOff).toLowerCase() === "true"
        : undefined,
    };

    const include = { supplier: true };

    if (query.page && query.limit) {
      const page = Number(query.page);
      const limit = Number(query.limit);

      const result = await prisma.supplierDelivery.paginate({
        page,
        limit,
        where,
        include,
      });

      return NextResponse.json(result);
    }

    const deliveries = await prisma.supplierDelivery.findMany({
      where,
      include,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(deliveries);
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
      bodySchema: SupplierDeliveryCreateSchema,
      querySchema: PostQuerySchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body, query } = data;

    const newExpenseCreate =
      query.shiftId && body.paidByCashier
        ? {
            create: {
              category: "SUPPLIER_PAYMENT" as ExpenseCategory,
              amount: body.paidByCashier,
              shift: {
                connect: {
                  id: query.shiftId,
                },
              },
            },
          }
        : undefined;

    const createdDelivery = await prisma.supplierDelivery.create({
      data: {
        ...body,
        isPaidOff: false,
        user: {
          connect: {
            id: session?.user.id,
          },
        },
        expenses: newExpenseCreate,
      },
      include: {
        supplier: true,
        expenses: {
          include: {
            supplierDelivery: {
              include: { supplier: { select: { name: true } } },
            },
          },
        },
      },
    });

    return NextResponse.json(createdDelivery);
  } catch (err) {
    return handlePrismaError(err);
  }
}
