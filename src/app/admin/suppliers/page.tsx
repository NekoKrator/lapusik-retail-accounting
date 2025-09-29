"use client";

import type { Supplier } from "@/types/types";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SupplierPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    const [newSupplierName, setNewSupplierName] = useState("");
    const [newSupplierDebt, setNewSupplierDebt] = useState("0");

    useEffect(() => {
        fetchSuppliers();
    }, []);

    async function fetchSuppliers() {
        try {
            const res = await fetch("/api/admin/suppliers");

            if (!res.ok) {
                throw new Error("Failed to load suppliers");
            }

            const data = await res.json();
            const suppliers: Supplier[] = data.map((s: Supplier) => ({
                ...s,
                totalDebt: Number(s.totalDebt),
            }));

            setSuppliers(suppliers);
        } catch (error) {
            console.log(error);
        }
    }

    async function addSupplier() {
        try {
            const res = await fetch("/api/admin/suppliers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newSupplierName,
                    totalDebt: parseFloat(newSupplierDebt) || 0,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to add supplier");
            }

            setNewSupplierName("");
            setNewSupplierDebt("0");
            await fetchSuppliers();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Постачальники</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Назва</th>
                                <th className="px-4 py-2 text-right">Борг</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map(({ id, name, totalDebt }) => (
                                <tr key={id} className="border-t">
                                    <td className="px-4 py-2">{name}</td>
                                    <td className="px-4 py-2 text-right">
                                        {totalDebt.toFixed(2)} ₴
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <h2 className="mt-6">Додати нового постачальника</h2>
                <div className="flex gap-2 mt-2">
                    <input
                        type="text"
                        placeholder="Назва постачальника"
                        value={newSupplierName}
                        onChange={(e) => setNewSupplierName(e.target.value)}
                        className="border rounded px-2 py-1 flex-1"
                    />
                    <input
                        type="number"
                        placeholder="Заборгованість"
                        value={newSupplierDebt}
                        onChange={(e) => setNewSupplierDebt(e.target.value)}
                        step="0.01"
                        min="0"
                        className="border rounded px-2 py-1 w-32"
                    />
                    <button
                        onClick={addSupplier}
                        className="bg-blue-600 text-white px-4 py-1 rounded"
                    >
                        Додати
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
