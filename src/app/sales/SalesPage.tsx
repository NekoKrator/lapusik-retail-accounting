"use client";

// hooks
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useLocalStorageDraft } from "@/app/hooks/useLocalStorageDraft";
import { useDebtors } from "@/app/hooks/useDebtors";
import { useSuppliers } from "@/app/hooks/useSuppliers";
import { useSupplierPayments } from "@/app/hooks/useSupplierPayments";

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
import { DebtorsSection } from "./components/DebtorsSection";
import { SuppliersSection } from "./components/SuppliersSection";
import { MorningBalance } from "./components/MorningBalance";
import { CashRegister } from "./components/CashRegister";
import { ExpensesSection } from "./components/ExpensesSection";
import { FinalCalculations } from "./components/FinalCalculations";

// types
import type { PreviousDayData } from "@/types/types";

// lib
import { formatLastSaved } from "@/lib/date";

export default function SalesPage() {
    const { data: session } = useSession();

    const [previousDayData, setPreviousDayData] =
        useState<PreviousDayData | null>(null);
    const [baseMorningBalance, setBaseMorningBalance] = useState(0);
    const { totalCashRegister, setTotalCashRegister } = useLocalStorageDraft();

    const [newBalanceAmount, setNewBalanceAmount] = useState("");
    const [showDebtors, setShowDebtors] = useState(false);
    const [showSuppliers, setShowSuppliers] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

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
        removeDebtor,
        addOrUpdateDebtor,
    } = useDebtors(handleError);

    const { suppliers, fetchSuppliers } = useSuppliers(handleError);

    const {
        supplierPayments,
        fetchSupplierPayments,
        addSupplierPayments,
        removeSupplierPayments,
    } = useSupplierPayments(handleError);

    // Загрузка утреннего баланса и данных предыдущего дня
    useEffect(() => {
        if (!session?.user?.id) return;

        const fetchMorningBalance = async () => {
            const today = new Date().toISOString().split("T")[0];
            try {
                const res = await fetch(
                    `/api/daily-reports/suggested-morning-balance?userId=${session.user.id}&date=${today}`
                );
                if (!res.ok) throw new Error("Failed to fetch morning balance");
                const data = await res.json();

                setBaseMorningBalance(data.suggestedMorningBalance || 0);

                setPreviousDayData({
                    date: new Date(Date.now() - 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split("T")[0],
                    actualEveningBalance:
                        data.actualEveningBalance ?? undefined,
                    calculatedEveningBalance:
                        data.calculatedEveningBalance ??
                        data.suggestedMorningBalance ??
                        0,
                });

                loadDraft();
            } catch (err) {
                console.error(err);
                setBaseMorningBalance(0);
                setPreviousDayData(null);

                loadDraft();
            }
        };

        fetchMorningBalance();
    }, [session, loadDraft]);

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
        fetchSupplierPayments();
    }, [fetchSupplierPayments]);

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
        addBalanceItem(Number(newBalanceAmount));
        setNewBalanceAmount("");
    };

    async function writeOffDebt(debtorId: string, amount: number) {
        try {
            const response = await fetch(`/api/debtors/${debtorId}/writeoff`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Failed to write off debt"
                );
            }

            const data = await response.json();
            const { updatedDebtor, amountWrittenOff } = data;

            setAdditionalBalances((prev) => [
                ...prev,
                {
                    id: `writeoff-${debtorId}-${Date.now()}`,
                    amount: amountWrittenOff,
                },
            ]);

            addOrUpdateDebtor(updatedDebtor);

            return updatedDebtor;
        } catch (error) {
            throw error;
        }
    }

    // Удаление должника с добавлением его долга в additionalBalances
    const handleRemoveDebtor = async (id: string) => {
        try {
            const debtorToRemove = debtors.find((d) => d.id === id);
            if (!debtorToRemove) {
                handleError("Боржник не знайден");
                return;
            }

            await removeDebtor(id);

            setAdditionalBalances((prev) => [
                ...prev,
                {
                    id: `debtor-${debtorToRemove.id}`,
                    amount: debtorToRemove.amount,
                },
            ]);
        } catch (error) {
            handleError(
                error instanceof Error ? error.message : "Невідома помилка"
            );
        }
    };

    // Поставщики
    // const addSupplier = (supplier: Omit<SupplierItem, "id">) => {
    //     const item: SupplierItem = {
    //         id: Date.now().toString(),
    //         ...supplier,
    //     };
    //     setSupplierItems((prev) => [...prev, item]);
    // };

    // const removeSupplier = (id: string) => {
    //     setSupplierItems((prev) => prev.filter((item) => item.id !== id));
    // };

    // Итоговые вычисления
    const totalExpenses = expenseItems.reduce(
        (sum, item) => sum + item.amount,
        0
    );
    const totalMorningBalance =
        baseMorningBalance +
        additionalBalances.reduce((sum, item) => sum + item.amount, 0);
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
        setSuccess(null);
        setLoading(true);

        if (!session?.user) {
            setError("Не авторизовано");
            setLoading(false);
            return;
        }

        try {
            const reportData = {
                date: new Date().toISOString().split("T")[0],
                userId: session.user.id,
                morningBalance: totalMorningBalance,
                totalCashRegister,
                breakdown: {
                    terminalExpenses: 0,
                    ownerWithdrawal: 0,
                    rent: 0,
                    utilities: 0,
                    goodsWriteOff: 0,
                    supplierPayments: 0,
                    salaries: 0,
                    piggyBank: 0,
                    otherExpenses: 0,
                },
                actualEveningBalance: actualEveningBalance
                    ? Number(actualEveningBalance)
                    : null,
            };

            const res = await fetch("/api/daily-reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reportData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(
                    errorData.error || "Помилка при збереженні звіту"
                );
            }

            setSuccess("Звіт успішно збережено!");
            clearDraft();
            setNewBalanceAmount("");
            setTotalCashRegister(0);
        } catch (err) {
            const error = err instanceof Error ? err.message : String(err);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 p-4">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
                            <Calculator className="h-8 w-8 text-green-600" />
                            Звіт за зміну
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Ведення обліку доходів та витрат за робочу зміну
                        </CardDescription>

                        {/* Индикатор сохранения */}
                        <div className="flex items-center justify-center gap-4 mt-2 text-sm">
                            {lastSaved && (
                                <div className="flex items-center gap-1 text-green-600">
                                    <Clock className="h-4 w-4" />
                                    <span>
                                        Останнє збереження:{" "}
                                        {formatLastSaved(lastSaved)}
                                    </span>
                                </div>
                            )}
                            {hasUnsavedChanges && (
                                <div className="flex items-center gap-1 text-orange-600">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>Незбережені зміни</span>
                                </div>
                            )}
                        </div>
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
                        variant={showDebtors ? "dark" : "outline"}
                        className="h-12 font-medium"
                    >
                        <Users className="h-5 w-5 mr-2" />
                        Боржники ({debtors.length})
                    </Button>

                    <Button
                        type="button"
                        onClick={() => setShowSuppliers(!showSuppliers)}
                        variant={showSuppliers ? "dark" : "outline"}
                        className="h-12 font-medium"
                    >
                        <Truck className="h-5 w-5 mr-2" />
                        Постачальники ({supplierPayments.length})
                    </Button>
                </div>

                {/* Debtors Section */}
                {showDebtors && (
                    <DebtorsSection
                        debtors={debtors}
                        onAddDebtor={addDebtor}
                        onRemoveDebtor={handleRemoveDebtor}
                        onWriteOffDebtor={writeOffDebt}
                        onError={handleError}
                    />
                )}

                {/* Suppliers Section */}
                {showSuppliers && (
                    <SuppliersSection
                        suppliers={suppliers}
                        supplierItems={supplierPayments}
                        onAddSupplier={addSupplierPayments}
                        onRemoveSupplier={removeSupplierPayments}
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
                        <Alert
                            variant="destructive"
                            className="bg-red-50 border-red-200"
                        >
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-red-700">
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert className="bg-green-50 border-green-200">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-700">
                                {success}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
                    >
                        {loading ? (
                            <>
                                <Calculator className="mr-2 h-4 w-4 animate-spin" />
                                Збереження...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Зберегти звіт
                            </>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
