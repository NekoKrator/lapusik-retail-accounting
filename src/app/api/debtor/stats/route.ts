import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { debtorComputedColumns } from "@/db/computed-columns";
import {
  buildHavingSQL,
  buildOrderBySQL,
  buildWhereSQL,
  splitFilters,
} from "@/lib/build-sql";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/validate-request";
import type { DebtorStats } from "@/schemas/debtor/debtor-schema";
import { DebtorStatsBodySchema } from "@/schemas/debtor/debtor-stats-search-payload";
import { handlePrismaError } from "@/utils/error-handlers";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (session?.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const validate = validateRequest({
      bodySchema: DebtorStatsBodySchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body } = data;

    const { where, having } = body.filters
      ? splitFilters(body.filters, debtorComputedColumns)
      : { where: [], having: [] };

    const page = Math.max(Number(body.page) || 1, 1);
    const limit = Math.max(Number(body.limit) || 10, 1);
    const offset = (page - 1) * limit;

    /* ---------------- WHERE ---------------- */

    const whereSQL = buildWhereSQL(where);

    /* ---------------- HAVING ---------------- */

    const havingSQL = buildHavingSQL(having, debtorComputedColumns);

    /* ---------------- ORDER BY ---------------- */

    const orderBy = buildOrderBySQL(
      body.orderBy ?? "name",
      body.order ?? "asc",
      debtorComputedColumns,
      "d"
    );

    /* ---------------- TOTAL ---------------- */

    const totalResult = await prisma.$queryRaw<{ count: number }[]>`
		  SELECT COUNT(*)::int AS count
			FROM (
				SELECT d.id
				FROM "debtor" d
				LEFT JOIN "debt" dt ON dt."debtorId" = d.id
				${whereSQL}
				GROUP BY d.id
				${havingSQL}
			) t
    `;

    const total = Number(totalResult[0]?.count ?? 0);

    /* ---------------- ITEMS ---------------- */

    const items = await prisma.$queryRaw<DebtorStats[]>`
			SELECT
				d.id,
				d.name,
				${debtorComputedColumns.totalCurrentDebt} AS "totalCurrentDebt",
				${debtorComputedColumns.totalDebt} AS "totalDebt",
				${debtorComputedColumns.totalPaid} AS "totalPaid",
				${debtorComputedColumns.totalDebtsCount} AS "totalDebtsCount",
				${debtorComputedColumns.activeDebtsCount} AS "activeDebtsCount",
				${debtorComputedColumns.canceledDebtsCount} AS "canceledDebtsCount",
				${debtorComputedColumns.paidDebtsCount} AS "paidDebtsCount"
			FROM "debtor" d
			LEFT JOIN "debt" dt ON dt."debtorId" = d.id
			${whereSQL}
    	GROUP BY d.id
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
