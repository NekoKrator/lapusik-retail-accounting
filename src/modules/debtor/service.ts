import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { AdditionalIncomeListDb } from "../additional-income/db-types";
import { listInclude as additionalIncomeInclude } from "../additional-income/includes";
import type { DebtListItem } from "../debt/contracts";
import type { DebtWriteOffDb } from "../debt/db-types";
import type { ExpenseListDb } from "../expense/db-types";
import { listInclude as expenseListInclude } from "../expense/includes";
import { upsertInclude } from "./includes";

export function upsertDebtor({
  userId,
  name,
  amount,
  shiftId,
}: {
  userId: string;
  name: string;
  amount: number;
  shiftId?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const debtor = await tx.debtor.upsert({
      where: { name },
      update: {},
      create: {
        name,
        user: { connect: { id: userId } },
      },
      include: upsertInclude,
    });

    const debt = await tx.debt.create({
      data: {
        amount,
        status: "ACTIVE",
        debtor: { connect: { id: debtor.id } },
      },
    });

    let expense: ExpenseListDb | undefined;

    if (shiftId) {
      expense = await tx.expense.create({
        data: {
          category: "DEBTOR",
          amount,
          debtor: { connect: { id: debtor.id } },
          shift: { connect: { id: shiftId } },
        },
        include: expenseListInclude,
      });
    }

    return {
      debtor,
      debt,
      expense,
    };
  });
}

function calculateCurrentDebt(
  debts: { amount: number; paidAmount: number }[]
): number {
  return debts.reduce((sum, d) => sum + d.amount - d.paidAmount, 0);
}

async function applyWriteOff(
  tx: Prisma.TransactionClient,
  debts: DebtListItem[],
  writeOffAmount: number
): Promise<DebtWriteOffDb[]> {
  let remaining = writeOffAmount;
  const result: DebtWriteOffDb[] = [];

  for (const debt of debts) {
    if (remaining <= 0) {
      break;
    }

    const available = debt.amount - debt.paidAmount;
    if (available <= 0) {
      continue;
    }

    const applied = Math.min(available, remaining);
    remaining -= applied;

    result.push(
      await tx.debt.update({
        where: { id: debt.id },
        data: {
          paidAmount: debt.paidAmount + applied,
          status: debt.paidAmount + applied === debt.amount ? "PAID" : "ACTIVE",
        },
      })
    );
  }

  return result;
}

function createAdditionalIncome(
  tx: Prisma.TransactionClient,
  debtorId: string,
  amount: number,
  shiftId?: string
): Promise<AdditionalIncomeListDb | undefined> {
  if (!shiftId) {
    return Promise.resolve(undefined);
  }

  return tx.additionalIncome.create({
    data: {
      category: "Повернення боргу",
      amount,
      debtor: { connect: { id: debtorId } },
      shift: { connect: { id: shiftId } },
    },
    include: additionalIncomeInclude,
  });
}

export function writeOffDebtorDebt({
  debtorId,
  writeOffAmount,
  shiftId,
}: {
  debtorId: string;
  writeOffAmount: number;
  shiftId?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const debtor = await tx.debtor.findUnique({
      where: { id: debtorId },
      include: {
        debts: {
          where: { status: "ACTIVE" },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!debtor) {
      throw new Error("DEBTOR_NOT_FOUND");
    }

    const currentDebt = calculateCurrentDebt(debtor.debts);

    if (writeOffAmount > currentDebt) {
      throw new Error("WRITE_OFF_EXCEEDS_DEBT");
    }

    const debts = await applyWriteOff(tx, debtor.debts, writeOffAmount);
    const additionalIncome = await createAdditionalIncome(
      tx,
      debtorId,
      writeOffAmount,
      shiftId
    );

    return { debtor, debts, additionalIncome };
  });
}
