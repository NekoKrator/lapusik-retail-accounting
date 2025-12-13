"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/formatters";
import type { DebtorStats } from "../debtors-table";

// import { ActionsCell } from "./actions-cell";

const calculateTotal = (data: DebtorStats[], accessor: keyof DebtorStats) =>
  data.reduce((acc, row) => acc + Number(row[accessor]), 0);

export const columns: ColumnDef<DebtorStats>[] = [
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
    accessorKey: "name",
    meta: {
      label: "Ім'я",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ім'я" />
    ),
    cell: ({ row }) => {
      const content = row.getValue("name") as string;

      return (
        <div className="truncate" title={content}>
          {row.getValue("name")}
        </div>
      );
    },
  },
  {
    accessorKey: "totalCurrentDebt",
    meta: {
      label: "Сума поточних боргів",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Сума поточних боргів" />
    ),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("totalCurrentDebt"));

      return (
        <div
          className={`truncate text-end ${
            amount > 0 ? "text-red-600" : "text-green-600"
          }`}
        >
          {formatCurrency(amount)}
        </div>
      );
    },
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "totalCurrentDebt");
      return (
        <div
          className={`truncate text-end font-bold ${
            total > 0 ? "text-red-600" : "text-green-600"
          }`}
        >
          {formatCurrency(total)}
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    meta: {
      label: "Сума боргів",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Сума боргів" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">
        {formatCurrency(row.getValue("totalAmount"))}
      </div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "totalAmount");
      return (
        <div className="truncate text-end font-bold">
          {formatCurrency(total)}
        </div>
      );
    },
  },
  {
    accessorKey: "totalPaidAmount",
    meta: {
      label: "Сума сплати",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Сума сплати" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">
        {formatCurrency(row.getValue("totalPaidAmount"))}
      </div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "totalPaidAmount");
      return (
        <div className="truncate text-end font-bold">
          {formatCurrency(total)}
        </div>
      );
    },
  },

  {
    accessorKey: "totalIsActive",
    meta: {
      label: "Кількість наявних боргів",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Кількість наявних боргів" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">{row.getValue("totalIsActive")}</div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "totalIsActive");
      return <div className="truncate text-end font-bold">{total}</div>;
    },
  },
  {
    accessorKey: "totalIsPaid",
    meta: {
      label: "Кількість виплачених боргів",
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Кількість виплачених боргів"
      />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">{row.getValue("totalIsPaid")}</div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "totalIsPaid");
      return <div className="truncate text-end font-bold">{total}</div>;
    },
  },
  {
    accessorKey: "totalIsCanceled",
    meta: {
      label: "Кількість скасованих боргів",
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Кількість скасованих боргів"
      />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">{row.getValue("totalIsCanceled")}</div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "totalIsCanceled");
      return <div className="truncate text-end font-bold">{total}</div>;
    },
  },
  {
    accessorKey: "operationsCount",
    meta: {
      label: "Загальна кількість боргів",
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Загальна кількість боргів"
      />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">{row.getValue("operationsCount")}</div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "operationsCount");
      return <div className="truncate text-end font-bold">{total}</div>;
    },
  },
  // {
  // 	id: "actions",
  // 	enableHiding: false,
  // 	maxSize: 51,
  // 	cell: (props) => <ActionsCell row={props.row} table={props.table} />,
  // },
];
