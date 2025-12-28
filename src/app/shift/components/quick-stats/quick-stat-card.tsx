import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyH4, TypographyMuted } from "@/components/ui/typography";
import { formatCurrency } from "@/lib/formatters";

type QuickStatCardProps = {
  icon: LucideIcon;
  value: number;
  label: string;
  valueClassName: string;
  isFetching: boolean;
};

function QuickStatCard({
  icon: Icon,
  value,
  label,
  valueClassName,
  isFetching,
}: QuickStatCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-1 flex-col items-center justify-center gap-1 overflow-x-hidden py-4">
        <Icon className={`h-5 w-5 ${valueClassName}`} />

        {isFetching ? (
          <Skeleton className="h-7 w-24" />
        ) : (
          <TypographyH4 className={`text-nowrap font-bold ${valueClassName}`}>
            {formatCurrency(value)}
          </TypographyH4>
        )}

        <TypographyMuted className="flex-1 text-center">
          {label}
        </TypographyMuted>
      </CardContent>
    </Card>
  );
}

export { QuickStatCard };
