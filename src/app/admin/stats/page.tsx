"use client";

import { Spinner } from "@/components/ui/spinner";
import { useShiftsStats } from "@/hooks/api/shift/use-shift";
import { StatsPage } from "./stats-page";

export default function Page() {
  const { data: rawData } = useShiftsStats({
    order: "asc",
    filters: [
      {
        key: "isClosed",
        value: true,
      },
    ],
  });

  if (!rawData) {
    return (
      <div className="flex size-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const filteredData = rawData.items.map((i) => ({
    ...i,
    openedAt: new Date(i.openedAt),
    closedAt: i.closedAt ? new Date(i.closedAt) : new Date(),
  }));

  return <StatsPage data={filteredData} />;
}
