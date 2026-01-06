import type { ChangeResult } from "@/types/stats-comparison";

export function useStatsChange(
  current: Record<string, number>,
  previous: Record<string, number>
) {
  const getChange = (key: string): ChangeResult => {
    const currentValue = current[key] ?? 0;
    const previousValue = previous[key] ?? 0;

    if (previousValue === 0) {
      return { change: "0%", changeType: "positive" };
    }

    const diff = ((currentValue - previousValue) / previousValue) * 100;

    return {
      change: `${diff.toFixed(1)}%`,
      changeType: diff >= 0 ? "positive" : "negative",
    };
  };

  return { getChange };
}
