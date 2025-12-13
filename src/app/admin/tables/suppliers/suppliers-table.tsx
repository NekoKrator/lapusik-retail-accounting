"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH3 } from "@/components/ui/typography";
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
  const [limit, setLimit] = useState(10);
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
        const operationsCount = s.deliveries.length;
        const paidByCashier = s.deliveries.reduce(
          (sum, d) => sum + Number(d.paidByCashier),
          0
        );
        const paidByOwner = s.deliveries.reduce(
          (sum, d) => sum + Number(d.paidByOwner),
          0
        );
        const totalPaid = paidByCashier + paidByOwner;
        const currentDebt = s.deliveries.reduce(
          (sum, d) =>
            sum +
            Number(d.price - Number(d.paidByCashier) - Number(d.paidByOwner)),
          0
        );
        return {
          id: s.id,
          name: s.name,
          operationsCount,
          paidByCashier,
          paidByOwner,
          totalPaid,
          currentDebt,
        };
      }),
    [items]
  );
  return (
    <Card className="h-full w-full rounded-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="text-blue-600" />
          <TypographyH3>Постачальники</TypographyH3>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
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
      </CardContent>
    </Card>
  );
}
