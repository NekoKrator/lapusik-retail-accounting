import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Truck, Plus, Trash2 } from "lucide-react";
import type { SuppliersSectionProps } from "@/types/types";

export function SuppliersSection({
    suppliers,
    supplierItems,
    onAddSupplier,
    onRemoveSupplier,
    onAddExpense,
    onError,
}: SuppliersSectionProps) {
    const [newSupplierItem, setNewSupplier] = useState({
        name: "",
        pricePerDelivery: "",
        paidAmount: "",
    });

    const selectRef = useRef<HTMLSelectElement>(null);

    const handleAdd = () => {
        const selectedId = selectRef.current?.value || "";
        const supplier = suppliers.find((s) => String(s.id) === selectedId);

        if (!supplier) {
            onError("Оберіть постачальника");
            return;
        }

        if (
            !newSupplierItem.pricePerDelivery ||
            Number(newSupplierItem.pricePerDelivery) <= 0 ||
            newSupplierItem.paidAmount > newSupplierItem.pricePerDelivery
        ) {
            onError("Будь ласка, заповніть всі поля коректно");
            return;
        }

        const paidAmount = Number(newSupplierItem.paidAmount) || 0;
        const pricePerDelivery = Number(newSupplierItem.pricePerDelivery);
        const debt = Number(pricePerDelivery - paidAmount);

        // Add supplier with remaining debt
        onAddSupplier({
            supplierId: supplier.id,
            supplierName: "",
            totalPrice: pricePerDelivery,
            debt: debt,
            paidOff: debt === 0,
            paymentType: "CASH",
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
            pricePerDelivery: "",
            paidAmount: "",
        });
    };

    return (
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
            <CardHeader className="">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-600" />
                    Постачальники
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Add New Supplier */}
                <div className="grid grid-cols-3 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="col-span-2 flex gap-4">
                        <Select ref={selectRef} defaultValue="" className="">
                            {suppliers.map((supplier) => (
                                <option
                                    key={supplier.id}
                                    value={String(supplier.id)}
                                >
                                    {supplier.name}
                                </option>
                            ))}
                        </Select>
                        <Input
                            type="number"
                            min="0"
                            value={newSupplierItem.pricePerDelivery}
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
                            value={newSupplierItem.paidAmount}
                            onChange={(e) =>
                                setNewSupplier((prev) => ({
                                    ...prev,
                                    paidAmount: e.target.value,
                                }))
                            }
                            placeholder="Сплачено"
                        />
                    </div>

                    <div className="col-span-1 flex">
                        <Button
                            type="button"
                            onClick={handleAdd}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Plus className="h-4 w-4 mr-2" /> Додати
                        </Button>
                    </div>
                </div>

                {/* Suppliers List */}
                {supplierItems.length > 0 && (
                    <div className="space-y-2">
                        {supplierItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between p-2 bg-white rounded border"
                            >
                                <div>
                                    <div className="font-medium">
                                        {item.supplierName}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="font-bold text-blue-600">
                                        ₴{item.debt.toFixed(2)}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            onRemoveSupplier(item.id)
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
                                    {supplierItems
                                        .reduce((sum, d) => sum + d.debt, 0)
                                        .toFixed(2)}
                                </span>
                                <span className="text-sm text-blue-600 ml-2">
                                    Загальна сума боргів
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
