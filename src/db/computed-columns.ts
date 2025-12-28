import { Prisma } from "@/generated/prisma/client";

export const shiftComputedColumns = {
  shiftDuration: Prisma.sql`
    EXTRACT(EPOCH FROM (s."closedAt" - s."openedAt"))::int
  `,
};

export const supplierComputedColumns = {
  totalDeliveriesCount: Prisma.sql`
    COUNT(sd.id)::int
  `,

  activeDeliveriesCount: Prisma.sql`
    COUNT(sd.*) FILTER (
      WHERE sd."status" = 'ACTIVE'
    )::int
  `,

  paidDeliveriesCount: Prisma.sql`
     COUNT(sd.*) FILTER (
      WHERE sd."status" = 'PAID'
    )::int
  `,

  canceledDeliveriesCount: Prisma.sql`
     COUNT(sd.*) FILTER (
      WHERE sd."status" = 'CANCELED'
    )::int
  `,

  totalPaidByCashier: Prisma.sql`
    COALESCE(SUM(sd."paidByCashier"), 0)
  `,

  totalPaidByOwner: Prisma.sql`
    COALESCE(SUM(sd."paidByOwner"), 0)
  `,

  totalPaid: Prisma.sql`
    COALESCE(SUM(sd."paidByCashier"), 0)
    + COALESCE(SUM(sd."paidByOwner"), 0)
  `,

  totalCurrentDebt: Prisma.sql`
    COALESCE(
      SUM(
        CASE
          WHEN sd."status" = 'ACTIVE'
          THEN sd."price"
               - COALESCE(sd."paidByCashier", 0)
               - COALESCE(sd."paidByOwner", 0)
          ELSE 0
        END
      ),
      0
    )
  `,
};

export const debtorComputedColumns = {
  totalCurrentDebt: Prisma.sql`
    COALESCE(
      SUM(
        CASE
          WHEN dt."status" = 'ACTIVE'
          THEN dt."amount"
               - COALESCE(dt."paidAmount", 0)
          ELSE 0
        END
      ),
      0
    )
  `,

  totalDebt: Prisma.sql`
    COALESCE(SUM(dt."amount"), 0)
  `,

  totalPaid: Prisma.sql`
    COALESCE(SUM(dt."paidAmount"), 0)
  `,

  totalDebtsCount: Prisma.sql`
    COUNT(dt.id)::int
  `,

  activeDebtsCount: Prisma.sql`
    COUNT(dt.*) FILTER (
      WHERE dt."status" = 'ACTIVE'
    )::int
  `,

  paidDebtsCount: Prisma.sql`
    COUNT(*) FILTER (
      WHERE dt."status" = 'PAID'
    )::int
  `,

  canceledDebtsCount: Prisma.sql`
    COUNT(*) FILTER (
      WHERE dt."status" = 'CANCELED'
    )::int
  `,
};

export const supplierDeliveryComputedColumns = {
  debt: Prisma.sql`
    COALESCE(
      SUM(
        CASE
          WHEN sd."status" = 'ACTIVE'
          THEN sd."price"
               - COALESCE(sd."paidByCashier", 0)
							 - COALESCE(sd."paidByOwner", 0)
          ELSE 0
        END
      ),
      0
    )
  `,
};
