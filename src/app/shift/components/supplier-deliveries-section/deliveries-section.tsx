"use client";

import { RefreshCw, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { ResponsiveTooltip } from "@/components/responsive-tooltip";
import { ResultItem } from "@/components/result-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemGroup } from "@/components/ui/item";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TypographyH3 } from "@/components/ui/typography";
import { formatCurrency } from "@/lib/formatters";
import type { SupplierDeliveryWithSupplier } from "@/schemas/supplier-delivery-schema";
import type { RefetchTanstackQuery } from "@/types/types";
import { CreateDeliveryForm } from "./create-delivery-form";
import DeliveriesEmpty from "./deliveries-empty";
import SuppliersSkeleton from "./deliveries-skeleton";
import DeliveryItem from "./delivery-item";

type DeliveriesSectionProps = {
  deliveries: SupplierDeliveryWithSupplier[] | undefined;
  isLoadingDeliveries: boolean;
  onFetchDelivery: RefetchTanstackQuery<SupplierDeliveryWithSupplier[]>;
};

export default function DeliveriesSection({
  deliveries,
  isLoadingDeliveries,
  onFetchDelivery,
}: DeliveriesSectionProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const totalDebt = useMemo(() => {
    if (!Array.isArray(deliveries) || deliveries.length === 0) {
      return 0;
    }

    return deliveries.reduce(
      (sum, d) =>
        sum + d.price - Number(d.paidByCashier) - Number(d.paidByOwner),
      0
    );
  }, [deliveries]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onFetchDelivery();
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderContent = () => {
    if (isLoadingDeliveries || isRefreshing) {
      return <SuppliersSkeleton />;
    }
    if (!Array.isArray(deliveries) || deliveries.length === 0) {
      return <DeliveriesEmpty />;
    }

    return (
      <ItemGroup className="gap-2">
        <ScrollArea className="[&_[data-slot=scroll-area-viewport]>div]:block! h-[calc(80px*2+8px*1)] md:h-[calc(80px*4+8px*3)]">
          <div className="space-y-2">
            {deliveries.map((d) => (
              <DeliveryItem delivery={d} key={d.id} />
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        <ResultItem
          label="Сума боргів поставок"
          value={formatCurrency(totalDebt)}
          variant="blue"
        />
      </ItemGroup>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-7 w-7 text-blue-600" />
            <TypographyH3>Облік поставок</TypographyH3>
          </div>
          <ResponsiveTooltip message="Оновити постачальників">
            <Button
              disabled={isRefreshing}
              onClick={handleRefresh}
              size="icon-sm"
              type="button"
              variant="outline"
            >
              <RefreshCw
                className={
                  isLoadingDeliveries || isRefreshing ? "animate-spin" : ""
                }
              />
            </Button>
          </ResponsiveTooltip>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Creation form */}
        <CreateDeliveryForm isLoading={isLoadingDeliveries} />

        {/* Supplier items */}
        {renderContent()}
      </CardContent>
    </Card>
  );
}
