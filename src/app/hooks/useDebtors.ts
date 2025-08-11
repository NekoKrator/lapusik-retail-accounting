import { useState, useCallback } from 'react';
import type { DebtorItem } from '@/types/types';

export function useDebtors(handleError: (msg: string) => void) {
  const [debtors, setDebtors] = useState<DebtorItem[]>([]);

  const fetchDebtors = useCallback(async () => {
    try {
      const res = await fetch('/api/debtors');
      if (!res.ok) throw new Error('Failed to fetch debtors');
      const data = await res.json();
      setDebtors(data);
    } catch {
      handleError('Не вдалося завантажити боржників');
    }
  }, [handleError]);

  const addOrUpdateDebtor = useCallback((newDebtor: DebtorItem) => {
    if (!newDebtor) {
      console.warn('addOrUpdateDebtor called with undefined or null');
      return;
    }
    setDebtors((prev) => {
      const idx = prev.findIndex((d) => d.id === newDebtor.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = newDebtor;
        return updated;
      }
      return [...prev, newDebtor];
    });
  }, []);

  const addDebtor = useCallback(
    async (debtor: Omit<DebtorItem, 'id'>) => {
      try {
        const res = await fetch('/api/debtors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...debtor,
            date: new Date().toISOString().split('T')[0],
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Помилка при створенні боржника');
        }
        const created = await res.json();
        addOrUpdateDebtor(created);
      } catch (error) {
        handleError(
          error instanceof Error ? error.message : 'Невідома помилка'
        );
      }
    },
    [addOrUpdateDebtor, handleError]
  );

  const removeDebtor = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/debtors/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Помилка при видаленні боржника');
        }
        setDebtors((prev) => prev.filter((d) => d.id !== id));
      } catch (error) {
        handleError(
          error instanceof Error ? error.message : 'Невідома помилка'
        );
      }
    },
    [handleError]
  );

  return {
    debtors,
    fetchDebtors,
    addDebtor,
    removeDebtor,
    addOrUpdateDebtor,
  };
}
