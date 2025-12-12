import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/validate-request";
import { ShiftOpenSchema } from "@/schemas/shift-schema";
import { handlePrismaError } from "@/utils/error-handlers";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    const existingShift = await prisma.shift.findFirst({
      where: { userId: session?.user.id, isClosed: false },
    });

    if (existingShift) {
      return NextResponse.json(
        { error: "У користувача вже є розпочата зміна" },
        { status: 400 }
      );
    }

    const validate = validateRequest({
      bodySchema: ShiftOpenSchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body } = data;

    const result = await prisma.shift.create({
      data: { ...body, user: { connect: { id: session?.user.id } } },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    return handlePrismaError(err);
  }
}
