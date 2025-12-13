"use client";

import { useQueryClient } from "@tanstack/react-query";
import { TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH3 } from "@/components/ui/typography";
import { useExpensesPaginated } from "@/hooks/api/expense/use-expenses";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { PaginatedTable } from "../paginated-table";
import { columns } from "./components/columns";
import EmptyExpenses from "./components/empty-expenses";

export default function ExpensesTables() {
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

  return (
    <Card className="h-full w-full rounded-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="text-red-600" />
          <TypographyH3>Витрати</TypographyH3>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <PaginatedTable
          columns={columns}
          emptyComponent={<EmptyExpenses />}
          isFetching={isFetching}
          items={items}
          onFetch={handleRefresh}
          onPageChange={setPage}
          onPageSizeChange={setLimit}
          pagination={{
            page,
            pageSize: limit,
            totalPages,
          }}
        />
      </CardContent>
    </Card>
  );
}
