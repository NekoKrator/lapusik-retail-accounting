"use client";

import { RefreshCw, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { ResponsiveTooltip } from "@/components/responsive-tooltip";
import { ResultItem } from "@/components/result-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemGroup } from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TypographyH3 } from "@/components/ui/typography";
import type { Debtor } from "@/generated/prisma/client";
import { formatCurrency } from "@/lib/formatters";
import type { RefetchTanstackQuery } from "@/types/types";
import { CreateDebtorForm } from "./create-debtor-form";
import DebtorItem from "./debtor-item";
import DebtorsEmpty from "./debtors-empty";
import DebtorsSkeleton from "./debtors-skeleton";

type DebtorsSectionProps = {
  debtors: Debtor[] | undefined;
  isLoadingDebtors: boolean;
  onFetchDebtor: RefetchTanstackQuery<Debtor[]>;
};

export default function DebtorsSection({
  debtors,
  isLoadingDebtors,
  onFetchDebtor,
}: DebtorsSectionProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const totalDebt = useMemo(() => {
    if (!Array.isArray(debtors) || debtors.length === 0) {
      return 0;
    }

    return debtors.reduce((sum, d) => sum + d.debt - d.paid, 0);
  }, [debtors]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onFetchDebtor();
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderContent = () => {
    if (isLoadingDebtors || isRefreshing) {
      return <DebtorsSkeleton />;
    }
    if (!Array.isArray(debtors) || debtors.length === 0) {
      return <DebtorsEmpty />;
    }

    return (
      <ItemGroup className="gap-2">
        <ScrollArea className="[&_[data-slot=scroll-area-viewport]>div]:block! h-[calc(80px*2+8px*1)] md:h-[calc(80px*4+8px*3)]">
          <div className="space-y-2">
            {debtors.map((d) => (
              <DebtorItem debtor={d} key={d.id} />
            ))}
          </div>
        </ScrollArea>

        <ResultItem
          label="Сума боргів"
          value={formatCurrency(totalDebt)}
          variant="orange"
        />
      </ItemGroup>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-7 w-7 text-orange-600" />
            <TypographyH3>Облік боржників</TypographyH3>
          </div>
          <ResponsiveTooltip message="Оновити боржників">
            <Button
              disabled={isRefreshing}
              onClick={handleRefresh}
              size="icon-sm"
              type="button"
              variant="outline"
            >
              <RefreshCw
                className={
                  isLoadingDebtors || isRefreshing ? "animate-spin" : ""
                }
              />
            </Button>
          </ResponsiveTooltip>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Creation form */}
        <CreateDebtorForm isLoading={isLoadingDebtors} />

        {/* Debtor items */}
        {renderContent()}
      </CardContent>
    </Card>
  );
}
