import { Alert, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { TypographyH3 } from "@/components/ui/typography";
import { formatCurrency } from "@/lib/formatters";
import { Calculator, CheckCircle, AlertCircle } from "lucide-react";

interface FinalCalculationsProps {
    calculatedEveningBalance: number;
    actualEveningBalance: string;
    onActualEveningBalanceChange: (value: string) => void;
    actualBalance: number | null;
    difference: number;
}

export function FinalCalculations({
    calculatedEveningBalance,
    actualEveningBalance,
    onActualEveningBalanceChange,
    actualBalance,
    difference,
}: FinalCalculationsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-7 w-7 text-yellow-600" />
                    <TypographyH3>Підсумки</TypographyH3>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                <Item
                    variant="outline"
                    className="bg-yellow-50 border-yellow-200 dark:bg-yellow-600/10 dark:border-yellow-600/20"
                >
                    <ItemContent className="items-center">
                        <ItemTitle className="text-3xl text-yellow-600">
                            {formatCurrency(calculatedEveningBalance)}
                        </ItemTitle>
                        <ItemDescription className="text-lg text-yellow-600">
                            Розрахунковий залишок на вечір
                        </ItemDescription>
                    </ItemContent>
                </Item>

                <div className="space-y-3">
                    <Label htmlFor="actualBalance">
                        Фактичний залишок на вечір
                    </Label>

                    <Input
                        id="actualBalance"
                        type="number"
                        min="0"
                        value={actualEveningBalance}
                        onChange={(e) =>
                            onActualEveningBalanceChange(e.target.value)
                        }
                        placeholder="Введіть після підрахунку каси"
                    />

                    {actualBalance !== null && (
                        <Alert
                            className={`flex justify-center ${
                                difference === 0
                                    ? "text-green-600 bg-green-50 border-green-200 dark:bg-green-600/10 dark:border-green-600/20"
                                    : difference > 0
                                    ? "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-600/10 dark:border-orange-600/20"
                                    : "text-red-600 bg-red-50 border-red-200 dark:bg-red-600/10 dark:border-red-600/20"
                            }`}
                        >
                            {difference === 0 ? (
                                <CheckCircle />
                            ) : (
                                <AlertCircle />
                            )}
                            <AlertTitle className="items-center">
                                Різниця: {formatCurrency(Math.abs(difference))}
                                {difference < 0 && " (надлишок)"}
                                {difference > 0 && " (нестача)"}
                                {difference === 0 && " (збігається)"}
                            </AlertTitle>
                        </Alert>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
