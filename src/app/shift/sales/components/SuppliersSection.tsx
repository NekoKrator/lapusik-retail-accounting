"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck, Plus, Trash2, Check, ChevronDown } from "lucide-react";
import {
    CreateDeliveryInput,
    SupplierDelivery,
    UpdateDeliveryInput,
} from "@/app/hooks/useSupplierDeliveries";
import type { ExpenseItem, Supplier } from "@/types/types";
import { formatFullDateTime } from "@/lib/date";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { TypographyH3 } from "@/components/ui/typography";
import { Spinner } from "@/components/ui/spinner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";

type SuppliersSectionProps = {
    suppliers: Supplier[];
    deliveries: SupplierDelivery[];
    loadingDeliveries: boolean;
    onAddDelivery: (data: CreateDeliveryInput) => Promise<SupplierDelivery>;
    onUpdateDelivery: ({
        id,
        ...data
    }: UpdateDeliveryInput) => Promise<SupplierDelivery>;
    onDeleteDelivery: (id: string) => Promise<void>;

    onAddExpense: (expense: Omit<ExpenseItem, "id">) => void;
    onError: (msg: string) => void;
};

export default function SuppliersSection({
    suppliers,
    deliveries,
    loadingDeliveries,
    onAddDelivery,
    onUpdateDelivery,
    onDeleteDelivery,
    onAddExpense,
    onError,
}: SuppliersSectionProps) {
    const [open, setOpen] = useState(false);
    const [selectedSupplierId, setSelectedSupplierId] = useState("");

    const [newSupplierItem, setNewSupplier] = useState({
        pricePerDelivery: "",
        paidAmount: "",
    });

    const [addLoading, setAddLoading] = useState(false);
    const [writingOffIds, setWritingOffIds] = useState<string[]>([]);
    const [deletingIds, setDeletingIds] = useState<string[]>([]);

    const handleAdd = async () => {
        if (!selectedSupplierId) {
            onError("Оберіть постачальника");
            return;
        }

        const pricePerDelivery = Number(newSupplierItem.pricePerDelivery);
        const paidAmount = Number(newSupplierItem.paidAmount) || 0;

        if (
            !pricePerDelivery ||
            pricePerDelivery <= 0 ||
            paidAmount > pricePerDelivery
        ) {
            onError("Будь ласка, заповніть всі поля коректно");
            return;
        }

        try {
            setAddLoading(true);

            await onAddDelivery({
                supplierId: selectedSupplierId,
                totalPrice: pricePerDelivery,
                paidByCashier: paidAmount,
            });

            if (paidAmount !== 0) {
                onAddExpense({
                    amount: Number(paidAmount),
                    category: "supplierPayments",
                });
            }

            setNewSupplier({ pricePerDelivery: "", paidAmount: "" });
        } catch (err) {
            console.error(err);
            onError("Помилка при додаванні поставки");
        } finally {
            setAddLoading(false);
        }
    };

    const handleWriteOff = async (id: string) => {
        const delivery = deliveries.find((d) => d.id === id);
        if (!delivery) return;

        setWritingOffIds((prev) => [...prev, id]);
        try {
            await onUpdateDelivery({ id, paidByOwner: delivery.debt, debt: 0 });

            onAddExpense({
                amount: Number(delivery.debt),
                category: "supplierPayments",
            });
        } catch {
            onError("Помилка при списанні боргу");
        } finally {
            setWritingOffIds((prev) => prev.filter((x) => x !== id));
        }
    };

    const handleRemove = async (id: string) => {
        const delivery = deliveries.find((d) => d.id === id);
        if (!delivery) return;

        setDeletingIds((prev) => [...prev, id]);
        try {
            await onDeleteDelivery(id);
        } catch {
            onError("Не вдалося видалити поставку");
        } finally {
            setDeletingIds((prev) => prev.filter((x) => x !== id));
        }
    };

    const totalDebt = deliveries.reduce((sum, d) => sum + d.debt, 0);

    const isWritingOff = (id: string) => writingOffIds.includes(id);
    const isDeleting = (id: string) => deletingIds.includes(id);
    const isBusy = (id: string) => isWritingOff(id) || isDeleting(id);

    const skeleton = () => {
        return (
            <ItemGroup className="gap-2">
                {[...Array(4)].map((_, i) => (
                    <Item key={i} variant="outline">
                        <ItemContent>
                            <Skeleton className="h-5 w-1/3"></Skeleton>
                            <Skeleton className="h-5 w-1/4 mb-[1px]"></Skeleton>
                        </ItemContent>
                        <ItemActions>
                            <Skeleton className="h-6 w-14"></Skeleton>
                            <Skeleton className="h-9 w-20"></Skeleton>
                            <Skeleton className="h-9 w-9"></Skeleton>
                        </ItemActions>
                    </Item>
                ))}
                <Item variant="outline">
                    <ItemContent className="items-center">
                        <Skeleton className="h-8 w-1/5"></Skeleton>
                        <Skeleton className="h-5 w-1/6 mb-[1px]"></Skeleton>
                    </ItemContent>
                </Item>
            </ItemGroup>
        );
    };

    const empty = () => {
        return (
            <Empty className="h-[calc(130.6px*2+8px*4+90.6px)] md:h-[calc(78.6px*4+8px*4+90.6px)]">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Truck className="text-blue-600" />
                    </EmptyMedia>
                    <EmptyTitle>Поставок не знайдено</EmptyTitle>
                    <EmptyDescription>
                        Наразі у вас немає поставок. Ви можете додавати нові
                        поставки та відстежувати їхні заборгованості.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    };

    const deliveryItem = (d: SupplierDelivery) => {
        return (
            <Item key={d.id} variant="outline">
                <ItemContent>
                    <ItemTitle>
                        <ScrollArea className="w-128">
                            {d.supplier?.name}
                            <ScrollBar
                                orientation="horizontal"
                                className="translate-y-2"
                            />
                        </ScrollArea>
                    </ItemTitle>
                    <ItemDescription>
                        {formatFullDateTime(d.createdAt)}
                    </ItemDescription>
                </ItemContent>

                <ItemContent>
                    <ItemDescription className="text-base font-semibold text-blue-600">
                        {formatCurrency(d.debt)}
                    </ItemDescription>
                </ItemContent>

                <ItemActions>
                    <Button
                        type="button"
                        disabled={isBusy(d.id)}
                        className="relative bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10 has-[>svg]:px-4"
                        onClick={() => handleWriteOff(d.id)}
                    >
                        <span
                            className={
                                isWritingOff(d.id) ? "invisible" : "visible"
                            }
                        >
                            Списати
                        </span>
                        {isWritingOff(d.id) && (
                            <Spinner className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                        )}
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                disabled={isBusy(d.id)}
                                className="text-gray-400 hover:text-destructive hover:bg-red-50 w-9 h-9"
                            >
                                {isDeleting(d.id) ? (
                                    <Spinner />
                                ) : (
                                    <Trash2 className="h-4 w-4" />
                                )}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Ви впевнені, що хочете видалити цей борг?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Цю дію не можна скасувати. Це призведе до
                                    остаточного видалення данів про поточний
                                    борг.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Скасувати</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => handleRemove(d.id)}
                                    className="bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
                                >
                                    Видалити борг
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </ItemActions>
            </Item>
        );
    };

    const supplierPicker = (suppliers: Supplier[]) => {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="font-normal justify-between"
                    >
                        {selectedSupplierId ? (
                            <p className="truncate">
                                {
                                    suppliers.find(
                                        (s) => s.id === selectedSupplierId
                                    )?.name
                                }
                            </p>
                        ) : (
                            <p className="text-muted-foreground truncate">
                                Обрати постачальника...
                            </p>
                        )}

                        <ChevronDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className=" p-0">
                    <Command>
                        <CommandInput
                            placeholder="Пошук постачальника..."
                            className="h-9"
                        />
                        <CommandList>
                            <CommandEmpty>
                                Постачальника не знайдено.
                            </CommandEmpty>
                            <CommandGroup>
                                {suppliers.map((s) => (
                                    <CommandItem
                                        key={s.id}
                                        value={s.name}
                                        onSelect={(currentValue) => {
                                            const selectedObject =
                                                suppliers.find(
                                                    (supplier) =>
                                                        supplier.name ===
                                                        currentValue
                                                );

                                            const selectedId = selectedObject
                                                ? selectedObject.id
                                                : "";

                                            setSelectedSupplierId(
                                                selectedId ===
                                                    selectedSupplierId
                                                    ? ""
                                                    : selectedId
                                            );

                                            setOpen(false);
                                        }}
                                    >
                                        <p className="truncate">{s.name}</p>
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                selectedSupplierId === s.id
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Truck className="h-7 w-7 text-blue-600" />
                    <TypographyH3>Постачальники</TypographyH3>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Addition form */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 items-end">
                    {supplierPicker(suppliers)}

                    <Input
                        id="pricePerDelivery"
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
                        id="paidAmount"
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

                    <Button
                        type="button"
                        onClick={handleAdd}
                        disabled={addLoading}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {addLoading ? (
                            <Spinner />
                        ) : (
                            <>
                                <Plus />
                                <div>Додати</div>
                            </>
                        )}
                    </Button>
                </div>

                {/* Skeleton loading */}
                {loadingDeliveries
                    ? skeleton()
                    : deliveries.filter((d) => d.debt > 0).length === 0
                    ? empty()
                    : totalDebt !== 0 && (
                          <ItemGroup className="gap-2">
                              <ScrollArea className="h-[calc(130.6px*2+8px*1)] md:h-[calc(78.6px*4+8px*3)]">
                                  <div className="space-y-2">
                                      {deliveries
                                          .filter((d) => d.debt > 0)
                                          .map((d) => deliveryItem(d))}
                                  </div>
                                  <ScrollBar
                                      orientation="vertical"
                                      className=""
                                  />
                              </ScrollArea>

                              <Item
                                  variant="outline"
                                  className="bg-blue-50 border-blue-200 dark:bg-blue-600/10 dark:border-blue-600/20"
                              >
                                  <ItemContent className="items-center">
                                      <ItemTitle className="text-2xl text-blue-600">
                                          {totalDebt.toFixed(2)} ₴
                                      </ItemTitle>
                                      <ItemDescription className="text-blue-600">
                                          Загальна сума боргів
                                      </ItemDescription>
                                  </ItemContent>
                              </Item>
                          </ItemGroup>
                      )}
            </CardContent>
        </Card>
    );
}
