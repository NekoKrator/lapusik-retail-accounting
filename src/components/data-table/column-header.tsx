import type { Column, SortDirection } from "@tanstack/react-table";

import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  ChevronsUpDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>;
  title: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function ColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: ColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const renderSortIndicator = (isSorted: false | SortDirection) => {
    if (isSorted === "desc") {
      return <ArrowDownWideNarrow />;
    }
    if (isSorted === "asc") {
      return <ArrowUpNarrowWide />;
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
