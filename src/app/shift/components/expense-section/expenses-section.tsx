import { RefreshCw, TrendingDown } from "lucide-react";
import { useState } from "react";
import { ResponsiveTooltip } from "@/components/responsive-tooltip";
import { ResultItem } from "@/components/result-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemGroup } from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TypographyH3 } from "@/components/ui/typography";
import { formatCurrency } from "@/lib/formatters";
import type { ExpenseWithInclude } from "@/schemas/expense-schema";
import { CreateExpenseForm } from "./create-expense-form";
import ExpenseEmpty from "./expense-empty";
import ExpenseItem from "./expense-item";
import ExpensesSkeleton from "./expenses-skeleton";

type ExpensesSectionProps = {
  expenses: ExpenseWithInclude[] | undefined;
  onFetchExpenses: () => unknown;
  totalExpenses: number | null;
  isLoadingExpenses: boolean;
};

export function ExpensesSection({
  expenses,
  onFetchExpenses,
  totalExpenses,
  isLoadingExpenses,
}: ExpensesSectionProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onFetchExpenses();
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderContent = () => {
    if (isLoadingExpenses || isRefreshing) {
      return <ExpensesSkeleton />;
    }
    if (!Array.isArray(expenses) || expenses.length === 0) {
      return <ExpenseEmpty />;
    }

    return (
      <ItemGroup className="gap-2">
        <ScrollArea className="[&_[data-slot=scroll-area-viewport]>div]:block! h-[calc(80px*2+8px*1)] md:h-[calc(80px*4+8px*3)]">
          <div className="space-y-2">
            {expenses.map((e) => (
              <ExpenseItem expense={e} key={e.id} />
            ))}
          </div>
        </ScrollArea>

        <ResultItem
          label="Сума витрат"
          value={formatCurrency(Number(totalExpenses))}
          variant="red"
        />
      </ItemGroup>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-7 w-7 text-red-600" />
            <TypographyH3>Витрати (здано)</TypographyH3>
          </div>
          <ResponsiveTooltip message={"Оновити витрати"}>
            <Button
              disabled={isRefreshing}
              onClick={handleRefresh}
              size="icon-sm"
              type="button"
              variant="outline"
            >
              <RefreshCw className={isRefreshing ? "animate-spin" : ""} />
            </Button>
          </ResponsiveTooltip>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <CreateExpenseForm />

        {renderContent()}
      </CardContent>
    </Card>
  );
}
