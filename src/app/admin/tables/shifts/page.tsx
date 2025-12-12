"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Briefcase } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyH3 } from "@/components/ui/typography";
import type { Shift } from "@/generated/prisma/client";
import { useShiftPaginated } from "@/hooks/api/shift/use-shift";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { columns } from "./components/columns";
import EmptyShifts from "./components/empty-shifts";

export default function Page() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const { data, isFetching, refetch } = useShiftPaginated({
    page,
    limit,
  });

  const handleRefresh = async () => {
    queryClient.removeQueries({ queryKey: [API_ENDPOINTS.SHIFT] });
    await refetch();
  };

  useEffect(() => {
    if (data?.totalPages) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  const items = data?.items ?? [];

  const tableData = useMemo<Shift[]>(
    () =>
      isFetching && !data
        ? Array.from<Shift>({ length: 4 }).fill({} as Shift)
        : items,
    [isFetching, items, data]
  );

  const tableColumns = useMemo(
    () =>
      isFetching
        ? columns.map((column) => ({
            ...column,
            cell: () => <Skeleton className="h-5" />,
            footer: () => <Skeleton className="h-5" />,
          }))
        : columns,
    [isFetching]
  );

  return (
    <Card className="h-full w-full rounded-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="text-purple-600" />
          <TypographyH3>Робочі зміни</TypographyH3>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <DataTable<Shift, Shift[]>
          columns={tableColumns}
          data={tableData}
          emptyComponent={<EmptyShifts />}
          onFetch={handleRefresh}
          onPageChange={setPage}
          onPageSizeChange={setLimit}
          pagination={{
            page,
            limit,
            totalPages,
          }}
        />
      </CardContent>
    </Card>
  );
}
