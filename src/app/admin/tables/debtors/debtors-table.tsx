"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DeleteDialog } from "@/components/data-table/delete-dialog";
import { useDebtorsStats } from "@/hooks/api/debtor/use-debtors";
import { useDeleteManyDebtor } from "@/hooks/api/debtor/use-delete-many-debtor";
import { useTableState } from "@/hooks/use-table-state";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type { DebtorOrderBy } from "@/schemas/debtor/debtor-order-by-schema";
import type { DebtorStats } from "@/schemas/debtor/debtor-schema";
import { buildFilterParams } from "@/types/filter-types";
import { columns } from "./components/columns";
import { debtorFilterConfigs } from "./components/debtor-filter-config";
import EmptyDebtors from "./components/empty-debtors";

export default function DebtorsTable() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  const { sorting, filters, onSortingChange, onFilterChange } =
    useTableState("table:debtors");

  const sort = sorting[0];
  const order = sort?.desc ? "desc" : "asc";

  const filterParams = buildFilterParams(filters);

  const { data, isFetching, refetch } = useDebtorsStats({
    page: page.toString(),
    limit: limit.toString(),
    orderBy: sort?.id as DebtorOrderBy,
    order: sort && order,
    filters: filterParams,
  });

  const { mutateAsync: deleteManyDebtor } = useDeleteManyDebtor();

  const handleRefresh = async () => {
    queryClient.removeQueries({ queryKey: [API_ENDPOINTS.DEBTOR] });
    await refetch();
  };

  useEffect(() => {
    if (data?.totalPages) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  const items = data?.items ?? [];

  return (
    <DataTable<DebtorStats, DebtorStats[]>
      columns={columns}
      data={items}
      emptyComponent={<EmptyDebtors />}
      filterConfigs={debtorFilterConfigs}
      filters={filters}
      isLoading={isFetching}
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
                Обрані боржники будуть{" "}
                <span className="font-bold">безповоротно</span> видалені.
              </span>
              <span>
                Пов'язані борги будуть{" "}
                <span className="font-bold">безповоротно</span> видалені.
              </span>
            </span>
          }
          onDelete={deleteManyDebtor}
          selectedRowCount={selectedRowCount}
          table={table}
        />
      )}
      sorting={sorting}
    />
  );
}
