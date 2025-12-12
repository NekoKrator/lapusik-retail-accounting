import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/validate-request";
import { handlePrismaError } from "@/utils/error-handlers";

const GetQuerySchema = z.object({
  userId: z.string().min(1).optional(),
  isClosed: z.string().min(1).optional(),
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
      userId: session?.user.role === "admin" ? query.userId : session?.user.id,
      isClosed: query.isClosed
        ? String(query.isClosed).toLowerCase() === "true"
        : undefined,
    };

    if (query.page && query.limit) {
      const page = Number(query.page);
      const limit = Number(query.limit);

      const result = await prisma.shift.paginate({
        page,
        limit,
        where,
        orderBy: { closedAt: "desc" },
      });

      return NextResponse.json(result);
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
