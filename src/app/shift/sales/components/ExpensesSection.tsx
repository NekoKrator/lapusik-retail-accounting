import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TrendingDown, Plus, Trash2, AlertCircle } from "lucide-react";
import { expenseCategories } from "@/lib/constants/expense-categories";
import type { ExpenseItem } from "@/types/types";
import { formatHourMinuteTime } from "@/lib/date";
import { TypographyH3 } from "@/components/ui/typography";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/lib/formatters";

interface ExpensesSectionProps {
    expenseItems: ExpenseItem[];
    onAddExpense: (expense: Omit<ExpenseItem, "id">) => void;
    onRemoveExpense: (id: string) => void;
    onError: (error: string) => void;
    totalExpenses: number;
}

export function ExpensesSection({
    expenseItems,
    onAddExpense,
    onRemoveExpense,
    onError,
    totalExpenses,
}: ExpensesSectionProps) {
    const [newExpense, setNewExpense] = useState({
        amount: "",
        category: "otherExpenses",
    });

    const handleAdd = () => {
        if (!newExpense.amount || Number(newExpense.amount) <= 0) {
            onError("Будь ласка, введіть коректну суму");
            return;
        }
        onAddExpense({
            amount: Number(newExpense.amount),
            category: newExpense.category,
        });
        setNewExpense({ amount: "", category: "otherExpenses" });
    };

    const getCategoryIcon = (category: string) => {
        const cat = expenseCategories.find((c) => c.key === category);
        const IconComponent = cat?.icon || AlertCircle;
        return <IconComponent className="h-4 w-4" />;
    };

    const getCategoryLabel = (category: string) => {
        const cat = expenseCategories.find((c) => c.key === category);
        return cat?.label || "Інше";
    };

    const expenseItem = (e: ExpenseItem) => {
        return (
            <Item key={e.id} variant="outline">
                <ItemMedia variant="icon" className="text-red-600">
                    {getCategoryIcon(e.category)}
                </ItemMedia>

                <ItemContent>
                    <ItemTitle>{getCategoryLabel(e.category)}</ItemTitle>
                    <ItemDescription>
                        {formatHourMinuteTime(Number(e.id))}
                    </ItemDescription>
                </ItemContent>

                <ItemContent>
                    <ItemDescription className="text-base font-semibold text-red-600">
                        {formatCurrency(e.amount)}
                    </ItemDescription>
                </ItemContent>

                <ItemActions>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onRemoveExpense(e.id)}
                        className="text-gray-400 hover:text-destructive hover:bg-red-50 w-9 h-9"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </ItemActions>
            </Item>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-7 w-7 text-red-600" />
                    <TypographyH3>Витрати (здано)</TypographyH3>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-end">
                    <Input
                        id="newExpenseAmount"
                        type="number"
                        min="0"
                        value={newExpense.amount}
                        onChange={(e) =>
                            setNewExpense((prev) => ({
                                ...prev,
                                amount: e.target.value,
                            }))
                        }
                        placeholder="Сума"
                    />

                    <Select
                        onValueChange={(value) =>
                            setNewExpense((prev) => ({
                                ...prev,
                                category: value,
                            }))
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Обрати категорію" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {expenseCategories.map((category) => (
                                    <SelectItem
                                        key={category.key}
                                        value={String(category.key)}
                                    >
                                        {category.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Button
                        type="button"
                        onClick={handleAdd}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <>
                            <Plus className="h-5 w-5" />
                            <span>Додати</span>
                        </>
                    </Button>
                </div>

                {/* List */}
                {expenseItems.length > 0 && (
                    <ItemGroup className="gap-2">
                        <ScrollArea className="h-[calc(78.6px*2+8px*1)] md:h-[calc(78.6px*4+8px*3)]">
                            <div className="space-y-2">
                                {expenseItems
                                    .slice()
                                    .reverse()
                                    .map((e) => expenseItem(e))}
                            </div>
                        </ScrollArea>

                        <Item
                            variant="outline"
                            className="bg-red-50 border-red-200 dark:bg-red-600/10 dark:border-red-600/20"
                        >
                            <ItemContent className="items-center">
                                <ItemTitle className="text-2xl text-red-600">
                                    {formatCurrency(totalExpenses)}
                                </ItemTitle>
                                <ItemDescription className="text-red-600">
                                    Загальні витрати
                                </ItemDescription>
                            </ItemContent>
                        </Item>
                    </ItemGroup>
                )}
            </CardContent>
        </Card>
    );
}
