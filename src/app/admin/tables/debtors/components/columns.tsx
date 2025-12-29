"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ColumnHeader } from "@/components/data-table/column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/formatters";
import type { DebtorStats } from "@/schemas/debtor/debtor-schema";

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
    accessorKey: "name",
    meta: {
      label: "Ім'я",
    },
    header: ({ column }) => <ColumnHeader column={column} title="Ім'я" />,
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
    accessorKey: "totalDebt",
    meta: {
      label: "Загальна сума боргів",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Загальна сума боргів" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">
        {formatCurrency(row.getValue("totalDebt"))}
      </div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "totalDebt");
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
      label: "Загальна сума погашення",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Загальна сума погашення" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">
        {formatCurrency(row.getValue("totalPaid"))}
      </div>
    ),
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
    accessorKey: "activeDebtsCount",
    meta: {
      label: "Наявні борги",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Наявні борги" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">
        {row.getValue("activeDebtsCount")}
      </div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "activeDebtsCount");
      return <div className="truncate text-end font-bold">{total}</div>;
    },
  },
  {
    accessorKey: "paidDebtsCount",
    meta: {
      label: "Погашені борги",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Погашені борги" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">{row.getValue("paidDebtsCount")}</div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "paidDebtsCount");
      return <div className="truncate text-end font-bold">{total}</div>;
    },
  },
  {
    accessorKey: "canceledDebtsCount",
    meta: {
      label: "Анульовані борги",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Анульовані борги" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">
        {row.getValue("canceledDebtsCount")}
      </div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "canceledDebtsCount");
      return <div className="truncate text-end font-bold">{total}</div>;
    },
  },
  {
    accessorKey: "totalDebtsCount",
    meta: {
      label: "Усього боргів",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Усього боргів" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">{row.getValue("totalDebtsCount")}</div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "totalDebtsCount");
      return <div className="truncate text-end font-bold">{total}</div>;
    },
  },
  {
    id: "__spacer",
    size: 24,
    enableResizing: false,
  },
];
