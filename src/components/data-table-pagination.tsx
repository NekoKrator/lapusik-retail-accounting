import type { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DataTablePaginationProps<TData> = {
  table: Table<TData>;
};

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const state = table.getState().pagination;

  const pageIndex = state.pageIndex; // 0-based
  const limit = state.limit;
  const pageCount = table.getPageCount(); // totalPages

  const canPrev = pageIndex > 0;
  const canNext = pageIndex + 1 < pageCount;

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-muted-foreground text-sm">
        Вибрано {table.getFilteredSelectedRowModel().rows.length} з{" "}
        {table.getFilteredRowModel().rows.length} рядків.
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="font-medium text-sm">Рядків на сторінку</p>

          <Select
            onValueChange={(value) => table.setPageSize(Number(value))}
            value={`${limit}`}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={limit} />
            </SelectTrigger>

            <SelectContent side="top">
              {[10, 20, 25, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-[100px] items-center justify-center font-medium text-sm">
          Сторінка {pageIndex + 1} з {pageCount}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            className="hidden size-8 lg:flex"
            disabled={!canPrev}
            onClick={() => table.setPageIndex(0)}
            size="icon"
            variant="outline"
          >
            <span className="sr-only">Перша</span>
            <ChevronsLeft />
          </Button>

          <Button
            className="size-8"
            disabled={!canPrev}
            onClick={() => table.setPageIndex(pageIndex - 1)}
            size="icon"
            variant="outline"
          >
            <span className="sr-only">Попередня</span>
            <ChevronLeft />
          </Button>

          <Button
            className="size-8"
            disabled={!canNext}
            onClick={() => table.setPageIndex(pageIndex + 1)}
            size="icon"
            variant="outline"
          >
            <span className="sr-only">Наступна</span>
            <ChevronRight />
          </Button>

          <Button
            className="hidden size-8 lg:flex"
            disabled={!canNext}
            onClick={() => table.setPageIndex(pageCount - 1)}
            size="icon"
            variant="outline"
          >
            <span className="sr-only">Остання</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
