"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useShiftPaginated } from "@/hooks/api/shift/use-shift";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { PaginatedTable } from "../paginated-table";
import { columns } from "./components/columns";
import EmptyShifts from "./components/empty-shifts";

export default function ShiftsTable() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
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

  return (
    <PaginatedTable
      columns={columns}
      emptyComponent={<EmptyShifts />}
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
