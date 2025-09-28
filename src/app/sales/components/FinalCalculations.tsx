import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-purple-600" />
                    Підсумки
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-700 mb-2">
                            ₴{calculatedEveningBalance.toFixed(2)}
                        </div>
                        <div className="text-lg font-medium text-yellow-800">
                            Розрахунковий залишок на вечір
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label
                        htmlFor="actualBalance"
                        className="text-sm font-medium text-gray-700"
                    >
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
                        className="h-10"
                    />
                    {actualBalance !== null && (
                        <div
                            className={`mt-3 p-3 rounded-lg text-center font-semibold ${
                                difference === 0
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : difference > 0
                                    ? "bg-orange-50 text-orange-700 border border-orange-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                {difference === 0 ? (
                                    <CheckCircle className="h-5 w-5" />
                                ) : (
                                    <AlertCircle className="h-5 w-5" />
                                )}
                                <span>
                                    Різниця: ₴{Math.abs(difference).toFixed(2)}
                                    {difference < 0 && " (надлишок)"}
                                    {difference > 0 && " (нестача)"}
                                    {difference === 0 && " (збігається)"}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
