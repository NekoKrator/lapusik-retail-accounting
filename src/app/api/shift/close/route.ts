import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { ShiftCloseSchema } from "@/schemas/shift-schema";
import { handlePrismaError } from "@/utils/error-handlers";

export async function PATCH(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) {
    return error;
  }

  try {
    const shift = await prisma.shift.findFirst({
      where: { userId: session.user.id, isClosed: false },
    });

    if (!shift) {
      return NextResponse.json(
        { error: "Розпочату зміну не знайдено" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = ShiftCloseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: JSON.stringify(z.flattenError(parsed.error)) },
        { status: 400 }
      );
    }

    const updatedShift = await prisma.shift.update({
      where: { id: shift.id },
      data: {
        closedAt: new Date(),
        isClosed: true,
        ...parsed.data,
      },
    });

    return NextResponse.json(updatedShift);
  } catch (err) {
    return handlePrismaError(err);
  }
}
