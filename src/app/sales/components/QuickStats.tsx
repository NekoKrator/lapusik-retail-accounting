import { Card, CardContent } from "@/components/ui/card";
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
            <Card className="bg-white/95 backdrop-blur border-0 shadow-md">
                <CardContent className="p-4 text-center">
                    <div className="flex flex-col items-center">
                        <Wallet className="h-5 w-5 text-green-600 mb-1" />

                        <div className="relative inline-block">
                            <span className="text-lg font-bold text-green-600">
                                {totalMorningBalance.toFixed(2)}
                            </span>
                            <span className="absolute -right-4 top-0 text-lg font-bold text-green-600">
                                ₴
                            </span>
                        </div>

                        <div className="text-xs text-gray-600">
                            Ранковий залишок
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur border-0 shadow-md">
                <CardContent className="p-4 text-center">
                    <div className="flex flex-col items-center">
                        <Receipt className="h-5 w-5 text-blue-600 mb-1" />

                        <div className="relative inline-block">
                            <span className="text-lg font-bold text-blue-600">
                                {totalCashRegister.toFixed(2)}
                            </span>
                            <span className="absolute -right-4 top-0 text-lg font-bold text-blue-600">
                                ₴
                            </span>
                        </div>

                        <div className="text-xs text-gray-600">Каса</div>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur border-0 shadow-md">
                <CardContent className="p-4 text-center">
                    <div className="flex flex-col items-center">
                        <TrendingDown className="h-5 w-5 text-red-600 mb-1" />

                        <div className="relative inline-block">
                            <span className="text-lg font-bold text-red-600">
                                {totalExpenses.toFixed(2)}
                            </span>
                            <span className="absolute -right-4 top-0 text-lg font-bold text-red-600">
                                ₴
                            </span>
                        </div>

                        <div className="text-xs text-gray-600">Витрати</div>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur border-0 shadow-md">
                <CardContent className="p-4 text-center">
                    <div className="flex flex-col items-center">
                        <PiggyBank className="h-5 w-5 text-yellow-600 mb-1" />

                        <div className="relative inline-block">
                            <span className="text-lg font-bold text-yellow-600">
                                {calculatedEveningBalance.toFixed(2)}
                            </span>
                            <span className="absolute -right-4 top-0 text-lg font-bold text-yellow-600">
                                ₴
                            </span>
                        </div>

                        <div className="text-xs text-gray-600">Залишок</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
