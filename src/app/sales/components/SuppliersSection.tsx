import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck, Plus, Trash2 } from "lucide-react";
import type { SuppliersSectionProps } from "@/types/types";

export function SuppliersSection({
    suppliers,
    onAddSupplier,
    onRemoveSupplier,
    onAddExpense,
    onError,
}: SuppliersSectionProps) {
    const [newSupplier, setNewSupplier] = useState({
        name: "",
        debt: "",
        pricePerDelivery: "",
        paidAmount: "",
    });

    const handleAdd = () => {
        if (
            !newSupplier.name.trim() ||
            !newSupplier.debt ||
            !newSupplier.pricePerDelivery ||
            Number(newSupplier.debt) < 0 ||
            Number(newSupplier.pricePerDelivery) <= 0
        ) {
            onError("Будь ласка, заповніть всі поля коректно");
            return;
        }

        const paidAmount = Number(newSupplier.paidAmount) || 0;
        const totalDebt = Number(newSupplier.debt);
        const pricePerDelivery = Number(newSupplier.pricePerDelivery);

        // Add supplier with remaining debt
        onAddSupplier({
            name: newSupplier.name.trim(),
            debt: Math.max(0, totalDebt - paidAmount),
            pricePerDelivery: pricePerDelivery,
        });

        // If paid amount > 0, add to expenses
        if (paidAmount > 0) {
            onAddExpense({
                amount: paidAmount,
                category: "supplierPayments",
            });
        }

        setNewSupplier({
            name: "",
            debt: "",
            pricePerDelivery: "",
            paidAmount: "",
        });
    };

    return (
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-600" />
                    Постачальники
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Add New Supplier */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                    <Input
                        value={newSupplier.name}
                        onChange={(e) =>
                            setNewSupplier((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        placeholder="Назва постачальника"
                    />
                    <Input
                        type="number"
                        min="0"
                        value={newSupplier.debt}
                        onChange={(e) =>
                            setNewSupplier((prev) => ({
                                ...prev,
                                debt: e.target.value,
                            }))
                        }
                        placeholder="Загальний борг"
                    />
                    <Input
                        type="number"
                        min="0"
                        value={newSupplier.pricePerDelivery}
                        onChange={(e) =>
                            setNewSupplier((prev) => ({
                                ...prev,
                                pricePerDelivery: e.target.value,
                            }))
                        }
                        placeholder="Ціна за поставку"
                    />
                    <Input
                        type="number"
                        min="0"
                        value={newSupplier.paidAmount}
                        onChange={(e) =>
                            setNewSupplier((prev) => ({
                                ...prev,
                                paidAmount: e.target.value,
                            }))
                        }
                        placeholder="Заплачено"
                    />
                    <Button
                        type="button"
                        onClick={handleAdd}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Додати
                    </Button>
                </div>

                {/* Suppliers List */}
                {suppliers.length > 0 && (
                    <div className="space-y-2">
                        {suppliers.map((supplier) => (
                            <div
                                key={supplier.id}
                                className="flex items-center justify-between p-2 bg-white rounded border"
                            >
                                <div>
                                    <div className="font-medium">
                                        {supplier.name}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        ₴{supplier.pricePerDelivery.toFixed(2)}{" "}
                                        за поставку
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-blue-600">
                                        ₴{supplier.debt.toFixed(2)}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            onRemoveSupplier(supplier.id)
                                        }
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <div className="p-2 bg-blue-50 rounded border border-blue-200">
                            <div className="text-center">
                                <span className="text-lg font-bold text-blue-700">
                                    ₴
                                    {suppliers
                                        .reduce((sum, s) => sum + s.debt, 0)
                                        .toFixed(2)}
                                </span>
                                <span className="text-sm text-blue-600 ml-2">
                                    Загальна заборгованість
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
