import { useMemo } from "react";
import type { AdditionalIncomeWithDebtor } from "@/schemas/additional-income-schema";
import type { DebtorWithDebts } from "@/schemas/debtor-schema";
import type { ExpenseWithInclude } from "@/schemas/expense-schema";
import type { SupplierDeliveryWithSupplier } from "@/schemas/supplier-delivery-schema";

type UseShiftCalculationsProps = {
  openingBalance: number;
  additionalIncome: AdditionalIncomeWithDebtor[] | undefined;
  expenses: ExpenseWithInclude[] | undefined;
  supplierDeliveries: SupplierDeliveryWithSupplier[] | undefined;
  debtors: DebtorWithDebts[] | undefined;
  actualClosingBalance: number | null;
  totalCashRegister: number | null;
};

export const useShiftCalculations = ({
  openingBalance,
  additionalIncome,
  expenses,
  supplierDeliveries,
  debtors,
  actualClosingBalance,
  totalCashRegister,
}: UseShiftCalculationsProps) => {
  const totalAdditionalIncome = useMemo(() => {
    if (!Array.isArray(additionalIncome)) {
      return null;
    }

    return additionalIncome.reduce((sum, item) => sum + item.amount, 0);
  }, [additionalIncome]);

  const totalExpenses = useMemo(() => {
    if (!Array.isArray(expenses)) {
      return null;
    }

    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  const totalSupplierDeliveries = useMemo(() => {
    if (!Array.isArray(supplierDeliveries) || supplierDeliveries.length === 0) {
      return null;
    }

    return supplierDeliveries.reduce(
      (sum, d) =>
        sum + d.price - Number(d.paidByCashier) - Number(d.paidByOwner),
      0
    );
  }, [supplierDeliveries]);

  const totalDebtors = useMemo(() => {
    if (!Array.isArray(debtors) || debtors.length === 0) {
      return null;
    }

    return debtors.reduce(
      (s, debtor) =>
        s +
        debtor.debts.reduce(
          (sum, debt) => sum + debt.amount - debt.paidAmount,
          0
        ),
      0
    );
  }, [debtors]);

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
    totalSupplierDeliveries,
    totalDebtors,
    expectedClosingBalance,
    difference,
  };
};
