import { Card, CardContent } from "@/components/ui/card";
import { TypographyH4, TypographyMuted } from "@/components/ui/typography";
import { formatCurrency } from "@/lib/formatters";
import { Wallet, Receipt, TrendingDown, PiggyBank } from "lucide-react";

interface QuickStatsProps {
    totalMorningBalance: number;
    totalCashRegister: number;
    totalExpenses: number;
    calculatedEveningBalance: number;
}

export function QuickStats({
    totalMorningBalance,
    totalCashRegister,
    totalExpenses,
    calculatedEveningBalance,
}: QuickStatsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
                <CardContent className="py-4 flex-1 flex flex-col items-center justify-center gap-1">
                    <Wallet className="h-5 w-5 text-green-600" />

                    <div className="relative inline-block">
                        <TypographyH4 className="font-bold text-green-600">
                            {formatCurrency(totalMorningBalance)}
                        </TypographyH4>
                    </div>

                    <TypographyMuted>Ранковий залишок</TypographyMuted>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="py-4 flex-1 flex flex-col items-center justify-center gap-1">
                    <Receipt className="h-5 w-5 text-blue-600" />

                    <div className="relative inline-block">
                        <TypographyH4 className="font-bold text-blue-600">
                            {formatCurrency(totalCashRegister)}
                        </TypographyH4>
                    </div>

                    <TypographyMuted>Каса</TypographyMuted>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="py-4 flex-1 flex flex-col items-center justify-center gap-1">
                    <TrendingDown className="h-5 w-5 text-red-600" />

                    <div className="relative inline-block">
                        <TypographyH4 className="font-bold text-red-600">
                            {formatCurrency(totalExpenses)}
                        </TypographyH4>
                    </div>

                    <TypographyMuted>Витрати</TypographyMuted>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="py-4 flex-1 flex flex-col items-center justify-center gap-1">
                    <PiggyBank className="h-5 w-5 text-yellow-600" />

                    <div className="relative inline-block">
                        <TypographyH4 className="font-bold text-yellow-600">
                            {formatCurrency(calculatedEveningBalance)}
                        </TypographyH4>
                    </div>

                    <TypographyMuted>Залишок</TypographyMuted>
                </CardContent>
            </Card>
        </div>
    );
}
