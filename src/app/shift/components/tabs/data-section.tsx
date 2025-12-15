"use client";

import { RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import { ResponsiveTooltip } from "@/components/responsive-tooltip";
import { ResultItem } from "@/components/result-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemGroup } from "@/components/ui/item";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TypographyH3 } from "@/components/ui/typography";

type DataSectionProps<T> = {
  title: string;
  icon: ReactNode;

  items: T[] | undefined;
  isLoading: boolean;

  onRefresh: () => void;

  renderItem: (item: T) => ReactNode;
  renderCreateForm?: ReactNode;

  emptyState: ReactNode;
  skeleton: ReactNode;

  resultLabel?: string;
  resultValue?: string;
  resultVariant?: "blue" | "green" | "red" | "orange" | "indigo" | "yellow";
};

export function DataSection<T>({
  title,
  icon,
  items,
  isLoading,
  onRefresh,
  renderItem,
  renderCreateForm,
  emptyState,
  skeleton,
  resultLabel,
  resultValue,
  resultVariant = "blue",
}: DataSectionProps<T>) {
  const renderContent = () => {
    if (isLoading) {
      return skeleton;
    }
    if (!items || items.length === 0) {
      return emptyState;
    }

    return (
      <ItemGroup className="gap-2">
        <ScrollArea className="[&_[data-slot=scroll-area-viewport]>div]:block! h-[calc(80px*2+8px*1)] md:h-[calc(80px*4+8px*3)]">
          <div className="space-y-2">{items.map(renderItem)}</div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        {resultLabel && resultValue && (
          <ResultItem
            label={resultLabel}
            value={resultValue}
            variant={resultVariant}
          />
        )}
      </ItemGroup>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <TypographyH3>{title}</TypographyH3>
          </div>

          <ResponsiveTooltip message="Оновити">
            <Button
              disabled={isLoading}
              onClick={onRefresh}
              size="icon-sm"
              variant="outline"
            >
              <RefreshCw className={isLoading ? "animate-spin" : ""} />
            </Button>
          </ResponsiveTooltip>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {renderCreateForm}
        {renderContent()}
      </CardContent>
    </Card>
  );
}
