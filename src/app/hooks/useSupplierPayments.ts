import { useState, useCallback } from "react";
import type { SupplierItem } from "@/types/types";

export function useSupplierPayments(handleError: (msg: string) => void) {
    const [supplierPayments, setPayments] = useState<SupplierItem[]>([]);

    const fetchSupplierPayments = useCallback(async () => {
        try {
            const res = await fetch("/api/supplierPayments");
            if (!res.ok) throw new Error("Failed to fetch suppliers");
            const data: SupplierItem[] = await res.json();

            const normalized = data.map((d) => ({
                ...d,
                date: new Date(d.date),
            }));

            setPayments(normalized);
        } catch {
            handleError("Не вдалося завантажити постачальників");
        }
    }, [handleError]);

    const addOrUpdatePayment = useCallback((newPayment: SupplierItem) => {
        if (!newPayment) {
            console.warn("addOrUpdatePayment called with undefined or null");
            return;
        }
        setPayments((prev) => {
            const idx = prev.findIndex((d) => d.id === newPayment.id);
            if (idx !== -1) {
                const updated = [...prev];
                updated[idx] = newPayment;
                return updated;
            }
            return [...prev, newPayment];
        });
    }, []);

    const addSupplierPayments = useCallback(
        async (supplierPayment: Omit<SupplierItem, "id">) => {
            try {
                const res = await fetch("/api/supplierPayments", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...supplierPayment,
                        date: new Date().toISOString().split("T")[0],
                    }),
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(
                        err.error ||
                            "Помилка при створенні сплати постачальнику"
                    );
                }
                const created = await res.json();
                addOrUpdatePayment({
                    ...created,
                    date: new Date(created.date),
                });
            } catch (error) {
                handleError(
                    error instanceof Error ? error.message : "Невідома помилка"
                );
            }
        },
        [addOrUpdatePayment, handleError]
    );

    const updateSupplierPayment = useCallback(
        async (id: string, updates: Partial<SupplierItem>) => {
            try {
                const res = await fetch(`/api/supplierPayments/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updates),
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(
                        err.error ||
                            "Помилка при оновленні сплати постачальнику"
                    );
                }
                const updated = await res.json();
                addOrUpdatePayment({
                    ...updated,
                    date: new Date(updated.date),
                });
            } catch (error) {
                handleError(
                    error instanceof Error ? error.message : "Невідома помилка"
                );
            }
        },
        [addOrUpdatePayment, handleError]
    );

    const removeSupplierPayments = useCallback(
        async (id: string) => {
            try {
                const res = await fetch(`/api/supplierPayments/${id}`, {
                    method: "DELETE",
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(
                        err.error ||
                            "Помилка при видаленні сплати постачальнику"
                    );
                }
                setPayments((prev) => prev.filter((d) => d.id !== id));
            } catch (error) {
                handleError(
                    error instanceof Error ? error.message : "Невідома помилка"
                );
            }
        },
        [handleError]
    );

    return {
        supplierPayments,
        fetchSupplierPayments,
        addSupplierPayments,
        updateSupplierPayment,
        removeSupplierPayments,
    };
}
