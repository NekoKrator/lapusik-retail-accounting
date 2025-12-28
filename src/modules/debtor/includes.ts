import type { Prisma } from "@/generated/prisma/client";

export const listInclude = {
  debts: { where: { status: "ACTIVE" }, orderBy: { createdAt: "asc" } },
} satisfies Prisma.DebtorInclude;

export const updateSelect = {
  id: true,
  name: true,
  updatedAt: true,
  debts: {
    select: {
      id: true,
      status: true,
      updatedAt: true,
    },
  },
} satisfies Prisma.DebtorSelect;

export const deleteSelect = {
  id: true,
  debts: {
    select: {
      id: true,
    },
  },
} satisfies Prisma.DebtorSelect;

export const upsertInclude = {
  debts: { where: { status: "ACTIVE" }, orderBy: { createdAt: "asc" } },
} satisfies Prisma.DebtorInclude;

export const writeOffSelect = {
  id: true,
} satisfies Prisma.DebtorSelect;
