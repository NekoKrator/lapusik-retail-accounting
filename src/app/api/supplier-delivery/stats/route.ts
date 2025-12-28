import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { supplierDeliveryComputedColumns } from "@/db/computed-columns";
import { supplierDeliveryJoinedColumns } from "@/db/joined-columns";
import {
  buildHavingSQL,
  buildOrderBySQL,
  buildWhereSQL,
  splitFilters,
} from "@/lib/build-sql";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/validate-request";
import type { SupplierDeliveryStats } from "@/schemas/supplier-delivery/supplier-delivery-schema";
import { SupplierDeliveryStatsBodySchema } from "@/schemas/supplier-delivery/supplier-delivery-stats-search-params";
import { handlePrismaError } from "@/utils/error-handlers";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (session?.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const validate = validateRequest({
      bodySchema: SupplierDeliveryStatsBodySchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body } = data;

    const { where, having } = body.filters
      ? splitFilters(body.filters, supplierDeliveryComputedColumns)
      : { where: [], having: [] };

    const page = Math.max(Number(body.page) || 1, 1);
    const limit = Math.max(Number(body.limit) || 10, 1);
    const offset = (page - 1) * limit;

    /* ---------------- WHERE ---------------- */

    const whereSQL = buildWhereSQL(where, supplierDeliveryJoinedColumns);

    /* ---------------- HAVING ---------------- */

    const havingSQL = buildHavingSQL(having, supplierDeliveryComputedColumns);

    /* ---------------- ORDER BY ---------------- */

    const orderBy = buildOrderBySQL(
      body.orderBy ?? "createdAt",
      body.order ?? "desc",
      { ...supplierDeliveryJoinedColumns, ...supplierDeliveryComputedColumns },
      "sd"
    );

    /* ---------------- TOTAL ---------------- */

    const totalResult = await prisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*)::int AS count
			FROM (
				SELECT sd.id
				FROM "supplier_delivery" sd
				LEFT JOIN "user" u ON u.id = sd."userId"
				LEFT JOIN "supplier" s ON s.id = sd."supplierId"
				${whereSQL}
				GROUP BY sd.id
				${havingSQL}
			) t
    `;

    const total = Number(totalResult[0]?.count ?? 0);

    /* ---------------- ITEMS ---------------- */

    const items = await prisma.$queryRaw<SupplierDeliveryStats[]>`
      SELECT
        sd."id",
				sd."invoiceNumber",
				sd."status",
				sd."price",
				sd."paidByCashier",
				sd."paidByOwner",
				sd."createdAt",
				sd."updatedAt",
        u."displayUsername",
				s."name" as "supplierName",
				${supplierDeliveryComputedColumns.debt} as "debt"
      FROM "supplier_delivery" sd
			LEFT JOIN "user" u ON u.id = sd."userId"
			LEFT JOIN "supplier" s ON s.id = sd."supplierId"
			${whereSQL}
			GROUP BY sd.id, u."displayUsername", s."name"
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
