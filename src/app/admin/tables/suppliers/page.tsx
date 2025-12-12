"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyH3 } from "@/components/ui/typography";
import { useCreateSupplier } from "@/hooks/api/supplier/use-create-supplier";
import { useSuppliersPaginated } from "@/hooks/api/supplier/use-suppliers";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type { SupplierStats } from "@/schemas/supplier-schema";
import { columns } from "./components/columns";
import { CreateSupplierForm } from "./components/create-supplier-form";
import EmptySuppliers from "./components/empty-suppliers";

export default function Page() {
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

  const tableData = useMemo<SupplierStats[]>(
    () =>
      isFetching && !data
        ? Array.from<SupplierStats>({ length: 4 }).fill({} as SupplierStats)
        : suppliersStats,
    [isFetching, suppliersStats, data]
  );

  const tableColumns = useMemo(
    () =>
      isFetching
        ? columns.map((column) => ({
            ...column,
            cell: () => <Skeleton className="h-5" />,
            footer: () => <Skeleton className="h-5" />,
          }))
        : columns,
    [isFetching]
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

        <DataTable<SupplierStats, SupplierStats[]>
          columns={tableColumns}
          data={tableData}
          emptyComponent={<EmptySuppliers />}
          onFetch={handleRefresh}
          onPageChange={setPage}
          onPageSizeChange={setLimit}
          pagination={{
            page,
            limit,
            totalPages,
          }}
        />
      </CardContent>
    </Card>
  );
}
