import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod";
import type { ExpenseCategory } from "@/generated/prisma/client";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { SupplierDeliveryCreateSchema } from "@/schemas/supplier-delivery-schema";
import { handlePrismaError } from "@/utils/error-handlers";

type GetSupplierDeliveryWhere = {
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

    const baseWhere = { userId: session.user.id };
    const whereFilter: GetSupplierDeliveryWhere = { ...baseWhere };

    if (isPaidOff && isPaidOff.toLowerCase() === "false") {
      whereFilter.isPaidOff = false;
    }

    const deliveries = await prisma.supplierDelivery.findMany({
      where: whereFilter,
      include: { supplier: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(deliveries);
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
    const searchParams = req.nextUrl.searchParams;
    const shiftId = searchParams.get("shiftId");

    const body = await req.json();
    const parsed = SupplierDeliveryCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: z.flattenError(parsed.error) },
        { status: 400 }
      );
    }

    const newExpenseCreate =
      shiftId && parsed.data.paidByCashier
        ? {
            create: {
              category: "SUPPLIER_PAYMENT" as ExpenseCategory,
              amount: parsed.data.paidByCashier,
              shift: {
                connect: {
                  id: shiftId,
                },
              },
            },
          }
        : undefined;

    const createdDelivery = await prisma.supplierDelivery.create({
      data: {
        ...parsed.data,
        isPaidOff: false,
        user: {
          connect: {
            id: session.user.id,
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
