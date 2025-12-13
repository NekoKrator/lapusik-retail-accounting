"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useCreateSupplier } from "@/hooks/api/supplier/use-create-supplier";
import { useSuppliersPaginated } from "@/hooks/api/supplier/use-suppliers";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { PaginatedTable } from "../paginated-table";
import { columns } from "./components/columns";
import { CreateSupplierForm } from "./components/create-supplier-form";
import EmptySuppliers from "./components/empty-suppliers";

export default function SuppliersTable() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  const { data, isFetching, refetch } = useSuppliersPaginated({
    page,
    limit,
    include: "deliveries",
  });

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

  const { mutateAsync: createSupplier } = useCreateSupplier();

  const suppliersStats = useMemo(
    () =>
      items?.map((s) => {
        const stats = s.deliveries.reduce(
          (acc, d) => {
            const paidByCashier = Number(d.paidByCashier) || 0;
            const paidByOwner = Number(d.paidByOwner) || 0;
            const price = Number(d.price) || 0;

            const debt = price - paidByCashier - paidByOwner;
            const isPaidOff = d.isPaidOff;

            acc.operationsCount += 1;

            if (isPaidOff) {
              if (debt > 0) {
                acc.canceledOperationsCount += 1;
              } else {
                acc.paidOperationsCount += 1;
              }
            } else {
              acc.currentOperationsCount += 1;
              acc.currentDebt += debt;
            }

            acc.paidByCashier += paidByCashier;
            acc.paidByOwner += paidByOwner;

            return acc;
          },
          {
            operationsCount: 0,
            currentOperationsCount: 0,
            paidOperationsCount: 0,
            canceledOperationsCount: 0,
            paidByCashier: 0,
            paidByOwner: 0,
            currentDebt: 0,
          }
        );

        return {
          id: s.id,
          name: s.name,
          ...stats,
          totalPaid: stats.paidByCashier + stats.paidByOwner,
        };
      }),
    [items]
  );

  return (
    <div className="flex flex-col gap-8">
      <CreateSupplierForm onCreate={createSupplier} />

      <PaginatedTable
        columns={columns}
        emptyComponent={<EmptySuppliers />}
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
        transformItems={() => suppliersStats}
      />
    </div>
  );
}
