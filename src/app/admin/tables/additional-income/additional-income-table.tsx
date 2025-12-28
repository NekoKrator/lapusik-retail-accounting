"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DeleteDialog } from "@/components/data-table/delete-dialog";
import { useAdditionalIncomeStats } from "@/hooks/api/additional-income/use-additional-income";
import { useDeleteManyAdditionalIncome } from "@/hooks/api/additional-income/use-delete-many-additional-income";
import { useTableState } from "@/hooks/use-table-state";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type { AdditionalIncomeOrderBy } from "@/schemas/additional-income/additional-income-order-by-schema";
import type { AdditionalIncomeStats } from "@/schemas/additional-income/additional-income-schema";
import { buildFilterParams } from "@/types/filter-types";
import { additionalIncomeFilterConfigs } from "./components/additional-income-filter-config";
import { columns } from "./components/columns";
import EmptyAdditionalIncome from "./components/empty-additional-income";

export default function AdditionalIncomeTable() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  const { sorting, filters, onSortingChange, onFilterChange } = useTableState(
    "table:additional-income"
  );

  const sort = sorting[0];
  const order = sort?.desc ? "desc" : "asc";

  const filterParams = buildFilterParams(filters);

  const { data, isFetching, refetch } = useAdditionalIncomeStats({
    page: page.toString(),
    limit: limit.toString(),
    orderBy: sort?.id as AdditionalIncomeOrderBy,
    order: sort && order,
    filters: filterParams,
  });

  const { mutateAsync: deleteManyAdditionalIncome } =
    useDeleteManyAdditionalIncome();

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
    <DataTable<AdditionalIncomeStats, AdditionalIncomeStats[]>
      columns={columns}
      data={items}
      emptyComponent={<EmptyAdditionalIncome />}
      filterConfigs={additionalIncomeFilterConfigs}
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
            <span>
              Обрані надходження будуть{" "}
              <span className="font-bold">безповоротно</span> видалені.
            </span>
          }
          onDelete={deleteManyAdditionalIncome}
          selectedRowCount={selectedRowCount}
          table={table}
        />
      )}
      sorting={sorting}
    />
  );
}
