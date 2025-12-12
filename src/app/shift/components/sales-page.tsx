"use client";

import { Calculator, CheckCircle, Truck, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
import { AdditionalIncomeSection } from "./additional-income/additional-income-section";
import { CashRegister } from "./cash-register";
import DebtorsSection from "./debtors-section/debtors-section";
import { ExpensesSection } from "./expense-section/expenses-section";
import { FinalCalculations } from "./final-calculations";
import { QuickStats } from "./quick-stats/quick-stats";
import DeliveriesSection from "./supplier-deliveries-section/deliveries-section";

type SalesPageProps = {
  currentShift: Shift;
  lastClosedShift: Shift | null;
};

export default function SalesPage({ currentShift }: SalesPageProps) {
  const [showDebtors, setShowDebtors] = useState(false);
  const [showSuppliersDeliveries, setShowSuppliersDeliveries] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clampNumber = (n: unknown, max: number) => {
    if (typeof n !== "number") {
      return n;
    }
    if (Number.isNaN(n)) {
      return 0;
    }
    return Math.min(Math.max(n, 0), max);
  };

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
    isFetching: isLoadingDebtors,
    data: debtors,
    refetch: refetchDebtors,
  } = useDebtors({ status: "ACTIVE" });

  const {
    isFetching: isLoadingDeliveries,
    data: deliveries,
    refetch: refetchDeliveries,
  } = useSupplierDeliveries({ isPaidOff: "false" });

  const {
    isFetching: isLoadingAdditionalIncome,
    data: additionalIncome,
    refetch: refetchAdditionalIncome,
  } = useAdditionalIncome({ shiftId: currentShift.id });

  const {
    isFetching: isLoadingExpenses,
    data: expenses,
    refetch: refetchExpenses,
  } = useExpenses({ shiftId: currentShift.id });

  // Final calculations
  const {
    totalExpenses,
    totalAdditionalIncome,
    expectedClosingBalance,
    difference,
  } = useShiftCalculations({
    openingBalance: currentShift.openingBalance,
    additionalIncome,
    expenses,
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

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Button
            className="h-12 rounded-xl shadow-sm"
            disabled={isLoadingDebtors}
            onClick={() => setShowDebtors(!showDebtors)}
            type="button"
            variant={showDebtors ? "default" : "outline"}
          >
            {isLoadingDebtors ? (
              <>
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-40" />
              </>
            ) : (
              <>
                <Users />
                Боржники (<span>{debtors?.length ?? 0}</span>)
              </>
            )}
          </Button>

          <Button
            className="h-12 rounded-xl shadow-sm"
            disabled={isLoadingDeliveries}
            onClick={() => setShowSuppliersDeliveries(!showSuppliersDeliveries)}
            type="button"
            variant={showSuppliersDeliveries ? "default" : "outline"}
          >
            {isLoadingDeliveries ? (
              <>
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-40" />
              </>
            ) : (
              <>
                <Truck />
                Постачальники (<span>{deliveries?.length ?? 0}</span>)
              </>
            )}
          </Button>
        </div>

        {/* Debtors Section */}
        {showDebtors && (
          <DebtorsSection
            debtors={debtors}
            isLoadingDebtors={isLoadingDebtors}
            onFetchDebtor={refetchDebtors}
          />
        )}

        {/* Suppliers Deliveries Section */}
        {showSuppliersDeliveries && (
          <DeliveriesSection
            deliveries={deliveries}
            isLoadingDeliveries={isLoadingDeliveries}
            onFetchDelivery={refetchDeliveries}
          />
        )}

        {/* Additional Income and Expense Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Additional Income Section */}
          <AdditionalIncomeSection
            additionalIncome={additionalIncome}
            isLoadingAdditionalIncome={isLoadingAdditionalIncome}
            onFetchAdditionalIncome={refetchAdditionalIncome}
            totalAdditionalIncome={totalAdditionalIncome}
          />

          {/* Expenses Section */}
          <ExpensesSection
            expenses={expenses}
            isLoadingExpenses={isLoadingExpenses}
            onFetchExpenses={refetchExpenses}
            totalExpenses={totalExpenses}
          />
        </div>

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
