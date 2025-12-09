import type { Column, SortDirection } from "@tanstack/react-table";

import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  ChevronsUpDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DataTableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>;
  title: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const renderSortIndicator = (isSorted: false | SortDirection) => {
    if (isSorted === "desc") {
      return <ArrowDownWideNarrow />;
    }
    if (isSorted === "asc") {
      return <ArrowUpWideNarrow />;
    }
    return <ChevronsUpDown />;
  };

  return (
    <Button
      className={cn(
        "flex w-full items-center justify-between px-0 has-[>svg]:px-0",
        className
      )}
      onClick={() => column.toggleSorting()}
      variant="text"
    >
      <div className="truncate">{title}</div>
      {renderSortIndicator(column.getIsSorted())}
    </Button>
  );
}
