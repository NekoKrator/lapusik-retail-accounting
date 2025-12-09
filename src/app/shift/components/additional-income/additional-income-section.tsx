import { BanknoteArrowUp, RefreshCw } from "lucide-react";
import { useState } from "react";
import { ResponsiveTooltip } from "@/components/responsive-tooltip";
import { ResultItem } from "@/components/result-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemGroup } from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TypographyH3 } from "@/components/ui/typography";
import { formatCurrency } from "@/lib/formatters";
import type { AdditionalIncomeWithDebtor } from "@/schemas/additional-income-schema";
import type { RefetchTanstackQuery } from "@/types/types";
import AdditionalIncomeEmpty from "./additional-income-empty";
import AdditionalIncomeItem from "./additional-income-item";
import AdditionalIncomeSkeleton from "./additional-income-skeleton";
import { CreateAdditionalIncomeForm } from "./create-additional-income-form";

export type AdditionalIncomeSectionProps = {
  additionalIncome: AdditionalIncomeWithDebtor[] | undefined;
  onFetchAdditionalIncome: RefetchTanstackQuery<AdditionalIncomeWithDebtor[]>;
  totalAdditionalIncome: number | null;
  isLoadingAdditionalIncome: boolean;
};

export function AdditionalIncomeSection({
  additionalIncome,
  onFetchAdditionalIncome,
  totalAdditionalIncome,
  isLoadingAdditionalIncome,
}: AdditionalIncomeSectionProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onFetchAdditionalIncome();
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderContent = () => {
    if (isLoadingAdditionalIncome || isRefreshing) {
      return <AdditionalIncomeSkeleton />;
    }
    if (!Array.isArray(additionalIncome) || additionalIncome.length === 0) {
      return <AdditionalIncomeEmpty />;
    }

    return (
      <ItemGroup className="gap-2">
        <ScrollArea className="[&_[data-slot=scroll-area-viewport]>div]:block! h-[calc(80px*2+8px*1)] md:h-[calc(80px*4+8px*3)]">
          <div className="space-y-2">
            {additionalIncome.map((a) => (
              <AdditionalIncomeItem additionalIncome={a} key={a.id} />
            ))}
          </div>
        </ScrollArea>

        <ResultItem
          label="Сума надходжень"
          value={formatCurrency(Number(totalAdditionalIncome))}
          variant="indigo"
        />
      </ItemGroup>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div className="flex items-center gap-2">
            <BanknoteArrowUp className="h-7 w-7 text-indigo-600" />
            <TypographyH3>Додаткові надходження</TypographyH3>
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
        <CreateAdditionalIncomeForm />

        {renderContent()}
      </CardContent>
    </Card>
  );
}
