import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { handlePrismaError } from "@/utils/error-handlers";

type GetShiftWhere = {
  userId?: string;
  isClosed?: boolean;
};

export async function GET(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) {
    return error;
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const isClosed = searchParams.get("isEnded");

    const where: GetShiftWhere = {};

    if (session.user.role === "admin" && userId) {
      where.userId = userId;
    } else if (session.user.role !== "admin") {
      where.userId = session.user.id;
    }

    if (isClosed != null) {
      where.isClosed = isClosed === "true";
    }

    const shifts = await prisma.shift.findMany({
      where,
      orderBy: { closedAt: "desc" },
    });

    return NextResponse.json(shifts);
  } catch (err) {
    return handlePrismaError(err);
  }
}
