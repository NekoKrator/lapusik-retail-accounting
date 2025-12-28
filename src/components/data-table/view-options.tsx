"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import type { ColumnMeta, Table } from "@tanstack/react-table";
import { RotateCcw, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function ViewOptions<TData>({ table }: { table: Table<TData> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="has-[>svg]:px-2 xl:has-[>svg]:px-2.5"
          size="sm"
          variant="outline"
        >
          <Settings2 />
          <p className="hidden xl:inline">Стовпці</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Перемикання стовпців</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => (
            <DropdownMenuCheckboxItem
              checked={column.getIsVisible()}
              className="capitalize"
              key={column.id}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
              onSelect={(e) => e.preventDefault()}
            >
              {(column.columnDef.meta as ColumnMeta<TData>)?.label ?? column.id}
            </DropdownMenuCheckboxItem>
          ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            table.resetColumnVisibility();
          }}
        >
          <RotateCcw /> Скинути
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
