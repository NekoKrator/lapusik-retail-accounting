"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency } from "@/lib/formatters";
import type { SupplierStats } from "@/schemas/supplier-schema";
import { ActionsCell } from "./actions-cell";

const calculateTotal = (data: SupplierStats[], accessor: keyof SupplierStats) =>
  data.reduce((acc, row) => acc + Number(row[accessor]), 0);

export const columns: ColumnDef<SupplierStats>[] = [
  {
    accessorKey: "name",
    size: 300,
    meta: {
      label: "Постачальник",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Постачальник" />
    ),
    cell: ({ row }) => {
      const content = row.getValue("name") as string;

      return (
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <p className="truncate whitespace-pre font-semibold">{content}</p>
            </TooltipTrigger>
            <TooltipContent className="wrap-break-word max-h-64 max-w-xs overflow-y-auto">
              <p className="whitespace-pre-wrap">{content}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "operationsCount",
    meta: {
      label: "Операцій",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Операцій" />
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
    accessorKey: "paidByCashier",
    meta: {
      label: "Касир",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Касир" />
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
      label: "Власник",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Власник" />
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
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Усього" />
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
    accessorKey: "currentDebt",
    meta: {
      label: "Борг",
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
    id: "actions",
    enableHiding: false,
    maxSize: 51,
    cell: (props) => <ActionsCell row={props.row} table={props.table} />,
  },
];
