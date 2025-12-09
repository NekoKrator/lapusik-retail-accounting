import { useMemo } from "react";
import type { AdditionalIncome, Expense } from "@/generated/prisma/client";

type UseShiftCalculationsProps = {
  openingBalance: number;
  additionalIncome: AdditionalIncome[] | undefined;
  expenses: Expense[] | undefined;
  actualClosingBalance: number | null;
  totalCashRegister: number | null;
};

export const useShiftCalculations = ({
  openingBalance,
  additionalIncome,
  expenses,
  actualClosingBalance,
  totalCashRegister,
}: UseShiftCalculationsProps) => {
  const totalExpenses = useMemo(() => {
    if (!Array.isArray(expenses)) {
      return null;
    }

    return expenses.reduce((sum, item) => sum + item.amount, 0) ?? 0;
  }, [expenses]);

  const totalAdditionalIncome = useMemo(() => {
    if (!Array.isArray(additionalIncome)) {
      return null;
    }

    return additionalIncome.reduce((sum, item) => sum + item.amount, 0) ?? 0;
  }, [additionalIncome]);

  const expectedClosingBalance = useMemo(() => {
    if (totalAdditionalIncome == null || totalExpenses == null) {
      return null;
    }

    return (
      openingBalance +
      totalAdditionalIncome +
      Number(totalCashRegister) -
      totalExpenses
    );
  }, [openingBalance, totalAdditionalIncome, totalCashRegister, totalExpenses]);

  const difference = useMemo(
    () =>
      actualClosingBalance !== null
        ? Number(expectedClosingBalance) - actualClosingBalance
        : null,
    [expectedClosingBalance, actualClosingBalance]
  );

  return {
    totalExpenses,
    totalAdditionalIncome,
    expectedClosingBalance,
    difference,
  };
};
