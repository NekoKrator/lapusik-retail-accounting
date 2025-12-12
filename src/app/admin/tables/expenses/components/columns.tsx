"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { expenseCategories } from "@/lib/constants/expense-categories";
import { formatCurrency } from "@/lib/formatters";
import type { ExpenseWithInclude } from "@/schemas/expense-schema";

// import { ActionsCell } from "./actions-cell";

const calculateTotal = (
  data: ExpenseWithInclude[],
  accessor: keyof ExpenseWithInclude
) => data.reduce((acc, row) => acc + Number(row[accessor]), 0);

const getCategoryLabel = (category: string) => {
  const cat = expenseCategories.find((c) => c.key === category);
  return cat?.label || "Інше";
};

export const columns: ColumnDef<ExpenseWithInclude>[] = [
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
      label: "Категорія",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Категорія" />
    ),
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      const debtor = row.original.debtor;
      const supplierDelivery = row.original.supplierDelivery;
      const name =
        (debtor ? debtor.name : undefined) ||
        (supplierDelivery ? supplierDelivery?.supplier.name : undefined);

      const categoryName = getCategoryLabel(category);
      const content = name ? `${categoryName} (${name})` : categoryName;

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
