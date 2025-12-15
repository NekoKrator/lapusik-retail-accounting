"use client";

import { Calculator, CheckCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { TypographyH1, TypographyP } from "@/components/ui/typography";
import type { Shift } from "@/generated/prisma/client";
import { useAdditionalIncome } from "@/hooks/api/additional-income/use-additional-income";
import { useDebtors } from "@/hooks/api/debtor/use-debtors";
import { useExpenses } from "@/hooks/api/expense/use-expenses";
import { useCloseShift } from "@/hooks/api/shift/use-close-shift";
import { useSupplierDeliveries } from "@/hooks/api/supplier-deliveries/use-supplier-deliveries";
import { useShiftCalculations } from "@/hooks/use-shift-calculations";
import type { LocalStorageDraft } from "@/types/types";
import { CashRegister } from "./cash-register";
import { FinalCalculations } from "./final-calculations";
import { QuickStats } from "./quick-stats/quick-stats";
import { SalesTabs } from "./tabs/sales-tabs";
import {
  additionalIncomeTab,
  debtorsTab,
  expensesTab,
  supplierDeliveriesTab,
} from "./tabs/tabs";

type SalesPageProps = {
  currentShift: Shift;
  lastClosedShift: Shift | null;
};

const clampNumber = (n: unknown, max: number) => {
  if (typeof n !== "number") {
    return n;
  }
  if (Number.isNaN(n)) {
    return 0;
  }
  return Math.min(Math.max(n, 0), max);
};

export default function SalesPage({ currentShift }: SalesPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [localStorageDraft, setLocalStorageDraft, clearDraft] =
    useLocalStorage<LocalStorageDraft>(
      "sales-page-draft",
      {
        actualClosingBalance: null,
        totalCashRegister: null,
      },
      {
        serializer: (value: LocalStorageDraft) =>
          JSON.stringify({
            ...value,
            totalCashRegister: clampNumber(value.totalCashRegister, 9_999_999),
            actualClosingBalance: clampNumber(
              value.actualClosingBalance,
              999_999_999
            ),
          }),
      }
    );

  const closeShift = useCloseShift();

  const {
    isLoading: isLoadingDebtors,
    isFetching: isFetchingDebtors,
    data: debtors,
    refetch: refetchDebtors,
  } = useDebtors({ status: "ACTIVE" });

  const {
    isLoading: isLoadingSupplierDeliveries,
    isFetching: isFetchingSupplierDeliveries,
    data: supplierDeliveries,
    refetch: refetchDeliveries,
  } = useSupplierDeliveries({ isPaidOff: "false" });

  const {
    isLoading: isLoadingAdditionalIncome,
    isFetching: isFetchingAdditionalIncome,
    data: additionalIncome,
    refetch: refetchAdditionalIncome,
  } = useAdditionalIncome({ shiftId: currentShift.id });

  const {
    isLoading: isLoadingExpenses,
    isFetching: isFetchingExpenses,
    data: expenses,
    refetch: refetchExpenses,
  } = useExpenses({ shiftId: currentShift.id });

  // Final calculations
  const {
    totalExpenses,
    totalAdditionalIncome,
    totalSupplierDeliveries,
    totalDebtors,
    expectedClosingBalance,
    difference,
  } = useShiftCalculations({
    openingBalance: currentShift.openingBalance,
    additionalIncome,
    expenses,
    supplierDeliveries,
    debtors,
    actualClosingBalance: localStorageDraft.actualClosingBalance,
    totalCashRegister: localStorageDraft.totalCashRegister,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (localStorageDraft.actualClosingBalance === null) {
      toast.error("Введіть фактичний залишок");
      setIsSubmitting(false);
      return;
    }

    try {
      const reportData = {
        actualClosingBalance: localStorageDraft.actualClosingBalance,
        expectedClosingBalance: expectedClosingBalance ?? 0,
        totalAdditionalIncome: totalAdditionalIncome ?? 0,
        totalCashRegister: localStorageDraft.totalCashRegister ?? 0,
        totalExpenses: totalExpenses ?? 0,
      };

      await closeShift.mutateAsync(reportData);

      clearDraft();
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = useMemo(
    () => [
      additionalIncomeTab({
        data: additionalIncome,
        total: totalAdditionalIncome ?? 0,
        isLoading: isLoadingAdditionalIncome,
        isFetching: isFetchingAdditionalIncome,
        onRefresh: refetchAdditionalIncome,
      }),
      expensesTab({
        data: expenses,
        total: totalExpenses ?? 0,
        isLoading: isLoadingExpenses,
        isFetching: isFetchingExpenses,
        onRefresh: refetchExpenses,
      }),
      supplierDeliveriesTab({
        data: supplierDeliveries,
        total: totalSupplierDeliveries ?? 0,
        isLoading: isLoadingSupplierDeliveries,
        isFetching: isFetchingSupplierDeliveries,
        onRefresh: refetchDeliveries,
      }),
      debtorsTab({
        data: debtors,
        total: totalDebtors ?? 0,
        isLoading: isLoadingDebtors,
        isFetching: isFetchingDebtors,
        onRefresh: refetchDebtors,
      }),
    ],
    [
      additionalIncome,
      debtors,
      supplierDeliveries,
      expenses,
      isFetchingAdditionalIncome,
      isFetchingDebtors,
      isFetchingSupplierDeliveries,
      isFetchingExpenses,
      isLoadingAdditionalIncome,
      isLoadingDebtors,
      isLoadingSupplierDeliveries,
      isLoadingExpenses,
      refetchAdditionalIncome,
      refetchDebtors,
      refetchDeliveries,
      refetchExpenses,
      totalAdditionalIncome,
      totalDebtors,
      totalExpenses,
      totalSupplierDeliveries,
    ]
  );

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Calculator className="h-8 w-8 text-green-600" />
              <TypographyH1 className="font-bold text-3xl">
                Звіт за зміну
              </TypographyH1>
            </CardTitle>
            <CardDescription>
              <TypographyP>
                Ведення обліку доходів та витрат за робочу зміну
              </TypographyP>
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <QuickStats
          expectedClosingBalance={expectedClosingBalance}
          totalAdditionalIncome={totalAdditionalIncome}
          totalCashRegister={Number(localStorageDraft?.totalCashRegister)}
          totalExpenses={totalExpenses}
          totalMorningBalance={currentShift.openingBalance}
        />

        {/* Additional Income, Expenses, Supplier Deliveries and Debtors tabs */}
        <SalesTabs tabs={tabs} />

        {/* Daily Cash Register */}
        <CashRegister
          onTotalCashRegisterChange={setLocalStorageDraft}
          totalCashRegister={localStorageDraft?.totalCashRegister}
        />

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Final Calculations */}
          <FinalCalculations
            actualClosingBalance={localStorageDraft?.actualClosingBalance}
            difference={difference}
            expectedClosingBalance={expectedClosingBalance}
            onActualClosingBalanceChange={setLocalStorageDraft}
          />

          <Button
            className="w-full"
            disabled={isSubmitting}
            size="lg"
            type="submit"
          >
            {isSubmitting ? (
              <>
                <Spinner />
                Збереження...
              </>
            ) : (
              <>
                <CheckCircle />
                Закінчити зміну
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
