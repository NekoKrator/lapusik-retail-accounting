import { useState, useCallback, useEffect, useRef } from "react";
import type { ExpenseItem } from "@/types/types";

export function useLocalStorageDraft() {
    const LOCAL_STORAGE_KEY = "sales-page-draft";
    const [additionalBalances, setAdditionalBalances] = useState<
        { id: string; amount: number }[]
    >([]);
    const [totalCashRegister, setTotalCashRegister] = useState(0);
    const [actualEveningBalance, setActualEveningBalance] = useState("");
    const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
    const [lastSaved, setLastSaved] = useState<string | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const isInitialLoad = useRef(true);
    const isMounted = useRef(false);

    const loadDraft = useCallback(() => {
        if (typeof window === "undefined") return false;

        try {
            console.log("Loading draft from localStorage...");
            const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
            console.log("Raw data from localStorage:", raw);

            if (!raw) {
                console.log("No draft found in localStorage");
                return false;
            }

            const parsed = JSON.parse(raw);
            console.log("Parsed data:", parsed);

            const today = new Date().toISOString().split("T")[0];

            if (parsed.date && parsed.date !== today) {
                console.log("Draft is from different day, removing...");
                localStorage.removeItem(LOCAL_STORAGE_KEY);
                return false;
            }

            isInitialLoad.current = true;

            if (parsed.additionalBalances) {
                console.log(
                    "Setting additionalBalances:",
                    parsed.additionalBalances
                );
                setAdditionalBalances(parsed.additionalBalances);
            }
            if (typeof parsed.totalCashRegister === "number") {
                console.log(
                    "Setting totalCashRegister:",
                    parsed.totalCashRegister
                );
                setTotalCashRegister(parsed.totalCashRegister);
            }
            if (parsed.actualEveningBalance) {
                console.log(
                    "Setting actualEveningBalance:",
                    parsed.actualEveningBalance
                );
                setActualEveningBalance(parsed.actualEveningBalance);
            }
            if (parsed.expenseItems) {
                console.log("Setting expenseItems:", parsed.expenseItems);
                setExpenseItems(parsed.expenseItems);
            }
            if (parsed.lastSaved) {
                setLastSaved(parsed.lastSaved);
            }

            setHasUnsavedChanges(false);

            isInitialLoad.current = false;

            console.log("Draft loaded successfully");
            return true;
        } catch (error) {
            console.error("Error loading draft:", error);
            return false;
        }
    }, []);

    useEffect(() => {
        isMounted.current = true;
        loadDraft();
        isInitialLoad.current = false;
        return () => {
            isMounted.current = false;
        };
    }, [loadDraft]);

    const saveDraft = useCallback(() => {
        if (
            typeof window === "undefined" ||
            isInitialLoad.current ||
            !isMounted.current
        ) {
            console.log(
                "Skipping save - window undefined, initial load, or not mounted"
            );
            return;
        }

        try {
            const today = new Date().toISOString().split("T")[0];
            const now = new Date().toISOString();

            const draft = {
                additionalBalances,
                totalCashRegister,
                actualEveningBalance,
                expenseItems,
                lastSaved: now,
                date: today,
            };

            console.log("Saving draft to localStorage:", draft);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draft));
            setLastSaved(now);
            setHasUnsavedChanges(false);

            console.log("Draft saved successfully to localStorage");
        } catch (error) {
            console.error("Error saving draft:", error);
        }
    }, [
        additionalBalances,
        totalCashRegister,
        actualEveningBalance,
        expenseItems,
    ]);

    const clearDraft = useCallback(() => {
        if (typeof window === "undefined") return;

        try {
            console.log("Clearing draft from localStorage...");
            localStorage.removeItem(LOCAL_STORAGE_KEY);

            isInitialLoad.current = true;

            setAdditionalBalances([]);
            setTotalCashRegister(0);
            setActualEveningBalance("");
            setExpenseItems([]);
            setLastSaved(null);
            setHasUnsavedChanges(false);

            setTimeout(() => {
                isInitialLoad.current = false;
            }, 100);

            console.log("Draft cleared successfully");
        } catch (error) {
            console.error("Error clearing draft:", error);
        }
    }, []);

    useEffect(() => {
        if (isInitialLoad.current || !isMounted.current) {
            return;
        }

        console.log("State changed, marking as unsaved changes");
        setHasUnsavedChanges(true);
    }, [
        additionalBalances,
        totalCashRegister,
        actualEveningBalance,
        expenseItems,
    ]);

    useEffect(() => {
        if (!hasUnsavedChanges) return;

        console.log("Auto-saving in 1 second...");
        const timeout = setTimeout(() => {
            saveDraft();
        }, 1000);

        return () => {
            console.log("Clearing auto-save timeout");
            clearTimeout(timeout);
        };
    }, [hasUnsavedChanges, saveDraft]);

    const addBalanceItem = (amount: number) => {
        if (amount <= 0) return;
        setAdditionalBalances((prev) => [
            ...prev,
            { id: Date.now().toString(), amount },
        ]);
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
        setAdditionalBalances,
        totalCashRegister,
        setTotalCashRegister,
        actualEveningBalance,
        setActualEveningBalance,
        expenseItems,
        setExpenseItems,
        lastSaved,
        hasUnsavedChanges,
        loadDraft,
        saveDraft,
        clearDraft,
        addBalanceItem,
        removeBalanceItem,
        addExpenseItem,
        removeExpenseItem,
    };
}
