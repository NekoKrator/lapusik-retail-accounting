import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { shiftComputedColumns } from "@/db/computed-columns";
import { shiftJoinedColumns } from "@/db/joined-columns";
import {
  buildHavingSQL,
  buildOrderBySQL,
  buildWhereSQL,
  splitFilters,
} from "@/lib/build-sql";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/validate-request";
import type { ShiftStats } from "@/schemas/shift/shift-schema";
import { ShiftStatsBodySchema } from "@/schemas/shift/shift-stats-search-payload";
import { handlePrismaError } from "@/utils/error-handlers";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (session?.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const validate = validateRequest({
      bodySchema: ShiftStatsBodySchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body } = data;

    const { where, having } = body.filters
      ? splitFilters(body.filters, shiftComputedColumns)
      : { where: [], having: [] };

    const page = Math.max(Number(body.page) || 1, 1);
    const limit = Math.max(Number(body.limit) || 10, 1);
    const offset = (page - 1) * limit;

    /* ---------------- WHERE ---------------- */

    const whereSQL = buildWhereSQL(where, shiftJoinedColumns);

    /* ---------------- HAVING ---------------- */

    const havingSQL = buildHavingSQL(having, shiftComputedColumns);

    /* ---------------- ORDER BY ---------------- */

    const orderBy = buildOrderBySQL(
      body.orderBy ?? "openedAt",
      body.order ?? "desc",
      { ...shiftJoinedColumns, ...shiftComputedColumns },
      "s"
    );

    /* ---------------- TOTAL ---------------- */

    const totalResult = await prisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*)::int AS count
			FROM (
				SELECT s.id
				FROM "shift" s
				LEFT JOIN "user" u ON u.id = s."userId"
				${whereSQL}
				GROUP BY s.id
				${havingSQL}
			) t
    `;

    const total = Number(totalResult[0]?.count ?? 0);

    /* ---------------- ITEMS ---------------- */

    const items = await prisma.$queryRaw<ShiftStats[]>`
      SELECT
        s.id,
        s."isClosed",
        s."openingBalance",
        s."totalAdditionalIncome",
        s."totalExpenses",
        s."totalCashRegister",
        s."terminalRegister",
        s."expectedClosingBalance",
        s."actualClosingBalance",
        s."openedAt",
        s."closedAt",
        u."displayUsername",
				${shiftComputedColumns.shiftDuration} AS "shiftDuration"
      FROM "shift" s
      LEFT JOIN "user" u ON u.id = s."userId"
			${whereSQL}
			GROUP BY s.id, u."displayUsername"
			${havingSQL}

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
