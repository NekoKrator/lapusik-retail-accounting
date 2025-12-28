"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Plus, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DeleteDialog } from "@/components/data-table/delete-dialog";
import { Dialog } from "@/components/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteManySupplier } from "@/hooks/api/supplier/use-delete-many-supplier";
import { useSuppliersStats } from "@/hooks/api/supplier/use-suppliers";
import { useTableState } from "@/hooks/use-table-state";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type { SupplierOrderBy } from "@/schemas/supplier/supplier-order-by-schema";
import type { SupplierStats } from "@/schemas/supplier/supplier-schema";
import { buildFilterParams } from "@/types/filter-types";
import { columns } from "./components/columns";
import { CreateSupplierForm } from "./components/create-supplier-form";
import EmptySuppliers from "./components/empty-suppliers";
import { supplierFilterConfigs } from "./components/supplier-filter-config";

export default function SuppliersTable() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  const { sorting, filters, onSortingChange, onFilterChange } =
    useTableState("table:suppliers");

  const sort = sorting[0];
  const order = sort?.desc ? "desc" : "asc";

  const filterParams = buildFilterParams(filters);

  const { data, isFetching, refetch } = useSuppliersStats({
    page: page.toString(),
    limit: limit.toString(),
    orderBy: sort?.id as SupplierOrderBy,
    order: sort && order,
    filters: filterParams,
  });

  const { mutateAsync: deleteManySupplier } = useDeleteManySupplier();

  const handleRefresh = async () => {
    queryClient.removeQueries({ queryKey: [API_ENDPOINTS.SUPPLIER] });
    await refetch();
  };

  useEffect(() => {
    if (data?.totalPages) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  const items = data?.items ?? [];

  return (
    <DataTable<SupplierStats, SupplierStats[]>
      additionalActions={
        <Dialog
          description=""
          title={
            <div className="flex items-center gap-2">
              <Truck />
              <p>Додати постачальника</p>
            </div>
          }
          trigger={
            <Button className="" size="sm" type="button" variant="outline">
              <Plus />
              Додати
            </Button>
          }
        >
          <CreateSupplierForm />
        </Dialog>
      }
      columns={columns}
      data={items}
      emptyComponent={<EmptySuppliers />}
      filterConfigs={supplierFilterConfigs}
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
                Обрані постачальники будуть{" "}
                <span className="font-bold">безповоротно</span> видалені.
              </span>
              <span>
                Пов'язані поставки будуть{" "}
                <span className="font-bold">безповоротно</span> видалені.
              </span>
            </span>
          }
          onDelete={deleteManySupplier}
          selectedRowCount={selectedRowCount}
          table={table}
        />
      )}
      sorting={sorting}
    />
  );
}
