import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { supplierComputedColumns } from "@/db/computed-columns";
import {
  buildHavingSQL,
  buildOrderBySQL,
  buildWhereSQL,
  splitFilters,
} from "@/lib/build-sql";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/validate-request";
import type { SupplierStats } from "@/schemas/supplier/supplier-schema";
import { SupplierStatsBodySchema } from "@/schemas/supplier/supplier-stats-search-payload";
import { handlePrismaError } from "@/utils/error-handlers";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (session?.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const validate = validateRequest({
      bodySchema: SupplierStatsBodySchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body } = data;

    const { where, having } = body.filters
      ? splitFilters(body.filters, supplierComputedColumns)
      : { where: [], having: [] };

    const page = Math.max(Number(body.page) || 1, 1);
    const limit = Math.max(Number(body.limit) || 10, 1);
    const offset = (page - 1) * limit;

    /* ---------------- WHERE ---------------- */

    const whereSQL = buildWhereSQL(where);

    /* ---------------- HAVING ---------------- */

    const havingSQL = buildHavingSQL(having, supplierComputedColumns);

    /* ---------------- ORDER BY ---------------- */

    const orderBy = buildOrderBySQL(
      body.orderBy ?? "name",
      body.order ?? "asc",
      supplierComputedColumns,
      "s"
    );

    /* ---------------- TOTAL ---------------- */

    const totalResult = await prisma.$queryRaw<{ count: number }[]>`
		  SELECT COUNT(*)::int AS count
			FROM (
				SELECT s.id
				FROM "supplier" s
				LEFT JOIN "supplier_delivery" sd ON sd."supplierId" = s.id
				${whereSQL}
				GROUP BY s.id
				${havingSQL}
			) t
    `;

    const total = Number(totalResult[0]?.count ?? 0);

    /* ---------------- ITEMS ---------------- */

    const items = await prisma.$queryRaw<SupplierStats[]>`
			SELECT
				s.id,
				s.name,
				${supplierComputedColumns.activeDeliveriesCount} AS "activeDeliveriesCount",
				${supplierComputedColumns.canceledDeliveriesCount} AS "canceledDeliveriesCount",
				${supplierComputedColumns.paidDeliveriesCount} AS "paidDeliveriesCount",
				${supplierComputedColumns.totalCurrentDebt} AS "totalCurrentDebt",
				${supplierComputedColumns.totalDeliveriesCount} AS "totalDeliveriesCount",
				${supplierComputedColumns.totalPaid} AS "totalPaid",
				${supplierComputedColumns.totalPaidByCashier} AS "totalPaidByCashier",
				${supplierComputedColumns.totalPaidByOwner} AS "totalPaidByOwner"
			FROM "supplier" s
			LEFT JOIN "supplier_delivery" sd ON sd."supplierId" = s.id
			${whereSQL}
    	GROUP BY s.id
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
