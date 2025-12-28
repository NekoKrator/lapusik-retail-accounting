"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ColumnHeader } from "@/components/data-table/column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/formatters";
import type { AdditionalIncomeStats } from "@/schemas/additional-income/additional-income-schema";

const calculateTotal = (
  data: AdditionalIncomeStats[],
  accessor: keyof AdditionalIncomeStats
) => data.reduce((acc, row) => acc + Number(row[accessor]), 0);

export const columns: ColumnDef<AdditionalIncomeStats>[] = [
  {
    id: "select",
    maxSize: 32,
    header: ({ table }) => (
      <Checkbox
        aria-label="Обрати все"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Обрати строку"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "displayUsername",
    meta: {
      label: "Відділ",
    },
    header: ({ column }) => <ColumnHeader column={column} title="Відділ" />,
    cell: ({ row }) => {
      const displayUsername = row.original.displayUsername;
      return <div className="truncate">{displayUsername}</div>;
    },
  },
  {
    accessorKey: "category",
    meta: {
      label: "Джерело",
    },
    header: ({ column }) => <ColumnHeader column={column} title="Джерело" />,
    cell: ({ row }) => {
      const category = row.getValue("category") as string;

      return (
        <div className="truncate" title={category}>
          {category}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    meta: {
      label: "Сума",
    },
    header: ({ column }) => <ColumnHeader column={column} title="Сума" />,
    cell: ({ row }) => (
      <div className="truncate text-end">
        {formatCurrency(row.getValue("amount"))}
      </div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "amount");
      return (
        <div className="truncate text-end font-bold">
          {formatCurrency(total)}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    meta: {
      label: "Час створення",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Час створення" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">
        {format(row.getValue("createdAt"), "dd.MM.yy, HH:mm")}
      </div>
    ),
  },
  {
    id: "__spacer",
    size: 24,
    enableResizing: false,
  },
];
