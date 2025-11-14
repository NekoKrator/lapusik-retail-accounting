"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Truck } from "lucide-react";
import { DataTable } from "./data-table";
import { columns, SupplierStats } from "./columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyH3 } from "@/components/ui/typography";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { formatCurrency } from "@/lib/formatters";

export default function SupplierPage() {
    const [suppliers, setSuppliers] = useState<SupplierStats[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newSupplierName, setNewSupplierName] = useState("");

    const [isAdding, setIsAdding] = useState(false);
    const [deletingIds, setDeletingIds] = useState<string[]>([]);

    useEffect(() => {
        async function fetchStats() {
            try {
                setIsLoading(true);
                const res = await fetch("/api/admin/suppliers/stats");
                if (!res.ok) throw new Error("Failed to load supplier stats");
                const data: SupplierStats[] = await res.json();
                setSuppliers(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchStats();
    }, []);

    async function addSupplier() {
        if (!newSupplierName.trim()) return;
        setIsAdding(true);
        try {
            const res = await fetch("/api/admin/suppliers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newSupplierName }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to add supplier");
            }

            const newSupplier: SupplierStats = await res.json();
            setSuppliers((prev) => [newSupplier, ...prev]);

            setNewSupplierName("");
        } catch (err) {
            console.error(err);
        } finally {
            setIsAdding(false);
        }
    }

    async function deleteSupplier(id: string) {
        setDeletingIds((prev) => [...prev, id]);
        try {
            const res = await fetch(`/api/admin/suppliers/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to delete supplier");
            }
            setSuppliers((prev) => prev.filter((s) => s.supplierId !== id));
        } catch (err) {
            console.error(err);
        } finally {
            setDeletingIds((prev) => prev.filter((x) => x !== id));
        }
    }

    const isDeleting = (id: string) => deletingIds.includes(id);

    const tableData = useMemo(
        () => (isLoading ? Array(5).fill({}) : suppliers),
        [isLoading, suppliers]
    );

    const tableColumns = useMemo(
        () =>
            isLoading
                ? columns.map((column) => ({
                      ...column,
                      cell: () => <Skeleton className="h-8 w-16"></Skeleton>,
                  }))
                : columns,
        [isLoading]
    );

    const emptyTable = () => {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Truck className="text-blue-600" />
                    </EmptyMedia>
                    <EmptyTitle>Постачальників не знайдено</EmptyTitle>
                    <EmptyDescription>
                        Наразі у вас немає постачальників. Ви можете додавати
                        нових постачальників та відстежувати їхні
                        заборгованості.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    };

    // xD
    const summary = isLoading
        ? []
        : [
              {
                  key: "operationsCount",
                  value: suppliers.reduce((a, s) => a + s.operationsCount, 0),
              },
              {
                  key: "paidByCashier",
                  value: formatCurrency(
                      suppliers.reduce((a, s) => a + s.paidByCashier, 0)
                  ),
              },
              {
                  key: "paidByOwner",
                  value: formatCurrency(
                      suppliers.reduce((a, s) => a + s.paidByOwner, 0)
                  ),
              },
              {
                  key: "totalPaid",
                  value: formatCurrency(
                      suppliers.reduce((a, s) => a + s.totalPaid, 0)
                  ),
              },
              {
                  key: "currentDebt",
                  value: formatCurrency(
                      suppliers.reduce((a, s) => a + s.currentDebt, 0)
                  ),
              },
          ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Truck className="h-7 w-7 text-blue-600" />
                    <TypographyH3>Постачальники</TypographyH3>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <Input
                        id="newSupplierName"
                        type="text"
                        className="col-span-2"
                        value={newSupplierName}
                        onChange={(e) => setNewSupplierName(e.target.value)}
                        placeholder="Назва постачальника"
                    />
                    <Button
                        onClick={addSupplier}
                        disabled={isAdding}
                        className="relative bg-blue-600 hover:bg-blue-700"
                    >
                        <div
                            className={`flex items-center justify-center gap-2 ${
                                isAdding ? "invisible" : "visible"
                            }`}
                        >
                            <Plus />
                            <div>Додати</div>
                        </div>
                        {isAdding && (
                            <Spinner className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                        )}
                    </Button>
                </div>

                <DataTable
                    columns={tableColumns}
                    data={tableData}
                    onDelete={deleteSupplier}
                    isDeleting={isDeleting}
                    emptyComponent={emptyTable}
                    summary={summary}
                />
            </CardContent>
        </Card>
    );
}
