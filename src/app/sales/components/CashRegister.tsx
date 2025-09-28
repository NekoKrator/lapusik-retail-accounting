import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Receipt } from "lucide-react";
import type { CashRegisterProps } from "@/types/types";

export function CashRegister({
    totalCashRegister,
    onTotalCashRegisterChange,
}: CashRegisterProps) {
    return (
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-blue-600" />
                    Каса за день
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                    Загальна сума готівки та терміналу за день
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4 h-full">
                <div className="space-y-2">
                    <Label
                        htmlFor="cashRegister"
                        className="text-sm font-medium text-gray-700"
                    >
                        Загальна сума виручки за день
                    </Label>
                    <Input
                        id="cashRegister"
                        type="number"
                        min="0"
                        value={totalCashRegister}
                        onChange={(e) =>
                            onTotalCashRegisterChange(Number(e.target.value))
                        }
                        placeholder="Введіть загальну суму"
                        className="h-12 text-lg font-medium"
                    />
                </div>

                <div className="flex-1 flex items-center justify-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="text-center">
                        <div className="relative inline-block">
                            <span className="text-3xl font-bold text-blue-700 mb-2">
                                {totalCashRegister.toFixed(2)}
                            </span>
                            <span className="absolute -right-7 top-0 text-3xl font-bold text-blue-700">
                                ₴
                            </span>
                        </div>
                        <div className="text-lg font-medium text-blue-800">
                            Виручка за день
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
