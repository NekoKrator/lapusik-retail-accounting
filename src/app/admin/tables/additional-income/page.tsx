"use client";

import { useQueryClient } from "@tanstack/react-query";
import { BanknoteArrowUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyH3 } from "@/components/ui/typography";
import { useAdditionalIncomePaginated } from "@/hooks/api/additional-income/use-additional-income";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type { AdditionalIncomeWithDebtor } from "@/schemas/additional-income-schema";
import { columns } from "./components/columns";
import EmptyAdditionalIncome from "./components/empty-additional-income";

export default function Page() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const { data, isFetching, refetch } = useAdditionalIncomePaginated({
    page,
    limit,
  });

  const handleRefresh = async () => {
    queryClient.removeQueries({ queryKey: [API_ENDPOINTS.ADDITIONAL_INCOME] });
    await refetch();
  };

  useEffect(() => {
    if (data?.totalPages) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  const items = data?.items ?? [];

  const tableData = useMemo<AdditionalIncomeWithDebtor[]>(
    () =>
      isFetching && !data
        ? Array.from<AdditionalIncomeWithDebtor>({ length: 4 }).fill(
            {} as AdditionalIncomeWithDebtor
          )
        : items,
    [isFetching, data, items]
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
          <BanknoteArrowUp className="text-blue-600" />
          <TypographyH3>Додаткові надходження</TypographyH3>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <DataTable<AdditionalIncomeWithDebtor, AdditionalIncomeWithDebtor[]>
          columns={tableColumns}
          data={tableData}
          emptyComponent={<EmptyAdditionalIncome />}
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
