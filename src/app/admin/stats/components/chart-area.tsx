"use client";

import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ShiftStats } from "@/schemas/shift/shift-schema";

const chartConfig = {
  openedAt: {
    label: "openedAt",
  },
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const AREA_LABELS: Record<string, string> = {
  totalCashRegister: "Виторг",
  openingBalance: "Ранковий залишок",
  totalAdditionalIncome: "Дод. надходження",
  totalExpenses: "Витрати",
};

type NumericShiftStatKeys = {
  [K in keyof ShiftStats]: ShiftStats[K] extends number ? K : never;
}[keyof ShiftStats];

export function ChartArea({ data }: { data: ShiftStats[] }) {
  const chartData = Object.entries(
    data.reduce<Record<string, ShiftStats>>((acc, shift) => {
      const dayKey = shift.openedAt.toISOString().slice(0, 10);

      const current = acc[dayKey];

      if (!current) {
        acc[dayKey] = { ...shift };
        return acc;
      }

      acc[dayKey] = (Object.keys(shift) as NumericShiftStatKeys[]).reduce(
        (merged, key) => {
          merged[key] = current[key] + shift[key];
          return merged;
        },
        { ...current }
      );

      return acc;
    }, {})
  ).map(([day, stats]) => ({
    ...stats,
    openedAt: new Date(day),
  }));

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Графік Доходів/Витрат</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          className="aspect-auto h-[250px] w-full"
          config={chartConfig}
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillCashRegister" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#00a63e" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#00a63e" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillOpening" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#0092b8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0092b8" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient
                id="fillAdditionalIncome"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#4f39f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4f39f6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient
                id="fillDesktopDestructive"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#e7000b" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#e7000b" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              axisLine={false}
              dataKey="openedAt"
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return format(date, "d MMMM", { locale: uk });
              }}
              tickLine={false}
              tickMargin={8}
            />
            <YAxis
              axisLine={false}
              minTickGap={32}
              tickLine={false}
              tickMargin={8}
              widths="auto"
            />
            <ChartTooltip
              content={({ active, payload, label }) => {
                if (!(active && payload?.length)) {
                  return null;
                }

                const mappedPayload = [...payload].reverse().map((item) => ({
                  ...item,
                  name: AREA_LABELS[item.dataKey as string] ?? item.dataKey,
                }));

                return (
                  <ChartTooltipContent
                    active={active}
                    indicator="dot"
                    label={format(new Date(label), "d MMMM", { locale: uk })}
                    payload={mappedPayload}
                  />
                );
              }}
              cursor={false}
            />
            <Area
              dataKey="totalExpenses"
              fill="url(#fillDesktopDestructive)"
              stroke="#e7000b"
              type="monotone"
            />
            <Area
              activeDot={false}
              dataKey="openingBalance"
              fill="url(#fillOpening)"
              stackId="income"
              stroke="#0092b8"
              strokeWidth={0}
              type="monotone"
            />
            <Area
              activeDot={false}
              dataKey="totalAdditionalIncome"
              fill="url(#fillAdditionalIncome)"
              stackId="income"
              stroke="#4f39f6"
              strokeWidth={0}
              type="monotone"
            />
            <Area
              dataKey="totalCashRegister"
              fill="url(#fillCashRegister)"
              stackId="income"
              stroke="#00a63e"
              type="monotone"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
