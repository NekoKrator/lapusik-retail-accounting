"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";

type PaginatedTableProps<TItem, TRow> = {
  items?: TItem[];
  data?: TRow[];
  columns: ColumnDef<TRow, unknown>[];
  isFetching: boolean;
  emptyComponent?: React.ReactNode;

  transformItems?: (items: TItem[]) => TRow[];

  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
  };

  onFetch: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (limit: number) => void;

  skeletonRows?: number;
};

export function PaginatedTable<TItem, TRow>({
  items = [],
  data,
  columns,
  isFetching,
  transformItems,
  emptyComponent,
  pagination,
  onFetch,
  onPageChange,
  onPageSizeChange,
  skeletonRows = 4,
}: PaginatedTableProps<TItem, TRow>) {
  const tableData = useMemo<TRow[]>(() => {
    if (isFetching && !data) {
      return Array.from<TRow>({ length: skeletonRows }).fill({} as TRow);
    }

    if (data) {
      return data;
    }
    if (transformItems) {
      return transformItems(items);
    }

    return items as unknown as TRow[];
  }, [isFetching, data, items, transformItems, skeletonRows]);

  const tableColumns = useMemo(
    () =>
      isFetching
        ? columns.map((column) => ({
            ...column,
            cell: () => <Skeleton className="h-5" />,
            footer: () => <Skeleton className="h-5" />,
          }))
        : columns,
    [isFetching, columns]
  );

  return (
    <DataTable<TRow, TRow[]>
      columns={tableColumns}
      data={tableData}
      emptyComponent={emptyComponent}
      onFetch={onFetch}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      pagination={pagination}
    />
  );
}
