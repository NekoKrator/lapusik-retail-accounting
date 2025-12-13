"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/formatters";
import type { SupplierStats } from "@/schemas/supplier-schema";
import { ActionsCell } from "./actions-cell";

const calculateTotal = (data: SupplierStats[], accessor: keyof SupplierStats) =>
  data.reduce((acc, row) => acc + Number(row[accessor]), 0);

export const columns: ColumnDef<SupplierStats>[] = [
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
      label: "Назва",
      isGrow: true,
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Назва" />
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
    accessorKey: "currentDebt",
    meta: {
      label: "Борг",
      isGrow: true,
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Борг" />
    ),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("currentDebt"));
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
      const total = calculateTotal(table.options.data, "currentDebt");
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
    accessorKey: "paidByCashier",
    meta: {
      label: "Сплачено касиром",
      isGrow: true,
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Сплачено касиром" />
    ),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("paidByCashier"));
      return <div className="truncate text-end">{formatCurrency(amount)}</div>;
    },
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "paidByCashier");
      return (
        <div className="truncate text-end font-bold">
          {formatCurrency(total)}
        </div>
      );
    },
  },
  {
    accessorKey: "paidByOwner",
    meta: {
      label: "Сплачено власником",
      isGrow: true,
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Сплачено власником" />
    ),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("paidByOwner"));
      return <div className="truncate text-end">{formatCurrency(amount)}</div>;
    },
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "paidByOwner");
      return (
        <div className="truncate text-end font-bold">
          {formatCurrency(total)}
        </div>
      );
    },
  },
  {
    accessorKey: "totalPaid",
    meta: {
      label: "Усього",
      isGrow: true,
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Усього сплачено" />
    ),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("totalPaid"));
      return <div className="truncate text-end">{formatCurrency(amount)}</div>;
    },
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "totalPaid");
      return (
        <div className="truncate text-end font-bold">
          {formatCurrency(total)}
        </div>
      );
    },
  },
  {
    accessorKey: "currentOperationsCount",
    meta: {
      label: "Кількість наявних боргів",
      isGrow: true,
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Кількість наявних боргів" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">
        {row.getValue("currentOperationsCount")}
      </div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(
        table.options.data,
        "currentOperationsCount"
      );
      return <div className="truncate text-end font-bold">{total}</div>;
    },
  },
  {
    accessorKey: "paidOperationsCount",
    meta: {
      label: "Кількість сплачених боргів",
      isGrow: true,
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Кількість сплачених боргів"
      />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">
        {row.getValue("paidOperationsCount")}
      </div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "paidOperationsCount");
      return <div className="truncate text-end font-bold">{total}</div>;
    },
  },
  {
    accessorKey: "canceledOperationsCount",
    meta: {
      label: "Кількість скасованих боргів",
      isGrow: true,
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Кількість скасованих боргів"
      />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">
        {row.getValue("canceledOperationsCount")}
      </div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(
        table.options.data,
        "canceledOperationsCount"
      );
      return <div className="truncate text-end font-bold">{total}</div>;
    },
  },
  {
    accessorKey: "operationsCount",
    meta: {
      label: "Загальна кількість боргів",
      isGrow: true,
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
  {
    id: "actions",
    enableHiding: false,
    maxSize: 48,
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
