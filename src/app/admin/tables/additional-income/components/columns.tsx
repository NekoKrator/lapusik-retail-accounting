"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/formatters";
import type { AdditionalIncomeWithDebtor } from "@/schemas/additional-income-schema";

// import { ActionsCell } from "./actions-cell";

const calculateTotal = (
  data: AdditionalIncomeWithDebtor[],
  accessor: keyof AdditionalIncomeWithDebtor
) => data.reduce((acc, row) => acc + Number(row[accessor]), 0);

export const columns: ColumnDef<AdditionalIncomeWithDebtor>[] = [
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
    accessorKey: "category",
    meta: {
      label: "Джерело",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Джерело" />
    ),
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      const debtor = row.original.debtor;
      const content = debtor ? `${category} (${debtor.name})` : category;

      return (
        <div className="truncate" title={content}>
          {content}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    meta: {
      label: "Сума",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Сума" />
    ),
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
      <DataTableColumnHeader column={column} title="Час створення" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">
        {format(row.getValue("createdAt"), "dd.MM.yy, HH:mm")}
      </div>
    ),
  },
  // {
  // 	id: "actions",
  // 	enableHiding: false,
  // 	maxSize: 51,
  // 	cell: (props) => <ActionsCell row={props.row} table={props.table} />,
  // },
];
