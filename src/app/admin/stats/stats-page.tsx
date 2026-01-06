"use client";

import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStatsChange } from "@/hooks/use-stats-change";
import type { ShiftStats } from "@/schemas/shift/shift-schema";
import { ChartArea } from "./components/chart-area";
import StatsCards from "./components/stats-cards";

type StatsChartProps = { data: ShiftStats[] };
type Period = "1d" | "7d" | "30d" | "3m" | "6m" | "12m";
type CustomRange = { from: Date; to: Date };

const periods: { label: string; value: Period }[] = [
  { label: "1 день", value: "1d" },
  { label: "7 днів", value: "7d" },
  { label: "30 днів", value: "30d" },
  { label: "3 місяці", value: "3m" },
  { label: "6 місяців", value: "6m" },
  { label: "12 місяців", value: "12m" },
];

function sumMetrics(data: ShiftStats[]) {
  return data.reduce<Record<string, number>>((acc, item) => {
    for (const [key, value] of Object.entries(item)) {
      if (typeof value === "number" && Number.isFinite(value)) {
        acc[key] = (acc[key] ?? 0) + value;
      }
    }
    return acc;
  }, {});
}

function getPresetRange(period: Period): CustomRange {
  const now = new Date();
  const to = new Date(now);
  const from = new Date(now);

  switch (period) {
    case "1d":
      from.setDate(now.getDate() - 1);
      break;
    case "7d":
      from.setDate(now.getDate() - 7);
      break;
    case "30d":
      from.setDate(now.getDate() - 30);
      break;
    case "3m":
      from.setMonth(now.getMonth() - 3);
      break;
    case "6m":
      from.setMonth(now.getMonth() - 6);
      break;
    case "12m":
      from.setFullYear(now.getFullYear() - 1);
      break;
    default:
      from.setDate(now.getDate() - 1);
      break;
  }

  return { from, to };
}

export function StatsPage({ data }: StatsChartProps) {
  const [selectedPreset, setSelectedPreset] = useState<Period>("7d");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    getPresetRange("7d")
  );
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const departments = useMemo(() => {
    const set = new Set(data.map((d) => d.displayUsername));
    return ["all", ...Array.from(set)];
  }, [data]);

  const handlePresetChange = (preset: Period) => {
    setSelectedPreset(preset);
    setDateRange(getPresetRange(preset));
  };

  const filteredCurrentData = useMemo(() => {
    if (!(dateRange?.from && dateRange.to)) {
      return [];
    }
    const start = dateRange.from.getTime();
    const end = dateRange.to.getTime();
    return data.filter((d) => {
      if (
        selectedDepartment !== "all" &&
        d.displayUsername !== selectedDepartment
      ) {
        return false;
      }
      const ts = new Date(d.openedAt).getTime();
      return ts >= start && ts <= end;
    });
  }, [data, selectedDepartment, dateRange]);

  const filteredPreviousData = useMemo(() => {
    if (!(dateRange?.from && dateRange.to)) {
      return [];
    }
    const duration = dateRange.to.getTime() - dateRange.from.getTime();
    const start = dateRange.from.getTime() - duration;
    const end = dateRange.from.getTime();
    return data.filter((d) => {
      if (
        selectedDepartment !== "all" &&
        d.displayUsername !== selectedDepartment
      ) {
        return false;
      }
      const ts = new Date(d.openedAt).getTime();
      return ts >= start && ts <= end;
    });
  }, [data, selectedDepartment, dateRange]);

  const currentAggregated = sumMetrics(filteredCurrentData);
  const previousAggregated = sumMetrics(filteredPreviousData);
  const { getChange } = useStatsChange(currentAggregated, previousAggregated);

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="px-2 has-[>svg]:px-2.5"
              type="button"
              variant="outline"
            >
              <CalendarDays />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0">
            <Calendar
              captionLayout="dropdown"
              className="rounded-lg border shadow-sm"
              defaultMonth={dateRange?.from}
              formatters={{
                formatMonthDropdown: (month: Date) =>
                  format(month, "LLLL", { locale: uk }),
              }}
              locale={uk}
              mode="range"
              onSelect={setDateRange}
              selected={dateRange}
            />
          </PopoverContent>
        </Popover>

        <Select
          defaultValue={selectedPreset}
          onValueChange={(v) => handlePresetChange(v as Period)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Виберіть період" />
          </SelectTrigger>
          <SelectContent>
            {periods.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select defaultValue="all" onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Виберіть відділ" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>
                {d === "all" ? "Всі відділи" : d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <StatsCards
        terminalRegister={{
          title: "Термінал",
          value: currentAggregated.terminalRegister ?? 0,
          ...getChange("terminalRegister"),
        }}
        totalCashRegister={{
          title: "Виторг",
          value: currentAggregated.totalCashRegister ?? 0,
          ...getChange("totalCashRegister"),
        }}
        totalExpenses={{
          title: "Витрати",
          value: currentAggregated.totalExpenses ?? 0,
          ...getChange("totalExpenses"),
        }}
      />

      <ChartArea data={filteredCurrentData} />
    </div>
  );
}
