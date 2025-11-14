import { User } from "@/types/types";
import { useState, useCallback } from "react";

export type DebtorItem = {
    id: string;
    name: string;
    currentDebt: number;
    totalDebt: number;

    userId: string;
    user?: User;

    createdAt: Date;
    updatedAt: Date;
};

export type CreateDebtorInput = {
    name: string;
    currentDebt: number;
};

export type UpdateDeliveryInput = {
    id: string;
    currentDebt?: number;
    totalDebt?: number;
};

export function useDebtors() {
    const [debtors, setDebtors] = useState<DebtorItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDebtors = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/debtors");
            if (!res.ok) throw new Error("Не вдалося завантажити боржників");

            const data: DebtorItem[] = await res.json();
            setDebtors(data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Помилка завантаження"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    const refresh = useCallback(async () => {
        setRefreshing(true);
        await fetchDebtors();
        setRefreshing(false);
    }, [fetchDebtors]);

    const addDebtor = useCallback(async (data: CreateDebtorInput) => {
        try {
            setError(null);

            const res = await fetch("/api/debtors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const body = await res.json();
                throw new Error(body.error || "Помилка при створенні боржника");
            }

            const newDebtor: DebtorItem = await res.json();

            setDebtors((prev) => {
                const idx = prev.findIndex((d) => d.id === newDebtor.id);
                if (idx !== -1) {
                    const updated = [...prev];
                    updated[idx] = newDebtor;
                    return updated;
                }
                return [...prev, newDebtor];
            });

            return newDebtor;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Помилка створення");
            throw err;
        }
    }, []);

    const updateDebtor = useCallback(
        async ({ id, ...data }: UpdateDeliveryInput) => {
            try {
                setError(null);

                const res = await fetch(`/api/debtors/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });

                if (!res.ok) {
                    const body = await res.json();
                    throw new Error(body.error || "Помилка оновлення боржника");
                }

                const updated: DebtorItem = await res.json();

                setDebtors((prev) =>
                    prev.map((d) => (d.id === id ? { ...d, ...updated } : d))
                );

                return updated;
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Помилка оновлення"
                );
                throw err;
            }
        },
        []
    );

    const writeOffDebtor = useCallback(
        async ({ id, ...data }: UpdateDeliveryInput) => {
            try {
                setError(null);

                const res = await fetch(`/api/debtors/${id}/writeoff`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });

                if (!res.ok) {
                    const body = await res.json();
                    throw new Error(body.error || "Помилка списання боргу");
                }

                const updated: DebtorItem = await res.json();

                setDebtors((prev) =>
                    prev.map((d) => (d.id === id ? { ...d, ...updated } : d))
                );

                return updated;
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Помилка оновлення"
                );
                throw err;
            }
        },
        []
    );

    const deleteDebtor = useCallback(async (id: string) => {
        try {
            setError(null);

            const res = await fetch(`/api/debtors/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const body = await res.json();
                throw new Error(body.error || "Помилка видалення боржника");
            }

            setDebtors((prev) => prev.filter((d) => d.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Помилка видалення");
            throw err;
        }
    }, []);

    return {
        debtors,
        loading,
        refreshing,
        error,
        fetchDebtors,
        addDebtor,
        updateDebtor,
        writeOffDebtor,
        deleteDebtor,
        refresh,
    };
}
