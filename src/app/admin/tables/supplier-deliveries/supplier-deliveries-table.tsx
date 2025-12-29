"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DeleteDialog } from "@/components/data-table/delete-dialog";
import { useDeleteManySupplierDelivery } from "@/hooks/api/supplier-deliveries/use-delete-many-supplier-delivery";
import { useSupplierDeliveriesStats } from "@/hooks/api/supplier-deliveries/use-supplier-deliveries";
import { useTableState } from "@/hooks/use-table-state";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type { SupplierDeliveryOrderBy } from "@/schemas/supplier-delivery/supplier-delivery-order-by-schema";
import type { SupplierDeliveryStats } from "@/schemas/supplier-delivery/supplier-delivery-schema";
import { buildFilterParams } from "@/types/filter-types";
import { columns } from "./components/columns";
import EmptySupplierDelivery from "./components/empty-supplier-deliveries";
import { supplierDeliveryFilterConfigs } from "./components/supplier-delivery-filter-config";

export default function SupplierDeliveriesTable() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  const { sorting, filters, onSortingChange, onFilterChange } = useTableState(
    "supplier-deliveries"
  );

  const sort = sorting[0];
  const order = sort?.desc ? "desc" : "asc";

  const filterParams = buildFilterParams(filters);

  const { data, isFetching, refetch } = useSupplierDeliveriesStats({
    page: page.toString(),
    limit: limit.toString(),
    orderBy: sort?.id as SupplierDeliveryOrderBy,
    order: sort && order,
    filters: filterParams,
  });

  const { mutateAsync: deleteManySupplierDelivery } =
    useDeleteManySupplierDelivery();

  const handleRefresh = async () => {
    queryClient.removeQueries({ queryKey: [API_ENDPOINTS.SUPPLIER_DELIVERY] });
    await refetch();
  };

  useEffect(() => {
    if (data?.totalPages) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  const items = data?.items ?? [];

  return (
    <DataTable<SupplierDeliveryStats, SupplierDeliveryStats[]>
      columns={columns}
      data={items}
      emptyComponent={<EmptySupplierDelivery />}
      filterConfigs={supplierDeliveryFilterConfigs}
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
              Обрані поставки будуть{" "}
              <span className="font-bold">безповоротно</span> видалені.
            </span>
          }
          onDelete={deleteManySupplierDelivery}
          selectedRowCount={selectedRowCount}
          table={table}
        />
      )}
      sorting={sorting}
    />
  );
}
