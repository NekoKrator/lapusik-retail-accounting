import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Receipt } from "lucide-react";
import type { CashRegisterProps } from "@/types/types";
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from "@/components/ui/item";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import { formatCurrency } from "@/lib/formatters";

export function CashRegister({
    totalCashRegister,
    onTotalCashRegisterChange,
}: CashRegisterProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-7 w-7 text-blue-600" />
                    <TypographyH3>Каса за день</TypographyH3>
                </CardTitle>
                <CardDescription>
                    <TypographyP>
                        Загальна сума готівки та терміналу за день
                    </TypographyP>
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 flex-1 flex flex-col">
                <Input
                    id="cashRegister"
                    type="number"
                    min="0"
                    value={totalCashRegister === 0 ? "" : totalCashRegister}
                    onChange={(e) =>
                        onTotalCashRegisterChange(Number(e.target.value))
                    }
                    placeholder="Введіть загальну суму"
                />

                <Item
                    variant="outline"
                    className="flex-1 bg-blue-50 border-blue-200 dark:bg-blue-600/10 dark:border-blue-600/20"
                >
                    <ItemContent className="items-center">
                        <ItemTitle className="text-3xl text-blue-600">
                            {formatCurrency(totalCashRegister)}
                        </ItemTitle>
                        <ItemDescription className="text-blue-600">
                            Виручка за день
                        </ItemDescription>
                    </ItemContent>
                </Item>
            </CardContent>
        </Card>
    );
}
