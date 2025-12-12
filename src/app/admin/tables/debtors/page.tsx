"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyH3 } from "@/components/ui/typography";
import { useDebtorsPaginated } from "@/hooks/api/debtor/use-debtors";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { columns } from "./components/columns";
import EmptyDebtors from "./components/empty-debtors";

export type DebtorStats = {
  id: string;
  name: string;
  operationsCount: number;
  totalAmount: number;
  totalPaidAmount: number;
  totalCurrentDebt: number;
  totalIsActive: number;
  totalIsPaid: number;
  totalIsCanceled: number;
};

export default function Page() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const { data, isFetching, refetch } = useDebtorsPaginated({
    page,
    limit,
  });

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

  const debtorsStats = useMemo(
    () =>
      items?.map((s) => {
        const initial = {
          totalAmount: 0,
          totalPaidAmount: 0,
          totalCurrentDebt: 0,
          totalIsActive: 0,
          totalIsPaid: 0,
          totalIsCanceled: 0,
        };

        const totals = s.debts.reduce((acc, d) => {
          const amount = Number(d.amount);
          const paidAmount = Number(d.paidAmount);

          acc.totalAmount += amount;
          acc.totalPaidAmount += paidAmount;
          acc.totalCurrentDebt += amount - paidAmount;
          acc.totalIsActive += d.status === "ACTIVE" ? 1 : 0;
          acc.totalIsPaid += d.status === "PAID" ? 1 : 0;
          acc.totalIsCanceled += d.status === "CANCELED" ? 1 : 0;

          return acc;
        }, initial);

        return {
          id: s.id,
          name: s.name,
          operationsCount: s.debts.length,
          ...totals,
        };
      }),
    [items]
  );

  const tableData = useMemo<DebtorStats[]>(
    () =>
      isFetching && !data
        ? Array.from<DebtorStats>({ length: 4 }).fill({} as DebtorStats)
        : debtorsStats,
    [isFetching, debtorsStats, data]
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
          <Users className="text-orange-600" />
          <TypographyH3>Боржники</TypographyH3>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <DataTable<DebtorStats, DebtorStats[]>
          columns={tableColumns}
          data={tableData}
          emptyComponent={<EmptyDebtors />}
          isLoading={isFetching}
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
