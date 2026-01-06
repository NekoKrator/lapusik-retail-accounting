import { TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export type StatsCardProps = {
  title: string;
  value: number;
  change: string;
  changeType: string;
};

export default function StatsCard({ ...props }: StatsCardProps) {
  return (
    <Card className="flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm">
      <CardHeader className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
        <CardDescription className="text-muted-foreground text-sm">
          {props.title}
        </CardDescription>
        <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
          {formatCurrency(props.value)}
        </CardTitle>
        <CardAction>
          <Badge
            className={cn(
              "",
              props.changeType === "positive"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            )}
            variant="outline"
          >
            {props.changeType === "positive" ? (
              <TrendingUp className="text-green-500" />
            ) : (
              <TrendingDown className="text-red-500" />
            )}
            <span className="sr-only">
              {props.changeType === "positive" ? "Increased" : "Decreased"} by{" "}
            </span>
            {props.change}
          </Badge>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
