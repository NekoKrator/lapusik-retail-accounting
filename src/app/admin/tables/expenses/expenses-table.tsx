"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DeleteDialog } from "@/components/data-table/delete-dialog";
import { useDeleteManyExpense } from "@/hooks/api/expense/use-delete-many-expense";
import { useExpenseStats } from "@/hooks/api/expense/use-expenses";
import { useTableState } from "@/hooks/use-table-state";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type { ExpenseOrderBy } from "@/schemas/expense/expense-order-by-schema";
import type { ExpenseStats } from "@/schemas/expense/expense-schema";
import { buildFilterParams } from "@/types/filter-types";
import { columns } from "./components/columns";
import EmptyExpenses from "./components/empty-expenses";
import { expenseFilterConfigs } from "./components/expense-filter-config";

export default function ExpensesTables() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  const { sorting, filters, onSortingChange, onFilterChange } =
    useTableState("expenses");

  const sort = sorting[0];
  const order = sort?.desc ? "desc" : "asc";

  const filterParams = buildFilterParams(filters);

  const { data, isFetching, refetch } = useExpenseStats({
    page: page.toString(),
    limit: limit.toString(),
    orderBy: sort?.id as ExpenseOrderBy,
    order: sort && order,
    filters: filterParams,
  });

  const { mutateAsync: deleteManyExpense } = useDeleteManyExpense();

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
    <DataTable<ExpenseStats, ExpenseStats[]>
      columns={columns}
      data={items}
      emptyComponent={<EmptyExpenses />}
      filterConfigs={expenseFilterConfigs}
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
              Обрані витрати будуть{" "}
              <span className="font-bold">безповоротно</span> видалені.
            </span>
          }
          onDelete={deleteManyExpense}
          selectedRowCount={selectedRowCount}
          table={table}
        />
      )}
      sorting={sorting}
    />
  );
}
