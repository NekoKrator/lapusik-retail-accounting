"use client";

import { useQueryClient } from "@tanstack/react-query";
import { TrendingDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyH3 } from "@/components/ui/typography";
import { useExpensesPaginated } from "@/hooks/api/expense/use-expenses";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type { ExpenseWithInclude } from "@/schemas/expense-schema";
import { columns } from "./components/columns";
import EmptyExpenses from "./components/empty-expenses";

export default function Page() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const { data, isFetching, refetch } = useExpensesPaginated({
    page,
    limit,
  });

  const handleRefresh = async () => {
    queryClient.removeQueries({ queryKey: [API_ENDPOINTS.EXPENSE] });
    await refetch();
  };

  useEffect(() => {
    if (data?.totalPages) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  const items = data?.items ?? [];

  const tableData = useMemo<ExpenseWithInclude[]>(
    () =>
      isFetching && !data
        ? Array.from<ExpenseWithInclude>({
            length: 4,
          }).fill({} as ExpenseWithInclude)
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
          <TrendingDown className="text-red-600" />
          <TypographyH3>Витрати</TypographyH3>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <DataTable<ExpenseWithInclude, ExpenseWithInclude[]>
          columns={tableColumns}
          data={tableData}
          emptyComponent={<EmptyExpenses />}
          isLoading={isFetching}
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
