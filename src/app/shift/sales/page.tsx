"use client";

// hooks
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorageDraft } from "@/app/hooks/useLocalStorageDraft";
import { useDebtors } from "@/app/hooks/useDebtors";
import { useSuppliers } from "@/app/hooks/useSuppliers";
import { useSupplierDeliveries } from "@/app/hooks/useSupplierDeliveries";

// UI
import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Calculator,
    Users,
    Truck,
    CheckCircle,
    AlertCircle,
    Clock,
} from "lucide-react";

// components
import { QuickStats } from "./components/QuickStats";
import DebtorsSection from "./components/DebtorsSection";
import SuppliersSection from "./components/SuppliersSection";
import { MorningBalance } from "./components/MorningBalance";
import { CashRegister } from "./components/CashRegister";
import { ExpensesSection } from "./components/ExpensesSection";
import { FinalCalculations } from "./components/FinalCalculations";

// types
import type { PreviousDayData } from "@/types/types";

// lib
import { formatFullDateTime, formatTime } from "@/lib/date";
import { TypographyH1, TypographyP } from "@/components/ui/typography";
import { Spinner } from "@/components/ui/spinner";

export default function SalesPage() {
    const router = useRouter();

    const [previousDayData, setPreviousDayData] =
        useState<PreviousDayData | null>(null);
    const [baseMorningBalance, setBaseMorningBalance] = useState(0);
    const { totalCashRegister, setTotalCashRegister } = useLocalStorageDraft();

    const [newBalanceAmount, setNewBalanceAmount] = useState("");
    const [newBalanceCategory, setNewBalanceCategory] = useState("");
    const [showDebtors, setShowDebtors] = useState(false);
    const [showSuppliers, setShowSuppliers] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        additionalBalances,
        setAdditionalBalances,
        actualEveningBalance,
        setActualEveningBalance,
        expenseItems,
        lastSaved,
        hasUnsavedChanges,
        loadDraft,
        saveDraft,
        clearDraft,
        addBalanceItem,
        removeBalanceItem,
        addExpenseItem,
        removeExpenseItem,
    } = useLocalStorageDraft();

    const handleError = useCallback((errorMessage: string) => {
        setError(errorMessage);
        setTimeout(() => setError(null), 3000);
    }, []);

    const {
        debtors,
        fetchDebtors,
        addDebtor,
        updateDebtor,
        writeOffDebtor,
        // deleteDebtor,
        loading: loadingDebtors,
    } = useDebtors();

    const { suppliers, fetchSuppliers } = useSuppliers(handleError);

    const {
        deliveries,
        addDelivery,
        updateDelivery,
        deleteDelivery,
        loading: loadingDeliveries,
        fetchDeliveries,
    } = useSupplierDeliveries();

    // Загрузка утреннего баланса и данных предыдущего дня
    useEffect(() => {
        const fetchMorningBalance = async () => {
            try {
                const res = await fetch(`/api/shift?isClosed=false`);
                if (!res.ok) throw new Error("Не вдалося отримати зміну");

                const data = await res.json();

                if (data.length > 0 && data[0].openingBalance !== null) {
                    setBaseMorningBalance(data[0].openingBalance);
                    setPreviousDayData({
                        date: formatFullDateTime(data[0].openedAt) ?? undefined,
                        actualEveningBalance:
                            data[0].openingBalance ?? undefined,
                    });
                } else {
                    setBaseMorningBalance(0);
                }

                loadDraft();
            } catch (err) {
                console.error("Помилка при отриманні зміни:", err);
                setBaseMorningBalance(0);
                loadDraft();
            }
        };

        fetchMorningBalance();
    }, [loadDraft]);

    // Загрузка должников
    useEffect(() => {
        fetchDebtors();
    }, [fetchDebtors]);

    // Завантаження постачальників
    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    // Завантаження операцій постачальників
    useEffect(() => {
        fetchDeliveries();
    }, [fetchDeliveries]);

    // Автоматическое сохранение драфта
    useEffect(() => {
        if (!hasUnsavedChanges) return;

        const timeout = setTimeout(() => {
            saveDraft();
        }, 1000);

        return () => clearTimeout(timeout);
    }, [hasUnsavedChanges, saveDraft]);

    // Добавление дополнительного баланса из поля ввода
    const handleAddBalance = () => {
        if (!newBalanceAmount || Number(newBalanceAmount) <= 0) {
            handleError("Будь ласка, введіть коректну суму");
            return;
        }
        // TODO: category check
        addBalanceItem(Number(newBalanceAmount), String(newBalanceCategory));
        setNewBalanceAmount("");
        setNewBalanceCategory("");
    };

    // Итоговые вычисления
    const totalExpenses = expenseItems.reduce(
        (sum, item) => sum + item.amount,
        0
    );
    const totalAdditionalBalance = additionalBalances.reduce(
        (sum, item) => sum + item.amount,
        0
    );
    const totalMorningBalance = baseMorningBalance + totalAdditionalBalance;
    const calculatedEveningBalance =
        totalMorningBalance + totalCashRegister - totalExpenses;
    const actualBalance = actualEveningBalance
        ? Number(actualEveningBalance)
        : null;
    const difference =
        actualBalance !== null ? calculatedEveningBalance - actualBalance : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (actualEveningBalance === "" || actualEveningBalance === null) {
            handleError("Вкажіть фактичний залишок на вечір перед збереженням");
            setLoading(false);
            return;
        }

        try {
            // агрегуємо витрати по категоріях
            const breakdown = expenseItems.reduce(
                (acc, item) => {
                    if (!acc[item.category]) {
                        acc[item.category] = 0;
                    }
                    acc[item.category] += item.amount;
                    return acc;
                },
                {
                    terminalExpenses: 0,
                    ownerWithdrawal: 0,
                    rent: 0,
                    utilities: 0,
                    goodsWriteOff: 0,
                    supplierPayments: 0,
                    salaries: 0,
                    piggyBank: 0,
                    otherExpenses: 0,
                } as Record<string, number>
            );

            const reportData = {
                additionalBalance: totalAdditionalBalance,
                totalCashRegister,
                actualClosingBalance:
                    actualEveningBalance !== null &&
                    actualEveningBalance !== undefined
                        ? Number(actualEveningBalance)
                        : null,
                breakdown,
            };

            const res = await fetch("/api/shift/close", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reportData),
            });

            if (!res.ok) {
                const closeErr = await res.json();
                console.error("Помилка при закритті зміни:", closeErr);
                throw new Error("Звіт збережено, але не вдалося закрити зміну");
            }

            clearDraft();

            router.push("/shift");
        } catch (err) {
            const error = err instanceof Error ? err.message : String(err);
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-4">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center gap-2">
                            <Calculator className="h-8 w-8 text-green-600" />
                            <TypographyH1 className="text-3xl font-bold">
                                Звіт за зміну
                            </TypographyH1>
                        </CardTitle>
                        <CardDescription>
                            <TypographyP>
                                Ведення обліку доходів та витрат за робочу зміну
                            </TypographyP>

                            <div className="flex items-center justify-center">
                                {hasUnsavedChanges ? (
                                    <TypographyP className="flex items-center gap-1 text-orange-600">
                                        <AlertCircle className="h-4 w-4" />
                                        Незбережені зміни
                                    </TypographyP>
                                ) : (
                                    <TypographyP className="flex items-center gap-1 text-green-600">
                                        <Clock className="h-4 w-4" />
                                        Останнє збереження:{" "}
                                        {lastSaved ? formatTime(lastSaved) : ""}
                                    </TypographyP>
                                )}
                            </div>
                        </CardDescription>
                    </CardHeader>
                </Card>

                {/* Quick Stats */}
                <QuickStats
                    totalMorningBalance={totalMorningBalance}
                    totalCashRegister={totalCashRegister}
                    totalExpenses={totalExpenses}
                    calculatedEveningBalance={calculatedEveningBalance}
                />

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                        type="button"
                        onClick={() => setShowDebtors(!showDebtors)}
                        variant={showDebtors ? "default" : "outline"}
                        className="h-12 rounded-xl shadow-sm"
                    >
                        <Users />
                        Боржники (
                        {debtors.filter((d) => d.currentDebt > 0).length})
                    </Button>

                    <Button
                        type="button"
                        onClick={() => setShowSuppliers(!showSuppliers)}
                        variant={showSuppliers ? "default" : "outline"}
                        className="h-12 rounded-xl shadow-sm"
                    >
                        <Truck />
                        <div>
                            Постачальники (
                            {deliveries.filter((d) => d.debt > 0).length})
                        </div>
                    </Button>
                </div>

                {/* Debtors Section */}
                {showDebtors && (
                    <DebtorsSection
                        debtors={debtors}
                        loadingDebtors={loadingDebtors}
                        onAddDebtor={addDebtor}
                        onUpdateDebtor={updateDebtor}
                        onWriteOffDebtor={writeOffDebtor}
                        // onDeleteDebtor={deleteDebtor}
                        onError={handleError}
                        setAdditionalBalances={setAdditionalBalances}
                    />
                )}

                {/* Suppliers Section */}
                {showSuppliers && (
                    <SuppliersSection
                        suppliers={suppliers}
                        deliveries={deliveries}
                        onAddDelivery={addDelivery}
                        onUpdateDelivery={updateDelivery}
                        onDeleteDelivery={deleteDelivery}
                        loadingDeliveries={loadingDeliveries}
                        onAddExpense={addExpenseItem}
                        onError={handleError}
                    />
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Balance and Cash Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Morning Balance */}
                        <MorningBalance
                            baseMorningBalance={baseMorningBalance}
                            additionalBalances={additionalBalances}
                            newBalanceAmount={newBalanceAmount}
                            onNewBalanceAmountChange={setNewBalanceAmount}
                            newBalanceCategory={newBalanceCategory}
                            onNewBalanceCategoryChange={setNewBalanceCategory}
                            onAddBalance={handleAddBalance}
                            onRemoveBalance={removeBalanceItem}
                            totalMorningBalance={totalMorningBalance}
                            previousDayInfo={previousDayData}
                        />

                        {/* Daily Cash Register */}
                        <CashRegister
                            totalCashRegister={totalCashRegister}
                            onTotalCashRegisterChange={setTotalCashRegister}
                        />
                    </div>

                    {/* Expenses Section */}
                    <ExpensesSection
                        expenseItems={expenseItems}
                        onAddExpense={addExpenseItem}
                        onRemoveExpense={removeExpenseItem}
                        onError={handleError}
                        totalExpenses={totalExpenses}
                    />

                    {/* Final Calculations */}
                    <FinalCalculations
                        calculatedEveningBalance={calculatedEveningBalance}
                        actualEveningBalance={actualEveningBalance}
                        onActualEveningBalanceChange={setActualEveningBalance}
                        actualBalance={actualBalance}
                        difference={difference}
                    />

                    {/* Alerts */}
                    {error && (
                        <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-50 space-y-2 w-full max-w-md">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle />
                                    <AlertDescription className="text-red-700">
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}

                    <Button
                        type="submit"
                        size="lg"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? (
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
