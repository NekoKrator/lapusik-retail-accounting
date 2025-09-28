import {
    Card,
    CardContent,
    CardHeader,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
    Wallet,
    Plus,
    Trash2,
    Info,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import type { MorningBalanceProps } from "@/types/types";
import { useState } from "react";

export function MorningBalance({
    baseMorningBalance,
    additionalBalances,
    newBalanceAmount,
    onNewBalanceAmountChange,
    newBalanceCategory,
    onNewBalanceCategoryChange,
    onAddBalance,
    onRemoveBalance,
    totalMorningBalance,
    previousDayInfo,
    isLoading = false,
}: MorningBalanceProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formatDate = (dateString: string | number) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("uk-UA", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const getBalanceSourceInfo = () => {
        if (!previousDayInfo) {
            return {
                text: "Немає даних за попередній день",
                icon: AlertCircle,
                color: "text-gray-600",
                bgColor: "bg-gray-50",
                borderColor: "border-gray-200",
            };
        }

        const hasActualBalance =
            previousDayInfo.actualEveningBalance !== undefined;

        if (hasActualBalance) {
            return {
                text: `Фактичний залишок за ${formatDate(
                    previousDayInfo.date
                )}`,
                icon: CheckCircle,
                color: "text-green-700",
                bgColor: "bg-green-50",
                borderColor: "border-green-200",
            };
        } else {
            return {
                text: `Розрахунковий залишок за ${formatDate(
                    previousDayInfo.date
                )}`,
                icon: Info,
                color: "text-blue-700",
                bgColor: "bg-blue-50",
                borderColor: "border-blue-200",
            };
        }
    };

    const sourceInfo = getBalanceSourceInfo();
    const IconComponent = sourceInfo.icon;

    if (isLoading) {
        return (
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-green-600" />
                        Залишок на ранок
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                        <span className="ml-3 text-gray-600">
                            Завантаження даних...
                        </span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-green-600" />
                        Залишок на ранок
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                        Залишок попереднього дня та додаткові надходження до
                        каси
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div
                        className={`p-3 rounded-lg border ${sourceInfo.bgColor} ${sourceInfo.borderColor}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <IconComponent
                                    className={`h-4 w-4 ${sourceInfo.color}`}
                                />
                                <span
                                    className={`text-sm leading-none ${sourceInfo.color}`}
                                >
                                    Базова сума{" "}
                                    {previousDayInfo &&
                                        `(${formatDate(previousDayInfo.date)})`}
                                </span>
                            </div>
                            <span className={`font-bold ${sourceInfo.color}`}>
                                {baseMorningBalance.toFixed(2)} ₴
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            type="number"
                            min="0"
                            value={newBalanceAmount}
                            onChange={(e) =>
                                onNewBalanceAmountChange(e.target.value)
                            }
                            placeholder="Додаткова сума"
                            className="flex-1"
                        />
                        <Input
                            type="text"
                            min="0"
                            value={newBalanceCategory}
                            onChange={(e) =>
                                onNewBalanceCategoryChange(e.target.value)
                            }
                            placeholder="Джерело"
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            onClick={onAddBalance}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <Button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-full"
                    >
                        Переглянути всі операції ({additionalBalances.length})
                    </Button>

                    <div className="p-3 bg-green-100 rounded-lg border border-green-300">
                        <div className="text-center">
                            <div className="relative inline-block">
                                <span className="text-xl font-bold text-green-700">
                                    {totalMorningBalance.toFixed(2)}
                                </span>
                                <span className="absolute -right-5 top-0 text-lg font-bold text-green-700">
                                    ₴
                                </span>
                            </div>
                            <div className="text-sm text-green-600">
                                Загальний ранковий залишок
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Модальне вікно для додаткових сум */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Додаткові суми"
            >
                {additionalBalances.length === 0 ? (
                    <div className="text-center text-gray-500 py-6">
                        Немає додаткових операцій
                    </div>
                ) : (
                    <div className="mb-4">
                        {additionalBalances.map((item) => (
                            <div
                                key={item.id}
                                className="border-b last:border-b-0"
                            >
                                <div className="flex items-center justify-between px-2 pt-2 bg-white rounded ">
                                    <div className="font-medium">
                                        {item.category}
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="font-medium text-green-600">
                                            {item.amount.toFixed(2)} ₴
                                        </div>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                onRemoveBalance(item.id)
                                            }
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-600 pl-2 pb-2">
                                    {new Date(Number(item.id)).getHours()}:
                                    {new Date(Number(item.id)).getMinutes()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
        </>
    );
}
