import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { handlePrismaError } from "@/utils/error-handlers";

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession();
    const currentShift = await prisma.shift.findFirst({
      where: { userId: session?.user.id, isClosed: false },
      orderBy: { openedAt: "desc" },
    });

    const lastClosedShift = await prisma.shift.findFirst({
      where: { userId: session?.user.id, isClosed: true },
      orderBy: { closedAt: "desc" },
    });

    return NextResponse.json({ currentShift, lastClosedShift });
  } catch (err) {
    return handlePrismaError(err);
  }
}
