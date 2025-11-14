"use client";

import { User } from "@/types/types";
import { useCallback, useState } from "react";

export type Supplier = {
    id: string;
    name: string;
};

export type SupplierDelivery = {
    id: string;
    supplierId: string;
    supplier?: Supplier;
    userId: string;
    user?: User;

    totalPrice: number;
    paidByCashier: number;
    paidByOwner: number;
    debt: number;

    createdAt: string;
    updatedAt: string;
};

export type CreateDeliveryInput = {
    supplierId: string;
    totalPrice: number;
    paidByCashier?: number;
    paidByOwner?: number;
};

export type UpdateDeliveryInput = {
    id: string;
    paidByCashier?: number;
    paidByOwner?: number;
    debt?: number;
};

export function useSupplierDeliveries() {
    const [deliveries, setDeliveries] = useState<SupplierDelivery[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDeliveries = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/supplier-deliveries");
            if (!res.ok) throw new Error("Не вдалося завантажити поставки");

            const data: SupplierDelivery[] = await res.json();
            setDeliveries(data);
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
        await fetchDeliveries();
        setRefreshing(false);
    }, [fetchDeliveries]);

    const addDelivery = useCallback(async (data: CreateDeliveryInput) => {
        try {
            setError(null);

            const res = await fetch("/api/supplier-deliveries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const body = await res.json();
                throw new Error(body.error || "Помилка створення поставки");
            }

            const newDelivery: SupplierDelivery = await res.json();
            setDeliveries((prev) => [newDelivery, ...prev]);
            return newDelivery;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Помилка створення");
            throw err;
        }
    }, []);

    const updateDelivery = useCallback(
        async ({ id, ...data }: UpdateDeliveryInput) => {
            try {
                setError(null);

                const res = await fetch(`/api/supplier-deliveries/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });

                if (!res.ok) {
                    const body = await res.json();
                    throw new Error(body.error || "Помилка оновлення поставки");
                }

                const updated: SupplierDelivery = await res.json();

                setDeliveries((prev) =>
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

    const deleteDelivery = useCallback(async (id: string) => {
        try {
            setError(null);

            const res = await fetch(`/api/supplier-deliveries/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const body = await res.json();
                throw new Error(body.error || "Помилка видалення поставки");
            }

            setDeliveries((prev) => prev.filter((d) => d.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Помилка видалення");
            throw err;
        }
    }, []);

    return {
        deliveries,
        loading,
        refreshing,
        error,
        addDelivery,
        updateDelivery,
        deleteDelivery,
        fetchDeliveries,
        refresh,
    };
}
