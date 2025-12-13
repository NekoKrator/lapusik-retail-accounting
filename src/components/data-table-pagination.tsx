import type { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const limit = state.pageSize;
  const pageCount = table.getPageCount(); // totalPages

  const canPrev = pageIndex > 0;
  const canNext = pageIndex + 1 < pageCount;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <p className="font-medium text-sm">Рядків на сторінку</p>

          <Select
            onValueChange={(value) => table.setPageSize(Number(value))}
            value={`${limit}`}
          >
            <SelectTrigger className="w-[70px]" size="sm">
              <SelectValue placeholder={limit} />
            </SelectTrigger>

            <SelectContent side="top">
              {[10, 20, 50, 100, 200].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
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

          <div className="flex w-12 items-center justify-center font-medium text-sm">
            {pageIndex + 1} / {pageCount}
          </div>

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
        </div>
      </div>
    </div>
  );
}
