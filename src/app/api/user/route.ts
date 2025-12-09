import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { handlePrismaError } from "@/utils/error-handlers";

export async function GET(req: NextRequest) {
  const { error } = await requireAuth(["admin"]);
  if (error) {
    return error;
  }

  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    const where = role ? { role } : {};

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        role: true,
      },
      orderBy: { username: "asc" },
    });

    return NextResponse.json(users);
  } catch (err) {
    handlePrismaError(err);
  }
}
