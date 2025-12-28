import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { additionalIncomeJoinedColumns } from "@/db/joined-columns";
import { buildOrderBySQL, buildWhereSQL } from "@/lib/build-sql";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/validate-request";
import type { AdditionalIncomeStats } from "@/schemas/additional-income/additional-income-schema";
import { AdditionalIncomeStatsBodySchema } from "@/schemas/additional-income/additional-income-stats-payload";
import { handlePrismaError } from "@/utils/error-handlers";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (session?.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const validate = validateRequest({
      bodySchema: AdditionalIncomeStatsBodySchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body } = data;

    const where = body.filters ?? [];

    const page = Math.max(Number(body.page) || 1, 1);
    const limit = Math.max(Number(body.limit) || 10, 1);
    const offset = (page - 1) * limit;

    /* ---------------- WHERE ---------------- */

    const whereSQL = buildWhereSQL(where, additionalIncomeJoinedColumns);

    /* ---------------- ORDER BY ---------------- */

    const orderBy = buildOrderBySQL(
      body.orderBy ?? "createdAt",
      body.order ?? "desc",
      additionalIncomeJoinedColumns,
      "a"
    );

    /* ---------------- TOTAL ---------------- */

    const totalResult = await prisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*)::int AS count
			FROM (
				SELECT a.id
				FROM "additional_income" a
				LEFT JOIN "shift" s ON s.id = a."shiftId"
				LEFT JOIN "user" u ON u.id = s."userId"
				${whereSQL}
			) t
    `;

    const total = Number(totalResult[0]?.count ?? 0);

    /* ---------------- ITEMS ---------------- */

    const items = await prisma.$queryRaw<AdditionalIncomeStats[]>`
      SELECT
				a.id,
        a.category,
        a.amount,
        a."createdAt",
        u."displayUsername"
      FROM "additional_income" a
			LEFT JOIN "shift" s ON s.id = a."shiftId"
			LEFT JOIN "user" u ON u.id = s."userId"
			${whereSQL}

      ORDER BY ${orderBy}
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    return NextResponse.json({
      page,
      pageSize: limit,
      total,
      totalPages: Math.ceil(total / limit),
      items,
    });
  } catch (err) {
    return handlePrismaError(err);
  }
}
