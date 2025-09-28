import { useState, useCallback } from "react";
import type { Supplier } from "@/types/types";

export function useSuppliers(handleError: (msg: string) => void) {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    const fetchSuppliers = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/suppliers");
            if (!res.ok) throw new Error("Failed to fetch suppliers");
            const data = await res.json();
            setSuppliers(data);
        } catch {
            handleError("Не вдалося завантажити постачальників");
        }
    }, [handleError]);

    return {
        suppliers,
        fetchSuppliers,
    };
}
