import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { AdditionalIncomeCreateSchema } from "@/schemas/additional-income-schema";
import { handlePrismaError } from "@/utils/error-handlers";

export async function GET(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) {
    return error;
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const shiftId = searchParams.get("shiftId");

    if (!shiftId) {
      return NextResponse.json(
        { message: "Параметр shiftId є обов'язковим" },
        { status: 400 }
      );
    }

    const additionalIncome = await prisma.additionalIncome.findMany({
      where: { shiftId },
      include: { debtor: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(additionalIncome);
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth();
  if (error) {
    return error;
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const shiftId = searchParams.get("shiftId");

    if (!shiftId) {
      return NextResponse.json(
        { message: "Параметр shiftId є обов'язковим" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = AdditionalIncomeCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: z.flattenError(parsed.error) },
        { status: 400 }
      );
    }

    const createdAdditionalIncome = await prisma.additionalIncome.create({
      data: { shift: { connect: { id: shiftId } }, ...parsed.data },
    });

    return NextResponse.json(createdAdditionalIncome);
  } catch (err) {
    return handlePrismaError(err);
  }
}
