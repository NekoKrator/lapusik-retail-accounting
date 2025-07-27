import { useState, useCallback, useEffect } from 'react'
import type { ExpenseItem } from '@/types/types'

export function useLocalStorageDraft() {
  const LOCAL_STORAGE_KEY = 'sales-page-draft';

  const [baseMorningBalance, setBaseMorningBalance] = useState(0);
  const [additionalBalances, setAdditionalBalances] = useState<{ id: string; amount: number }[]>([]);
  const [totalCashRegister, setTotalCashRegister] = useState(0);
  const [actualEveningBalance, setActualEveningBalance] = useState('');
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const loadDraft = useCallback(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return false;

      const parsed = JSON.parse(raw);

      if (parsed.baseMorningBalance !== undefined) setBaseMorningBalance(parsed.baseMorningBalance);
      if (parsed.additionalBalances) setAdditionalBalances(parsed.additionalBalances);
      if (parsed.totalCashRegister) setTotalCashRegister(parsed.totalCashRegister);
      if (parsed.actualEveningBalance) setActualEveningBalance(parsed.actualEveningBalance);
      if (parsed.expenseItems) setExpenseItems(parsed.expenseItems);
      if (parsed.lastSaved) setLastSaved(parsed.lastSaved);

      setHasUnsavedChanges(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const saveDraft = useCallback(() => {
    const draft = {
      baseMorningBalance,
      additionalBalances,
      totalCashRegister,
      actualEveningBalance,
      expenseItems,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draft));
    setLastSaved(draft.lastSaved);
    setHasUnsavedChanges(false);
  }, [baseMorningBalance, additionalBalances, totalCashRegister, actualEveningBalance, expenseItems]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setBaseMorningBalance(0);
    setAdditionalBalances([]);
    setTotalCashRegister(0);
    setActualEveningBalance('');
    setExpenseItems([]);
    setLastSaved(null);
    setHasUnsavedChanges(false);
  }, []);

  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [baseMorningBalance, additionalBalances, totalCashRegister, actualEveningBalance, expenseItems]);

  return {
    baseMorningBalance,
    setBaseMorningBalance,
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
  };
}
