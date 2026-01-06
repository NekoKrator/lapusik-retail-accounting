"use client";

import type {
  ColumnDef,
  OnChangeFn,
  SortingState,
  Table as TableType,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { ViewOptions } from "@/components/data-table/view-options";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DeleteManyInput } from "@/schemas/common/delete-many-schema";
import type { FilterConfig, TableFilter } from "@/types/filter-types";
import { ResponsiveTooltip } from "../responsive-tooltip";
import { Spinner } from "../ui/spinner";
import { FiltersDialog } from "./filters-dialog";
import { Pagination } from "./pagination";

type WithId = {
  id: string;
};

type DataTableProps<TData extends WithId, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
  };

  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;

  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;

  filters?: TableFilter[];
  filterConfigs?: FilterConfig[];
  onFilterChange?: React.Dispatch<React.SetStateAction<TableFilter[]>>;

  isLoading?: boolean;
  emptyComponent?: React.ReactNode;
  additionalActions?: React.ReactNode;
  onFetch?: () => unknown;

  onDelete?: (payload: DeleteManyInput) => Promise<{ count: number }>;
  renderDeleteDialog?: (params: {
    selectedRowCount: number;
    table: TableType<TData>;
  }) => React.ReactNode;
};

export function DataTable<TData extends WithId, TValue>({
  columns,
  data,
  pagination,
  onPageChange,
  onPageSizeChange,
  isLoading,
  emptyComponent,
  onFetch,
  sorting,
  onSortingChange,
  additionalActions,

  filters,
  filterConfigs,
  onFilterChange,
  renderDeleteDialog,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getRowId: (originalRow) => originalRow.id,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: pagination.totalPages,
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({
              pageIndex: pagination.page - 1,
              pageSize: pagination.pageSize,
            })
          : updater;

      onPageChange(next.pageIndex + 1);
      onPageSizeChange(next.pageSize);
    },
    onSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    defaultColumn: {
      size: 150,
      minSize: 100,
    },
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.pageSize,
      },
    },
  });

  const rowsCount = table.getRowCount();

  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex justify-between gap-4 overflow-auto p-3">
        <div className="flex items-center gap-2">
          <ViewOptions table={table} />
          {onFilterChange && filters && filterConfigs && (
            <FiltersDialog
              configs={filterConfigs}
              filters={filters}
              onFiltersChange={onFilterChange}
            />
          )}
          {additionalActions}
          {renderDeleteDialog &&
            selectedRowCount > 0 &&
            renderDeleteDialog({ selectedRowCount, table })}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            {isLoading ? (
              <Spinner className="text-muted-foreground" />
            ) : (
              <span className="text-nowrap text-muted-foreground/60 text-xs">
                {rowsCount} {getPluralRows(rowsCount)}
              </span>
            )}
          </div>

          <Pagination table={table} />
          {onFetch && (
            <ResponsiveTooltip message="Оновити">
              <Button
                disabled={isLoading}
                onClick={onFetch}
                size="icon-sm"
                type="button"
                variant="outline"
              >
                <RefreshCw />
              </Button>
            </ResponsiveTooltip>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 px-3 pb-2">
        <div
          className="relative h-full overflow-auto rounded-md border"
          data-slot="table-container"
        >
          <Table
            className="table-fixed"
            style={{
              width: table.getCenterTotalSize(),
            }}
          >
            <TableHeader className="sticky top-0 bg-background shadow-[inset_0_-1px_0_var(--border)]">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      className="group/head relative h-10 select-none last:[&>.cursor-col-resize]:opacity-0"
                      key={header.id}
                      {...{
                        colSpan: header.colSpan,
                        style: {
                          width: header.getSize(),
                        },
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getCanResize() && (
                        <div
                          {...{
                            onDoubleClick: () => header.column.resetSize(),
                            onMouseDown: header.getResizeHandler(),
                            onTouchStart: header.getResizeHandler(),
                            className:
                              "group-last/head:hidden absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:translate-x-px",
                          }}
                        />
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length > 0 &&
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    key={row.id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell className="h-8" key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>

            {table.getRowCount() > 0 && (
              <TableFooter className="sticky bottom-0 bg-background shadow-[inset_0_1px_0_var(--border),inset_0_-1px_0_var(--border)]">
                {table.getFooterGroups().map((footerGroup) => (
                  <TableRow
                    className="hover:bg-transparent"
                    key={footerGroup.id}
                  >
                    {footerGroup.headers.map((footer) => (
                      <TableCell colSpan={footer.colSpan} key={footer.id}>
                        {footer.isPlaceholder
                          ? null
                          : flexRender(
                              footer.column.columnDef.footer,
                              footer.getContext()
                            )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableFooter>
            )}
          </Table>

          {table.getRowModel().rows.length === 0 && !isLoading && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {emptyComponent ?? "Нічого не знайдено."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const getPluralRows = (count: number) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return "рядків";
  }
  if (lastDigit === 1) {
    return "рядок";
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return "рядки";
  }
  return "рядків";
};
