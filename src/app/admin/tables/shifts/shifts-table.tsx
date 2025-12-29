"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DeleteDialog } from "@/components/data-table/delete-dialog";
import { useDeleteManyShift } from "@/hooks/api/shift/use-delete-many-shift";
import { useShiftsStats } from "@/hooks/api/shift/use-shift";
import { useTableState } from "@/hooks/use-table-state";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type { ShiftOrderBy } from "@/schemas/shift/shift-order-by-schema";
import type { ShiftStats } from "@/schemas/shift/shift-schema";
import { buildFilterParams } from "@/types/filter-types";
import { columns } from "./components/columns";
import EmptyShifts from "./components/empty-shifts";
import { shiftFilterConfigs } from "./components/shift-filter-config";

export default function ShiftsTable() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  const { sorting, filters, onSortingChange, onFilterChange } =
    useTableState("shifts");

  const sort = sorting[0];
  const order = sort?.desc ? "desc" : "asc";

  const filterParams = buildFilterParams(filters);

  const { data, isFetching, refetch } = useShiftsStats({
    page: page.toString(),
    limit: limit.toString(),
    orderBy: sort?.id as ShiftOrderBy,
    order: sort && order,
    filters: filterParams,
  });

  const { mutateAsync: deleteManyShift } = useDeleteManyShift();

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
    <DataTable<ShiftStats, ShiftStats[]>
      columns={columns}
      data={items}
      emptyComponent={<EmptyShifts />}
      filterConfigs={shiftFilterConfigs}
      filters={filters}
      isLoading={isFetching}
      onDelete={deleteManyShift}
      onFetch={handleRefresh}
      onFilterChange={onFilterChange}
      onPageChange={setPage}
      onPageSizeChange={setLimit}
      onSortingChange={onSortingChange}
      pagination={{
        page,
        pageSize: limit,
        totalPages,
      }}
      renderDeleteDialog={({ selectedRowCount, table }) => (
        <DeleteDialog
          description={
            <span className="flex flex-col gap-2">
              <span>
                Обрані робочі зміни будуть{" "}
                <span className="font-bold">безповоротно</span> видалені.
              </span>
              <span>
                Пов'язані витрати та надходження будуть{" "}
                <span className="font-bold">безповоротно</span> видалені.
              </span>
            </span>
          }
          onDelete={deleteManyShift}
          selectedRowCount={selectedRowCount}
          table={table}
        />
      )}
      sorting={sorting}
    />
  );
}
