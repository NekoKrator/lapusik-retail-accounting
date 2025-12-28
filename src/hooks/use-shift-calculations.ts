import type { AdditionalIncomeListItem } from "@/modules/additional-income/contracts";
import type { DebtorListItem } from "@/modules/debtor/contracts";
import type { ExpenseListItem } from "@/modules/expense/contracts";
import type { SupplierDeliveryListItem } from "@/modules/supplier-delivery/contracts";

type UseShiftCalculationsProps = {
  openingBalance: number;
  additionalIncome?: AdditionalIncomeListItem[];
  expenses?: ExpenseListItem[];
  supplierDeliveries?: SupplierDeliveryListItem[];
  debtors?: DebtorListItem[];
  totalCashRegister: number;
  terminalRegister: number;
  actualClosingBalance: number;
};

function sumBy<T>(arr: T[] | undefined, selector: (item: T) => number) {
  return Array.isArray(arr)
    ? arr.reduce((acc, item) => acc + selector(item), 0)
    : 0;
}

export const useShiftCalculations = ({
  openingBalance,
  additionalIncome,
  expenses,
  supplierDeliveries,
  debtors,
  actualClosingBalance,
  totalCashRegister,
  terminalRegister,
}: UseShiftCalculationsProps) => {
  const totalAdditionalIncome = sumBy(additionalIncome, (item) => item.amount);

  const totalExpenses = sumBy(expenses, (item) => item.amount);

  const totalSupplierDeliveries = sumBy(
    supplierDeliveries,
    (item) => item.price - item.paidByCashier - item.paidByOwner
  );

  const totalDebtors = sumBy(debtors, (item) =>
    sumBy(item.debts, (i) => i.amount - i.paidAmount)
  );

  const expectedClosingBalance =
    openingBalance +
    totalAdditionalIncome +
    totalCashRegister -
    terminalRegister -
    totalExpenses;

  const difference = expectedClosingBalance - actualClosingBalance;

  return {
    totalExpenses,
    totalAdditionalIncome,
    totalSupplierDeliveries,
    totalDebtors,
    expectedClosingBalance,
    difference,
  };
};
