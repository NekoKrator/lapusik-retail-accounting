import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/validate-request";
import { ShiftCloseSchema } from "@/schemas/shift-schema";
import { handlePrismaError } from "@/utils/error-handlers";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession();
    const shift = await prisma.shift.findFirst({
      where: { userId: session?.user.id, isClosed: false },
    });

    if (!shift) {
      return NextResponse.json(
        { error: "Розпочату зміну не знайдено" },
        { status: 400 }
      );
    }

    const validate = validateRequest({
      bodySchema: ShiftCloseSchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body } = data;

    const updatedShift = await prisma.shift.update({
      where: { id: shift.id },
      data: {
        closedAt: new Date(),
        isClosed: true,
        ...body,
      },
    });

    return NextResponse.json(updatedShift);
  } catch (err) {
    return handlePrismaError(err);
  }
}
