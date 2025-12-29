import { Prisma } from "@/generated/prisma/client";

export const shiftJoinedColumns = {
  displayUsername: Prisma.sql`
		u."displayUsername"
	`,
};

export const additionalIncomeJoinedColumns = {
  createdAt: Prisma.sql`
		a."createdAt"
	`,

  displayUsername: Prisma.sql`
		u."displayUsername"
	`,
};

export const expenseJoinedColumns = {
  createdAt: Prisma.sql`
		e."createdAt"
	`,

  displayUsername: Prisma.sql`
		u."displayUsername"
	`,
};

export const supplierDeliveryJoinedColumns = {
  createdAt: Prisma.sql`
		sd."createdAt"
	`,

  updatedAt: Prisma.sql`
		sd."updatedAt"
	`,

  supplierName: Prisma.sql`
		s."name"
	`,

  displayUsername: Prisma.sql`
		u."displayUsername"
	`,
};

export const debtorJoinedColumns = {
  name: Prisma.sql`
		d.name
	`,

  displayUsername: Prisma.sql`
		u."displayUsername"
	`,
};
