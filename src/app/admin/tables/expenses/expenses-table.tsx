"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useExpensesPaginated } from "@/hooks/api/expense/use-expenses";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { PaginatedTable } from "../paginated-table";
import { columns } from "./components/columns";
import EmptyExpenses from "./components/empty-expenses";

export default function ExpensesTables() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
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
  );
}
