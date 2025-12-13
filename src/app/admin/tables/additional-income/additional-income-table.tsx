"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAdditionalIncomePaginated } from "@/hooks/api/additional-income/use-additional-income";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { PaginatedTable } from "../paginated-table";
import { columns } from "./components/columns";
import EmptyAdditionalIncome from "./components/empty-additional-income";

export default function AdditionalIncomeTable() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
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

  return (
    <PaginatedTable
      columns={columns}
      emptyComponent={<EmptyAdditionalIncome />}
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
