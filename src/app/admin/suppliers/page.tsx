"use client";

import { Truck } from "lucide-react";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyH3 } from "@/components/ui/typography";
import { useCreateSupplier } from "@/hooks/api/supplier/use-create-supplier";
import { useDeleteSupplier } from "@/hooks/api/supplier/use-delete-supplier";
import { useSuppliers } from "@/hooks/api/supplier/use-suppliers";
import { useUpdateSupplier } from "@/hooks/api/supplier/use-update-supplier";
import type {
  SupplierStats,
  SupplierUpdateInput,
} from "@/schemas/supplier-schema";
import { CreateSupplierForm } from "./components/create-supplier-form";
import { columns } from "./components/table/columns";
import { DataTable } from "./components/table/data-table";

export default function Page() {
  const {
    data: suppliers,
    isLoading: isLoadingData,
    refetch: fetchSupplier,
  } = useSuppliers();

  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();

  const suppliersStats = useMemo(
    () =>
      suppliers?.map((s) => {
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
    [suppliers]
  );

  const handleCreate = async (payload: SupplierUpdateInput) => {
    await createSupplier.mutateAsync(payload);
  };

  const handleUpdate = async (id: string, payload: SupplierUpdateInput) => {
    await updateSupplier.mutateAsync({ id, payload });
  };

  const tableData = useMemo<SupplierStats[]>(
    () =>
      isLoadingData && !suppliersStats
        ? Array.from<SupplierStats>({ length: 5 }).fill({} as SupplierStats)
        : suppliersStats || [],
    [isLoadingData, suppliersStats]
  );

  const tableColumns = useMemo(
    () =>
      isLoadingData
        ? columns.map((column) => ({
            ...column,
            cell: () => <Skeleton className="h-8" />,
            footer: () => <Skeleton className="h-8" />,
          }))
        : columns,
    [isLoadingData]
  );

  const emptyTable = () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Truck className="text-blue-600" />
        </EmptyMedia>
        <EmptyTitle>Постачальників не знайдено</EmptyTitle>
        <EmptyDescription>
          Наразі у вас немає постачальників. Ви можете додавати нових
          постачальників та відстежувати їхні заборгованості.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-7 w-7 text-blue-600" />
          <TypographyH3>Постачальники</TypographyH3>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <CreateSupplierForm onCreate={handleCreate} />

        <DataTable<SupplierStats, SupplierStats[], SupplierUpdateInput>
          columns={tableColumns}
          data={tableData}
          emptyComponent={emptyTable}
          isLoading={isLoadingData}
          onDelete={(id: string) => deleteSupplier.mutateAsync(id)}
          onFetch={fetchSupplier}
          onUpdate={handleUpdate}
        />
      </CardContent>
    </Card>
  );
}
