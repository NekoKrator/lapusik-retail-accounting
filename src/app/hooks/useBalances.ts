import { useState } from "react";
import type { ExpenseItem } from "@/types/types";

export function useBalances() {
    const [additionalBalances, setAdditionalBalances] = useState<
        { id: string; amount: number }[]
    >([]);
    const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    const addBalanceItem = (amountStr: string) => {
        if (!amountStr || Number(amountStr) <= 0) {
            setError("Будь ласка, введіть коректну суму");
            return;
        }
        const item = { id: Date.now().toString(), amount: Number(amountStr) };
        setAdditionalBalances((prev) => [...prev, item]);
        setError(null);
    };

    const removeBalanceItem = (id: string) => {
        setAdditionalBalances((prev) => prev.filter((item) => item.id !== id));
    };

    const addExpenseItem = (expense: Omit<ExpenseItem, "id">) => {
        const item: ExpenseItem = { id: Date.now().toString(), ...expense };
        setExpenseItems((prev) => [...prev, item]);
    };

    const removeExpenseItem = (id: string) => {
        setExpenseItems((prev) => prev.filter((item) => item.id !== id));
    };

    return {
        additionalBalances,
        expenseItems,
        error,
        setError,
        addBalanceItem,
        removeBalanceItem,
        addExpenseItem,
        removeExpenseItem,
    };
}
