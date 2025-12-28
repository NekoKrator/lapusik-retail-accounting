import type { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";

type PaginationProps<TData> = {
  table: Table<TData>;
};

export function Pagination<TData>({ table }: PaginationProps<TData>) {
  const state = table.getState().pagination;

  const pageIndex = state.pageIndex;
  const limit = state.pageSize;
  const pageCount = table.getPageCount();

  const canPrev = pageIndex > 0;
  const canNext = pageIndex + 1 < pageCount;

  const [pageInput, setPageInput] = useState(pageIndex + 1);

  useEffect(() => {
    setPageInput(pageIndex + 1);
  }, [pageIndex]);

  const applyPage = () => {
    if (Number.isNaN(pageInput)) {
      return;
    }

    const nextPage = Math.min(Math.max(pageInput, 1), pageCount);

    table.setPageIndex(nextPage - 1);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Select
          onValueChange={(value) => table.setPageSize(Number(value))}
          value={`${limit}`}
        >
          <SelectTrigger className="w-[70px]" size="sm">
            <SelectValue placeholder={limit} />
          </SelectTrigger>

          <SelectContent side="top">
            <SelectGroup>
              <SelectLabel>Рядків на сторінку</SelectLabel>
              {[10, 20, 50, 100, 200].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="flex items-center">
          <Button
            className="size-8 rounded-none rounded-l-md"
            disabled={!canPrev}
            onClick={() => table.setPageIndex(pageIndex - 1)}
            size="icon"
            variant="outline"
          >
            <ChevronLeft />
          </Button>

          <Input
            className="number-input-no-spin h-8 w-12 rounded-none text-center text-sm"
            onBlur={applyPage}
            onChange={(e) => setPageInput(Number(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyPage();
              }
            }}
            type="number"
            value={pageInput}
          />

          <Button
            className="size-8 rounded-none rounded-r-md"
            disabled={!canNext}
            onClick={() => table.setPageIndex(pageIndex + 1)}
            size="icon"
            variant="outline"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
