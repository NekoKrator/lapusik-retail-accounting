"use client";

import { SetStateAction, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, Trash2 } from "lucide-react";
import { formatFullDateTime } from "@/lib/date";
import {
    CreateDebtorInput,
    DebtorItem,
    UpdateDeliveryInput,
} from "@/app/hooks/useDebtors";
import { BalanceItem } from "@/types/types";
import { TypographyH3 } from "@/components/ui/typography";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemTitle,
} from "@/components/ui/item";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
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
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatters";

type DebtorsSectionProps = {
    debtors: DebtorItem[];
    loadingDebtors: boolean;
    onAddDebtor: (data: CreateDebtorInput) => Promise<DebtorItem>;
    onUpdateDebtor: ({
        id,
        ...data
    }: UpdateDeliveryInput) => Promise<DebtorItem>;
    onWriteOffDebtor: ({
        id,
        ...data
    }: UpdateDeliveryInput) => Promise<DebtorItem>;
    // onDeleteDebtor: (id: string) => Promise<void>;
    onError: (errorMessage: string) => void;

    setAdditionalBalances: (value: SetStateAction<BalanceItem[]>) => void;
};

export default function DebtorsSection({
    debtors,
    loadingDebtors,
    onAddDebtor,
    onUpdateDebtor,
    onWriteOffDebtor,
    // onDeleteDebtor,
    onError,
    setAdditionalBalances,
}: DebtorsSectionProps) {
    const [newDebtor, setNewDebtor] = useState({ name: "", amount: "" });
    const [writeOffAmounts, setWriteOffAmounts] = useState<
        Record<string, string>
    >({});

    const [addLoading, setAddLoading] = useState(false);
    const [writingOffIds, setWritingOffIds] = useState<string[]>([]);
    const [deletingIds, setDeletingIds] = useState<string[]>([]);

    const handleAdd = async () => {
        if (
            !newDebtor.name.trim() ||
            !newDebtor.amount ||
            Number(newDebtor.amount) <= 0
        ) {
            onError("Будь ласка, заповніть всі поля коректно");
            return;
        }

        try {
            setAddLoading(true);

            await onAddDebtor({
                name: newDebtor.name.trim(),
                currentDebt: Number(newDebtor.amount),
            });

            setNewDebtor({ name: "", amount: "" });
        } catch (err) {
            console.error(err);
            onError("Помилка при додаванні боржника");
        } finally {
            setAddLoading(false);
        }
    };

    const handleWriteOff = async (id: string) => {
        const value = writeOffAmounts[id];
        const amountToWriteOff = Number(value);

        if (!value || isNaN(amountToWriteOff) || amountToWriteOff <= 0) {
            onError("Введіть коректну суму для списання");
            return;
        }

        const debtor = debtors.find((d) => d.id === id);
        if (!debtor) return;

        if (amountToWriteOff > debtor.currentDebt) {
            onError("Сума списання не може бути більшою за суму боргу");
            return;
        }

        setWritingOffIds((prev) => [...prev, id]);
        try {
            const updatedDebtor = await onWriteOffDebtor({
                id,
                currentDebt: amountToWriteOff,
            });

            setAdditionalBalances((prev) => [
                ...prev,
                {
                    id: String(Date.now()),
                    amount: amountToWriteOff,
                    category: `${updatedDebtor.name} повернув борг`,
                },
            ]);

            setWriteOffAmounts((prev) => ({ ...prev, [id]: "" }));
        } catch {
            onError("Помилка при списанні боргу");
        } finally {
            setWritingOffIds((prev) => prev.filter((x) => x !== id));
        }
    };

    const handleRemove = async (id: string) => {
        const debtor = debtors.find((d) => d.id === id);
        if (!debtor) return;

        setDeletingIds((prev) => [...prev, id]);
        try {
            // delete from database
            // await onDeleteDebtor(id);

            // remove current debt, but keep in database
            await onUpdateDebtor({
                id,
                currentDebt: 0,
                totalDebt: debtor.totalDebt - debtor.currentDebt,
            });
        } catch {
            onError("Не вдалося видалити поставку");
        } finally {
            setDeletingIds((prev) => prev.filter((x) => x !== id));
        }
    };

    const totalDebt = debtors.reduce((sum, d) => sum + d.currentDebt, 0);

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
                            <Skeleton className="h-9 w-46"></Skeleton>
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
                        <Users className="text-orange-600" />
                    </EmptyMedia>
                    <EmptyTitle>Боржників не знайдено</EmptyTitle>
                    <EmptyDescription>
                        Наразі у вас немає боржників. Ви можете додавати нових
                        боржників та відстежувати їхні заборгованості.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    };

    const debtorItem = (d: DebtorItem) => {
        return (
            <Item key={d.id} variant="outline">
                <ItemContent>
                    <ItemTitle>
                        <ScrollArea className="w-128">
                            {d.name}
                            <ScrollBar
                                orientation="horizontal"
                                className="translate-y-2"
                            />
                        </ScrollArea>
                    </ItemTitle>
                    <ItemDescription>
                        {formatFullDateTime(d.updatedAt.toString())}
                    </ItemDescription>
                </ItemContent>

                <ItemContent>
                    <ItemDescription className="text-base font-semibold text-orange-600">
                        {formatCurrency(d.currentDebt)}
                    </ItemDescription>
                </ItemContent>

                <ItemActions>
                    <Input
                        id="writeOffAmount"
                        type="number"
                        min="0"
                        disabled={isBusy(d.id)}
                        placeholder="Сума списання"
                        value={writeOffAmounts[d.id] || ""}
                        onChange={(e) =>
                            setWriteOffAmounts((prev) => ({
                                ...prev,
                                [d.id]: e.target.value,
                            }))
                        }
                    />

                    <Button
                        type="button"
                        disabled={isBusy(d.id)}
                        className="relative bg-transparent border border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-600/10 has-[>svg]:px-4"
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

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-7 w-7 text-orange-600" />
                    <TypographyH3>Облік боржників</TypographyH3>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Addition form */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-end">
                    <Input
                        id="newDebtorName"
                        value={newDebtor.name}
                        onChange={(e) =>
                            setNewDebtor((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        placeholder="Ім'я боржника"
                    />

                    <Input
                        id="newDebtorAmount"
                        type="number"
                        min="0"
                        value={newDebtor.amount}
                        onChange={(e) =>
                            setNewDebtor((prev) => ({
                                ...prev,
                                amount: e.target.value,
                            }))
                        }
                        placeholder="Сума боргу"
                    />

                    <Button
                        type="button"
                        onClick={handleAdd}
                        disabled={addLoading}
                        className="bg-orange-600 hover:bg-orange-700"
                    >
                        {addLoading ? (
                            <Spinner />
                        ) : (
                            <>
                                <Plus className="h-5 w-5" />
                                <span>Додати</span>
                            </>
                        )}
                    </Button>
                </div>

                {/* List */}
                {loadingDebtors
                    ? skeleton()
                    : debtors.filter((d) => d.currentDebt > 0).length === 0
                    ? empty()
                    : totalDebt !== 0 && (
                          <ItemGroup className="gap-2">
                              <ScrollArea className="h-[calc(78.6px*2+8px*1)] md:h-[calc(78.6px*4+8px*3)]">
                                  <div className="space-y-2">
                                      {debtors
                                          .slice()
                                          .reverse()
                                          .filter((d) => d.currentDebt > 0)
                                          .map((d) => debtorItem(d))}
                                  </div>
                              </ScrollArea>

                              <Item
                                  variant="outline"
                                  className="bg-orange-50 border-orange-200 dark:bg-orange-600/10 dark:border-orange-600/20"
                              >
                                  <ItemContent className="items-center">
                                      <ItemTitle className="text-2xl text-orange-600">
                                          {totalDebt.toFixed(2)} ₴
                                      </ItemTitle>
                                      <ItemDescription className="text-orange-600">
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
