"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH3 } from "@/components/ui/typography";
import { useShiftPaginated } from "@/hooks/api/shift/use-shift";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { PaginatedTable } from "../paginated-table";
import { columns } from "./components/columns";
import EmptyShifts from "./components/empty-shifts";

export default function ShiftsTable() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const { data, isFetching, refetch } = useShiftPaginated({
    page,
    limit,
  });

  const handleRefresh = async () => {
    queryClient.removeQueries({ queryKey: [API_ENDPOINTS.SHIFT] });
    await refetch();
  };

  useEffect(() => {
    if (data?.totalPages) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  const items = data?.items ?? [];

  return (
    <Card className="h-full w-full rounded-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="text-purple-600" />
          <TypographyH3>Робочі зміни</TypographyH3>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <PaginatedTable
          columns={columns}
          emptyComponent={<EmptyShifts />}
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
        />
      </CardContent>
    </Card>
  );
}
