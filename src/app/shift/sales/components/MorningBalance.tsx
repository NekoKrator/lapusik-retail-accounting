import {
    Card,
    CardContent,
    CardHeader,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Wallet,
    Plus,
    Trash2,
    Info,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import type { BalanceItem, MorningBalanceProps } from "@/types/types";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemTitle,
} from "@/components/ui/item";
import { formatCurrency } from "@/lib/formatters";

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
}: // isLoading = false,
MorningBalanceProps) {
    const getBalanceSourceInfo = () => {
        if (!previousDayInfo) {
            return {
                text: "Немає даних за попередній день",
                icon: AlertCircle,
                color: "text-gray-600",
                bgColor: "bg-gray-50 dark:bg-gray-600/10",
                borderColor: "border-gray-200 dark:border-gray-600/20",
            };
        }

        const hasActualBalance =
            previousDayInfo.actualEveningBalance !== undefined;

        if (hasActualBalance) {
            return {
                text: `Фактичний залишок за ${previousDayInfo.date}`,
                icon: CheckCircle,
                color: "text-green-600",
                bgColor: "bg-green-50 dark:bg-green-600/10",
                borderColor: "border-green-200 dark:border-green-600/20",
            };
        } else {
            return {
                text: `Розрахунковий залишок за ${previousDayInfo.date}`,
                icon: Info,
                color: "text-blue-600",
                bgColor: "bg-blue-50 dark:bg-blue-600/10",
                borderColor: "border-blue-200 dark:border-blue-600/20",
            };
        }
    };

    const sourceInfo = getBalanceSourceInfo();
    const IconComponent = sourceInfo.icon;

    const additionalBalanceItem = (a: BalanceItem) => {
        return (
            <Item key={a.id} variant="outline">
                <ItemContent>
                    <ItemTitle className="text-nowrap">
                        <ScrollArea className="max-w-96">
                            {a.category}
                            <ScrollBar
                                orientation="horizontal"
                                className="translate-y-2"
                            />
                        </ScrollArea>
                    </ItemTitle>
                    <ItemDescription>
                        {new Date(Number(a.id)).getHours()}:
                        {new Date(Number(a.id)).getMinutes()}
                    </ItemDescription>
                </ItemContent>

                <ItemContent>
                    <ItemDescription className="text-base font-semibold text-nowrap text-green-600">
                        {formatCurrency(a.amount)}
                    </ItemDescription>
                </ItemContent>

                <ItemActions>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onRemoveBalance(a.id)}
                        className="text-gray-400 hover:text-destructive hover:bg-red-50 w-9 h-"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </ItemActions>
            </Item>
        );
    };

    const additionalBalancesDialog = (additionalBalances: BalanceItem[]) => {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                        Додаткові надходження ({additionalBalances.length})
                    </Button>
                </DialogTrigger>
                <DialogContent className="md:max-w-196">
                    <DialogHeader>
                        <DialogTitle>Додаткові надходження</DialogTitle>
                        {/* <DialogDescription>
                            Make changes to your profile here. Click save when
                            you&apos;re done.
                        </DialogDescription> */}
                    </DialogHeader>
                    <ScrollArea className="h-[calc(78.6px*4+8px*3)] md:h-[calc(78.6px*5+8px*4)]">
                        <ItemGroup className="gap-2">
                            {additionalBalances
                                .slice()
                                .reverse()
                                .map((a) => additionalBalanceItem(a))}
                        </ItemGroup>
                    </ScrollArea>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Закрити</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-7 w-7 text-green-600" />
                    <TypographyH3>Залишок на ранок</TypographyH3>
                </CardTitle>
                <CardDescription>
                    <TypographyP>
                        Залишок попереднього дня та додаткові надходження до
                        каси
                    </TypographyP>
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
                <Item
                    className={`${sourceInfo.bgColor} ${sourceInfo.borderColor}`}
                >
                    <ItemContent>
                        <ItemTitle className="font-normal">
                            <IconComponent
                                className={`h-4 w-4 ${sourceInfo.color}`}
                            />
                            <span className={`${sourceInfo.color}`}>
                                Базова сума{" "}
                                {previousDayInfo && `(${previousDayInfo.date})`}
                            </span>
                        </ItemTitle>
                    </ItemContent>
                    <ItemContent>
                        <ItemDescription className={`${sourceInfo.color}`}>
                            {formatCurrency(baseMorningBalance)}
                        </ItemDescription>
                    </ItemContent>
                </Item>

                <div className="flex gap-3">
                    <Input
                        id="newBalanceAmount"
                        type="number"
                        min="0"
                        value={newBalanceAmount}
                        onChange={(e) =>
                            onNewBalanceAmountChange(e.target.value)
                        }
                        placeholder="Додаткова сума"
                    />
                    <Input
                        id="newBalanceCategory"
                        type="text"
                        value={newBalanceCategory}
                        onChange={(e) =>
                            onNewBalanceCategoryChange(e.target.value)
                        }
                        placeholder="Джерело"
                    />
                    <Button
                        type="button"
                        onClick={onAddBalance}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>

                {/* Additional Balances Dialog(Modal)*/}
                {additionalBalancesDialog(additionalBalances)}

                <Item
                    variant="outline"
                    className="bg-green-50 border-green-200 dark:bg-green-600/10 dark:border-green-600/20"
                >
                    <ItemContent className="items-center">
                        <ItemTitle className="text-2xl text-green-600">
                            {formatCurrency(totalMorningBalance)}
                        </ItemTitle>
                        <ItemDescription className="text-green-600">
                            Загальний ранковий залишок
                        </ItemDescription>
                    </ItemContent>
                </Item>
            </CardContent>
        </Card>
    );
}
