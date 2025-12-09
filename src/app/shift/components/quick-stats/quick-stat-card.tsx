import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyH4, TypographyMuted } from "@/components/ui/typography";
import { formatCurrency } from "@/lib/formatters";

type QuickStatCardProps = {
  icon: LucideIcon;
  value: number | null;
  label: string;
  valueClassName: string;
};

function QuickStatCard({
  icon: Icon,
  value,
  label,
  valueClassName,
}: QuickStatCardProps) {
  const isDataLoaded = value !== null;

  return (
    <Card>
      <CardContent className="flex flex-1 flex-col items-center justify-center gap-1 overflow-x-hidden py-4">
        {isDataLoaded ? (
          <>
            <Icon className={`h-5 w-5 ${valueClassName}`} />

            <ScrollArea className="w-full">
              <TypographyH4
                className={`text-center font-bold ${valueClassName}`}
              >
                {formatCurrency(value)}
              </TypographyH4>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <TypographyMuted className="flex-1 text-center">
              {label}
            </TypographyMuted>
          </>
        ) : (
          <>
            <Skeleton className="h-5 w-5 rounded-sm" />
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-5 w-20" />
          </>
        )}
      </CardContent>
    </Card>
  );
}

export { QuickStatCard };
