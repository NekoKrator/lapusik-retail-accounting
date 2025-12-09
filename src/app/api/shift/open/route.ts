import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { ShiftOpenSchema } from "@/schemas/shift-schema";
import { handlePrismaError } from "@/utils/error-handlers";

export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) {
    return error;
  }

  try {
    const existingShift = await prisma.shift.findFirst({
      where: { userId: session.user.id, isClosed: false },
    });

    if (existingShift) {
      return NextResponse.json(
        { error: "У користувача вже є розпочата зміна" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = ShiftOpenSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: z.flattenError(parsed.error) },
        { status: 400 }
      );
    }

    const result = await prisma.shift.create({
      data: { ...parsed.data, user: { connect: { id: session.user.id } } },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    return handlePrismaError(err);
  }
}
