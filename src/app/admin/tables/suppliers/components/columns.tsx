"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ColumnHeader } from "@/components/data-table/column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/formatters";
import type { SupplierStats } from "@/schemas/supplier/supplier-schema";
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
    },
    header: ({ column }) => <ColumnHeader column={column} title="Назва" />,
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
      label: "Борг",
    },
    header: ({ column }) => <ColumnHeader column={column} title="Борг" />,
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("totalCurrentDebt"));
      return <div className="truncate text-end">{formatCurrency(amount)}</div>;
    },
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "totalCurrentDebt");
      return (
        <div className="truncate text-end font-bold">
          {formatCurrency(total)}
        </div>
      );
    },
  },
  {
    accessorKey: "totalPaidByCashier",
    meta: {
      label: "Сплачено касиром",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Сплачено касиром" />
    ),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("totalPaidByCashier"));
      return <div className="truncate text-end">{formatCurrency(amount)}</div>;
    },
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "totalPaidByCashier");
      return (
        <div className="truncate text-end font-bold">
          {formatCurrency(total)}
        </div>
      );
    },
  },
  {
    accessorKey: "totalPaidByOwner",
    meta: {
      label: "Сплачено власником",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Сплачено власником" />
    ),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("totalPaidByOwner"));
      return <div className="truncate text-end">{formatCurrency(amount)}</div>;
    },
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "totalPaidByOwner");
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
      label: "Усього сплачено",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Усього сплачено" />
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
    accessorKey: "activeDeliveriesCount",
    meta: {
      label: "Поточні борги",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Поточні борги" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">
        {row.getValue("activeDeliveriesCount")}
      </div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "activeDeliveriesCount");
      return <div className="truncate text-end font-bold">{total}</div>;
    },
  },
  {
    accessorKey: "paidDeliveriesCount",
    meta: {
      label: "Погашені борги",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Погашені борги" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">
        {row.getValue("paidDeliveriesCount")}
      </div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "paidDeliveriesCount");
      return <div className="truncate text-end font-bold">{total}</div>;
    },
  },
  {
    accessorKey: "canceledDeliveriesCount",
    meta: {
      label: "Скасовані борги",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Скасовані борги" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">
        {row.getValue("canceledDeliveriesCount")}
      </div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(
        table.options.data,
        "canceledDeliveriesCount"
      );
      return <div className="truncate text-end font-bold">{total}</div>;
    },
  },
  {
    accessorKey: "totalDeliveriesCount",
    meta: {
      label: "Кількість поставок",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Кількість поставок" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">
        {row.getValue("totalDeliveriesCount")}
      </div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "totalDeliveriesCount");
      return <div className="truncate text-end font-bold">{total}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    size: 24,
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
